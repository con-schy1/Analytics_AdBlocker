<h1 align="center">
  <a href="https://www.globemallow.io"><img src="https://user-images.githubusercontent.com/25206214/232239552-1e012a0f-5a70-4498-be91-5cfbf739659b.jpg" alt="Analytics and Ad Blocker" width="200"></a>
  <br />
  Analytics & AdBlocker
</h1>
<p align="center"><em>Protect your privacy while browsing the web.</em></p>

<div align="center">
  <a href="https://microsoftedge.microsoft.com/addons/detail/analytics-ad-blocker/aefflmbddeelichjblegdiofcnheglho">
    <img src="https://user-images.githubusercontent.com/25206214/232240901-a3a3238e-323f-4e27-b403-c3cae1b75e04.png"
    alt="Edge" width="50">
  </a>
  &nbsp;
  <a href="https://chrome.google.com/webstore/detail/analytics-ad-blocker/fapldghopmonkbgaaiinpeopokpkhbmk">
    <img src="https://user-images.githubusercontent.com/25206214/232240940-ab68afc0-2fe4-46b6-a3f0-a66002c6769d.png"
    alt="Edge" width="50">
  </a>
  &nbsp;
  <a href="https://apps.apple.com/app/analytics-ad-blocker/id1641772773">
    <img src="https://user-images.githubusercontent.com/25206214/232240922-82009465-ade0-4882-8e7a-6176fb6fa037.png"
    alt="Edge" width="50">
  </a>
</div>

<br />

<p align="center">
  <a href="#what-is-analytics--ad-blocker">About</a> |
  <a href="#key-features">Key Features</a> |
  <a href="#how-to-install">How To Install</a> |
  <a href="#helpful-documentation">Helpful Documentation</a> |
  <a href="#license">License</a>
</p>

![veed](https://user-images.githubusercontent.com/25206214/232251234-c60f33ae-774d-4d92-a257-5d07be8d2b75.gif)


## What is Analytics & Ad Blocker?

Analytics & Ad Blocker is an open-source browser firewall that blocks ads and tracking scripts, lets you control heavy page resources, and shows what third parties try to load on the sites you visit.
It’s built for people who want transparency, local processing, and granular controls instead of black-box blocking.


## What problems does it solve?

- Stops common trackers and analytics tags from loading so you share less data by default.
- Reduces page bloat by blocking unwanted network requests and optionally heavy resources.
- Helps you identify which websites load the most third-party scripts and requests.
- Improves browsing focus by removing ad interruptions.


## Key features

- Ad and tracker blocking: Blocks many common advertising and tracking requests.
- Custom network request blocking: Create rules to block specific domains, URLs, or scripts.
- Toggle content types: Quickly disable JavaScript, images, or videos to speed up pages and reduce load.
- Live tracker dashboard: View third-party activity and request behavior in real time across tabs.
- Local-first privacy: Blocking decisions and dashboard insights are processed on your device.
- Open-source integrity: No paid whitelisting and no acceptable ads program.
- Works with Edge, Safari, and Chrome.


## Live tracker dashboard

Use the dashboard to understand what a page is doing behind the scenes:

- Live tag monitoring: See tracker tags and third-party requests as they attempt to run.
- Data audit visibility: Identify which sites are most aggressive with third-party connections.
- Impact metrics: Correlate blocked requests with lighter page behavior for everyday performance gains.


## Frequently asked questions

- Does it collect my data? No. The extension is built to work locally and does not require an account.
- Can I block a specific website or script that annoys me? Yes. You can add custom blocking rules for domains or specific requests.
- Will disabling JavaScript or media break sites? Some sites rely on scripts and media; use one-click toggles to turn resources off for speed, then back on if needed.
- Is it really open source? Yes. You can review the code, verify behavior, and contribute.


## How to install

#### Direct links:
- Chrome: https://chrome.google.com/webstore/detail/analytics-ad-blocker/fapldghopmonkbgaaiinpeopokpkhbmk
- Edge: https://microsoftedge.microsoft.com/addons/detail/analytics-ad-blocker/aefflmbddeelichjblegdiofcnheglho
- Safari: https://apps.apple.com/app/analytics-ad-blocker/id1641772773

#### Build from source code:
1. Clone the repo. or download as ZIP.
2. Navigate to the root of the folder, where 'manifest.json' is present.
3. Install the Node Modules with `npm i`.
4. Once it is complete, build it using `npx webpack`.
5. A 'dist' folder will be created. This is the package that needs to be loaded in the browser.

> For Chrome:
7. Open the Browser, and navigate to `chrome://extensions/`. Turn on 'Developer Mode' from the top-right corner.
8. Now, a few new options will appear on the left. Click on the 'load unpacked' and select the 'dist' folder.
9. You're ready to go.

> For Edge:
7. Open the Browser, and navigate to `edge://extensions/`. Turn on 'Developer Mode' from the left bar.
8. Now, a few new options will appear besides the 'installed extensions' heading. Click on the 'load unpacked' and select the 'dist' folder.
9. You're ready to go.


## Helpful documentation

- https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest/


## Support

<a href='https://ko-fi.com/U6U46R9FA' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi2.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

## Contact

[Contact Me](mailto:connor@globemallow.io)

## You may also like...

- [Globemallow](https://globemallow.io/) - Create more performant webpages for a sustainable future for the internet.

## License

Apache-2.0 License

---

> [globemallow.io](https://globemallow.io/) · GitHub [@con_schy1](https://github.com/con-schy1) · Mastodon [@globemallow@infosec.exchange](https://infosec.exchange/@globemallow)
