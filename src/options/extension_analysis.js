import JSZip from "jszip";

import { els } from "./dom";

/* =========================
   Public entry
========================= */

export function initExtensionAnalysis() {
  if (els.extAnalyzeBtn) {
    els.extAnalyzeBtn.addEventListener("click", analyzeExtension);
  }
}

/* =========================
   Analyze
========================= */

let extractedZip = null;
let currentExtensionId = null;

async function analyzeExtension() {
  const id = els.extensionIdInput.value.trim();
  if (!id) return;

  els.extAnalysisOutput.textContent = "Processing CRX...";

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
    els.downloadExtSourceCode.addEventListener("click", downloadZip);
  } catch (err) {
    els.extAnalysisOutput.textContent = String(err);
  }
}
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
