import JSZip from "jszip";
import { GoogleGenAI } from "@google/genai";

import { els } from "./dom";

/* =========================
   Public entry
========================= */

export function initExtensionAnalysis() {
  if (els.extAnalyzeBtn) {
    els.extAnalyzeBtn.addEventListener("click", analyzeExtension);
  }
  if (els.codeCopyBtn) {
    els.codeCopyBtn.addEventListener("click", copyCodeCallback);
  }
}

/* =========================
   State
========================= */

let extractedZip = null;
let currentExtensionId = null,
  formattedCode = null,
  currentFile = null;

/* =========================
   Analyze
========================= */

async function analyzeExtension() {
  const id = els.extensionIdInput.value.trim();
  if (!id) return;

  els.extAnalysisOutput.textContent = "Processing CRX...";
  els.directoryTree.innerHTML = "";
  els.directoryFileViewer.querySelector("pre").textContent = "";

  try {
    const url =
      `https://clients2.google.com/service/update2/crx` +
      `?response=redirect&prodversion=120.0` +
      `&acceptformat=crx3` +
      `&x=id%3D${id}%26installsource%3Dondemand%26uc`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Download failed");

    const buffer = await res.arrayBuffer();
    const zipData = stripCrxHeader(buffer);

    extractedZip = await JSZip.loadAsync(zipData);
    currentExtensionId = id;

    els.extAnalysisOutput.textContent = "";
    els.downloadExtSourceCode.disabled = false;
    els.downloadExtSourceCode.onclick = downloadZip;

    renderFileTree(extractedZip);
    attachManifestAnalyzer();
  } catch (err) {
    els.extAnalysisOutput.textContent = String(err);
  }
}

/* =========================
   CRX handling
========================= */

function stripCrxHeader(buffer) {
  const view = new DataView(buffer);

  const magic = String.fromCharCode(
    view.getUint8(0),
    view.getUint8(1),
    view.getUint8(2),
    view.getUint8(3),
  );

  if (magic !== "Cr24") {
    throw new Error("Invalid CRX file");
  }

  const version = view.getUint32(4, true);

  if (version === 2) {
    const keyLen = view.getUint32(8, true);
    const sigLen = view.getUint32(12, true);
    return buffer.slice(16 + keyLen + sigLen);
  }

  if (version === 3) {
    const headerSize = view.getUint32(8, true);
    return buffer.slice(12 + headerSize);
  }

  throw new Error("Unsupported CRX version");
}

/* =========================
   Download
========================= */

async function downloadZip() {
  if (!extractedZip || !currentExtensionId) return;

  const outZip = new JSZip();

  for (const [path, file] of Object.entries(extractedZip.files)) {
    if (file.dir) {
      outZip.folder(path);
    } else {
      const content = await file.async("uint8array");
      outZip.file(path, content);
    }
  }

  const blob = await outZip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${currentExtensionId}.zip`;
  a.click();

  URL.revokeObjectURL(url);
}

/* =========================
   Directory tree
========================= */

function renderFileTree(zip) {
  console.log(zip, "zio");
  const tree = {};

  Object.keys(zip.files).forEach((path) => {
    const parts = path.split("/").filter(Boolean);
    let node = tree;

    parts.forEach((part, i) => {
      if (!node[part]) {
        node[part] = {
          __path: parts.slice(0, i + 1).join("/"),
          __isFile: i === parts.length - 1 && !zip.files[path].dir,
          __children: {},
        };
      }
      node = node[part].__children;
    });
  });

  els.directoryTree.appendChild(buildTreeDom(tree));
}

function buildTreeDom(tree) {
  const ul = document.createElement("ul");

  for (const key in tree) {
    const item = tree[key];
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = key;

    if (item.__isFile) {
      span.dataset.type = "file";
      span.onclick = () => openFile(item.__path);
    } else {
      span.dataset.type = "folder";
      span.onclick = () => {
        li.classList.toggle("open");
      };
    }

    li.appendChild(span);

    const children = buildTreeDom(item.__children);
    if (children.children.length) {
      li.appendChild(children);
    }

    ul.appendChild(li);
  }

  return ul;
}

/* =========================
   File viewer
========================= */

async function openFile(path) {
  const file = extractedZip.files[path];
  if (!file) return;

  const raw = await file.async("text");
  formattedCode = raw;
  currentFile = path;

  els.directoryFileViewer.querySelector("pre").textContent = formattedCode;
}

async function copyCodeCallback() {
  if (!formattedCode) {
    alert("please select a file");
    return;
  }
  await navigator.clipboard.writeText(formattedCode);
  alert("copied code of " + currentFile);
}

/* =========================
   Manifest analysis UI + AI integration
========================= */
/* =========================
   Gemini helper (client-side)
========================= */

/* =========================
   Gemini helper (client-side)
========================= */

async function generateGeminiResponse({ apiKey, prompt, enableSearch = true }) {
  const ai = new GoogleGenAI({ apiKey });

  // build model params
  const params = {
    model: "gemini-2.5-flash", // or whichever model you prefer
    contents: prompt,
  };

  // if search grounding is desired add tools
  if (enableSearch) {
    params.tools = [{ google_search: {} }];
  }

  const response = await ai.models.generateContent(params);

  // SDK returns .text on the response object
  return response.text || "";
}

function buildAIManifestPrompt(manifest, permsText, localeMessagesText) {
  return `
You are a security focused assistant analyzing a Chrome extension. Use the resolved manifest fields and the provided locale messages for context.

Extension details:
name: ${manifest.name || "N/A"}
version: ${manifest.version || "N/A"}
description: ${manifest.description || "N/A"}

Locale messages (key: message):
${localeMessagesText || "(none provided)"}

Declared permissions:
${permsText}

Important rules for classification:
1) Consider the manifest and locale messages together as the extension intent.
2) For host permissions, interpret patterns literally:
   - exact hosts like https://api.example.com/* are lower risk if they match the extension purpose.
   - wildcard hosts like *://*/* or https://*/ are high risk and should be suspicious or danger.
   - large scopes like "://*.com/*" are overbroad and should be suspicious or danger unless the description clearly justifies it.
3) For content_scripts matches, judge whether the listed sites align with the extension intent. If content scripts target a narrow set of sites that match the description, that lowers suspicion.
4) Optional permissions should be treated less severe than required permissions but still evaluated.
5) If a permission could allow reading or modifying user content or network traffic and no clear justification exists, mark it danger.
6) Keep each reason brief, 15 to 80 characters, and concrete.
7) Be conservative: when in doubt, mark suspicious rather than ok.

Task:
For every declared permission and host pattern, produce one verdict entry. Include optional permissions with "(optional)" appended to their permission string so they are evaluated separately.

Output format:
Return ONLY valid JSON matching this schema. Do not include any explanation or text outside the JSON object.

{
  "verdicts": [
    {
      "permission": "<permission string, append ' (optional)' if optional>",
      "verdict": "ok" | "suspicious" | "danger",
      "reason": "<short explanation, 15-80 chars>"
    }
  ],
  "summary": "<one-line summary>"
}
`.trim();
}

async function geminiAnalyzePermissions({ apiKey, manifest, messages }) {
  const permissions = [
    ...(manifest.permissions || []),
    ...(manifest.host_permissions || []),
    ...(manifest.optional_permissions || []),
  ];

  const permsText = permissions.length
    ? permissions.map((p) => `- ${p}`).join("\n")
    : "none";

  const localeMessagesText = messages
    ? Object.entries(messages)
        .map(([k, v]) => `${k}: "${(v.message || "").replace(/\n/g, "\\n")}"`)
        .join("\n")
    : "";

  const prompt = buildAIManifestPrompt(manifest, permsText, localeMessagesText);

  return await generateGeminiResponse({
    apiKey,
    prompt,
    enableSearch: true,
  });
}

// Attach analyzer whenever extractedZip is available.
export async function attachManifestAnalyzer() {
  // clear previous UI
  const container = els.analysisContainer;
  if (!container) return;

  // try to find manifest.json
  const manifest = await findManifestJson();
  if (!manifest) {
    container
      .querySelector(".ai-header")
      .insertAdjacentHTML(
        "beforeend",
        `<div style="color:#666;font-size:13px">No manifest.json found</div>`,
      );
    return;
  }

  // Render manifest basic info
  populateManifestUI(manifest);

  const { messages } = await findOneLocaleMessages();
  // trigger an automatic AI scan in background
  triggerAICheck(manifest, messages);
}

async function findManifestJson() {
  if (!extractedZip) return null;
  const manifestPaths = [
    "manifest.json",
    "src/manifest.json",
    "dist/manifest.json",
    "app/manifest.json",
  ];
  for (const p of Object.keys(extractedZip.files)) {
    if (p.toLowerCase().endsWith("manifest.json")) {
      try {
        const txt = await extractedZip.files[p].async("text");
        return JSON.parse(txt);
      } catch (err) {
        console.warn("failed to parse manifest", p, err);
        return null;
      }
    }
  }
  return null;
}
async function findOneLocaleMessages() {
  if (!extractedZip) return null;

  // First try the default locale from manifest.json
  const manifestEntry = await findManifestJson();
  let defaultLocale = null;
  try {
    defaultLocale = manifestEntry?.default_locale || null;
  } catch {}

  // Helper to try loading a messages.json for a given locale code
  const loadLocaleJson = async (locale) => {
    const path = `_locales/${locale}/messages.json`;
    const file = extractedZip.files[path];
    if (file) {
      try {
        return JSON.parse(await file.async("text"));
      } catch (err) {
        console.warn("Failed to parse locale messages", path, err);
      }
    }
    return null;
  };

  if (defaultLocale) {
    const localeData = await loadLocaleJson(defaultLocale);
    if (localeData) {
      return { locale: defaultLocale, messages: localeData };
    }
  }

  // If no default found or no file there, find any locale folder
  const localeFolders = Object.keys(extractedZip.files)
    // Match folder segments under _locales
    .map((p) => {
      const parts = p.split("/");
      if (parts[0] === "_locales" && parts[1]) {
        return parts[1];
      }
      return null;
    })
    .filter((loc, idx, arr) => loc && arr.indexOf(loc) === idx);

  for (const loc of localeFolders) {
    const localeData = await loadLocaleJson(loc);
    if (localeData) {
      return { locale: loc, messages: localeData };
    }
  }

  return null;
}

function populateManifestUI(manifest) {
  const summary = [];
  if (manifest.version) summary.push(`v${escapeHtml(manifest.version)}`);
  const summaryHTML = `<div style="margin-top:8px;color:#333;font-size:13px">${summary.join(" ")} </div>`;
  const container = document.querySelector(".analysis-info-container");
  container.querySelector(".ai-summary").innerHTML = summaryHTML;

  // permissions
  const permListElem = container.querySelector("#ai-permissions-list");
  permListElem.innerHTML = "";

  let perms = [];
  if (Array.isArray(manifest.permissions)) perms = manifest.permissions.slice();
  if (manifest.host_permissions && Array.isArray(manifest.host_permissions)) {
    // manifest v3 host_permissions combine hosts
    perms = perms.concat(manifest.host_permissions);
  }
  if (
    manifest.optional_permissions &&
    Array.isArray(manifest.optional_permissions)
  ) {
    perms = perms.concat(
      manifest.optional_permissions.map((p) => `${p} (optional)`),
    );
  }

  if (perms.length === 0) {
    permListElem.innerHTML = `<div style="grid-column:1/-1;color:#666">No permissions declared</div>`;
    return;
  }

  // render rows; default status unknown
  perms.forEach((p) => {
    const permName = escapeHtml(p);
    const row = document.createElement("div");
    row.className = "permission-row";
    row.innerHTML = `
      <div class="permission-name" data-perm="${permName}">
        <span style="opacity:0.7">▹</span>
        <span>${permName}</span>
      </div>
      <div>
        <div class="perm-status unknown" data-perm="${permName}">pending</div>
      </div>
      <div class="permission-reason" data-perm-reason="${permName}" style="display:none"></div>
    `;
    permListElem.appendChild(row);
  });
}

async function triggerAICheck(manifest, messages) {
  const container = document.querySelector(".analysis-info-container");
  const spinnerWrap = container.querySelector("#ai-spinner-wrapper");

  const apiKey = document.getElementById("gemini-api-key-inp")?.value?.trim();

  // silently skip if no key
  if (!apiKey) return;

  spinnerWrap.style.display = "inline-block";

  try {
    const modelText = await geminiAnalyzePermissions({
      apiKey,
      manifest,
      messages,
    });

    const txt = modelText.trim(); //raw
    const start = txt.indexOf("{");
    const end = txt.lastIndexOf("}");
    const parsed =
      start !== -1 && end !== -1
        ? JSON.parse(txt.slice(start, end + 1))
        : JSON.parse(txt);

    applyAIVerdicts(parsed);
  } catch (error) {
    console.log(error);
    container.querySelector(".ai-summary").textContent = "AI analysis failed";
  } finally {
    spinnerWrap.style.display = "none";
  }
}

function applyAIVerdicts(data) {
  if (!data || !Array.isArray(data.verdicts)) return;
  for (const v of data.verdicts) {
    const perm = String(v.permission);
    const verdict = (v.verdict || "unknown").toLowerCase();
    const reason = v.reason || "";

    const statusElem = document.querySelector(
      `.perm-status[data-perm="${escapeSelector(perm)}"]`,
    );
    const permReasonElem = document.querySelector(
      `.permission-reason[data-perm-reason="${escapeSelector(perm)}"]`,
    );
    const permNameElem = document.querySelector(
      `.permission-name[data-perm="${escapeSelector(perm)}"]`,
    );

    if (!statusElem) {
      // try to match normalized permission text
      // skip if not found
      continue;
    }

    statusElem.classList.remove("unknown", "ok", "suspicious", "danger");
    if (verdict === "ok") {
      statusElem.classList.add("ok");
      statusElem.textContent = "ok";
    } else if (verdict === "suspicious") {
      statusElem.classList.add("suspicious");
      statusElem.textContent = "suspicious";
      if (permNameElem) permNameElem.style.borderLeft = "3px solid #ff9900";
    } else if (verdict === "danger" || verdict === "dangerous") {
      statusElem.classList.add("danger");
      statusElem.textContent = "danger";
      if (permNameElem) permNameElem.style.borderLeft = "3px solid #c53030";
    } else {
      statusElem.textContent = verdict;
    }

    if (permReasonElem) {
      if (reason) {
        permReasonElem.style.display = "block";
        permReasonElem.textContent = reason;
      } else {
        permReasonElem.style.display = "none";
      }
    }
  }
}

/* small helpers */
function escapeHtml(s) {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// CSS selector safe escape for dataset matching
function escapeSelector(s) {
  // we are using the dataset attributes containing permission text which can include slashes and colons
  return CSS.escape(s);
}
