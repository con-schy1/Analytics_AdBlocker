<h1 align="center">
  <br>
  <a href="https://www.globemallow.io"><img src="https://user-images.githubusercontent.com/25206214/232239552-1e012a0f-5a70-4498-be91-5cfbf739659b.jpg" alt="Analytics and Ad Blocker" width="200"></a>
  <br>
  Analytics & AdBlocker
  <br>
</h1>

<h4 align="center">Protect your privacy while browsing the web.</h4>

<p align="center">
  <a href="https://microsoftedge.microsoft.com/addons/detail/analytics-ad-blocker/aefflmbddeelichjblegdiofcnheglho">
    <img src="https://user-images.githubusercontent.com/25206214/232240901-a3a3238e-323f-4e27-b403-c3cae1b75e04.png"
         alt="Edge" width="50">
  </a>
  &nbsp;
    <a href="https://chrome.google.com/webstore/detail/analytics-ad-blocker/fapldghopmonkbgaaiinpeopokpkhbmk">
    <img src="https://user-images.githubusercontent.com/25206214/232240940-ab68afc0-2fe4-46b6-a3f0-a66002c6769d.png"
         alt="Edge" width="50">
  </a>
  <br>
  <a href="https://apps.apple.com/app/analytics-ad-blocker/id1641772773">
    <img src="https://user-images.githubusercontent.com/25206214/232240922-82009465-ade0-4882-8e7a-6176fb6fa037.png"
         alt="Edge" width="50">
  </a>
</p>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-install">How To Install</a> •
  <a href="#download">Download</a> •
  <a href="#helpful-documentation">Helpful Documentation</a> •
  <a href="#examples">Examples</a> •
  <a href="#rules">Rules</a> •
    <a href="#credits">Credits</a> •
  <a href="#license">License</a>
</p>

![veed](https://user-images.githubusercontent.com/25206214/232251234-c60f33ae-774d-4d92-a257-5d07be8d2b75.gif)

## Key Features

* Protect your privacy while browsing online - block ads and analytics (trackers)
  - Instantly see what has been blocked 
* Lightweight
  - A lightweigth browser extension to ensure browsing speed is not affected.
* Simple UI/UX that you don't need a degree to read 
* Pause / Resume Blocking
  - If you notice that Analytics & Ad Blocker is affecting the page you're on you can simply pause the blocking, and resume as soon as you've completed the action you were trying to attempt
* Easy to see reports
  - See the ads and trackers blocked by each site
  - See the different requests blocked on each site
* OpenSource!
* No tracking on YOU! We don't use any analytics within the extension. 
* Email us with any feedback or any ads / trackers you notice we missed.
* Works with Edge, Safari, and Chrome

## How To Install

<h3>Install-Chrome</h3>
1) Download all files and *images* folder into a single Folder. <br>
2) Exclude the following files from download:<br>
&nbsp; * .github <br> 
&nbsp; * License <br>
&nbsp; * README.md <br>
3) Go to: chrome://extensions/ in your chrome browser <br>
4) Toggle ON: Developer Mode - in the top right <br>
5) Select the Folder you just created <br>
6) You're ready to go!

## Helpful Documentation 
* https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest/ <br>
* More specifically: 
https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest/#type-ResourceType
 

## Examples

<h3>Example 1</h3>

1) If you find an Ad look at it in the Browser's Dev tools. <br>

It will look something like:
```
<script async="" src="https://www.adexample1.com/"></script>
```

2) Open the **rules.json** <br>

The resulting rule to block this script will look like:
```
,
    {
    "id": 3000,
    "priority": 1,
    "action": { "type": "block" },
    "condition": {"urlFilter": "adexample1.com/", 
    "resourceTypes": ["script"] }
  }
```
3) Add this rule to the rules.json, and make sure you change the id to go in order as the rule before it. <br>
4) Open the **performance.js**. <br>

Add the following to the end of the **adList** array:
```
, /adexample1.c/
```
5) Congratulate yourself- that's it!

<h3>Example 2</h3>

1) If you find an Ad look at it in the Browser's Dev tools. <br>

It will look something like:
```
<iframe async="" src="https://www.adexample2.com/"></script>
```

2) Open the **rules.json** <br>

The resulting rule to block this script will look like:
```
,
    {
    "id": 3000,
    "priority": 1,
    "action": { "type": "block" },
    "condition": {"urlFilter": "adexample2.com/", 
    "resourceTypes": ["sub_frame"] }
  }
```
3) Add this rule to the rules.json, and make sure you change the id to go in order as the rule before it. <br>
4) Open the **performance.js**. <br>

Add the following to the end of the **adList** array:
```
, /adexample2.c/
```
<h4>But, you notice the ad is still there?</h4>

5) Look at the **Network** requests for: **adexample2.com/**, and you see that it is sending a request after the iframe is blocked. 
6) Identify how it is calling the addition request and see that it's sending a **Ping** request type
7) Write an additional rule and follow all the steps above. It will look something like this:
```
    {
    "id": 3001,
    "priority": 1,
    "action": { "type": "block" },
    "condition": {"urlFilter": "adexample2.com/", 
    "resourceTypes": ["ping"] }
  }
```
8) There is no need to ad an additional entry in **adList** array.
9) That's it! Repeat the steps until the ad is gone.

## Rules
<h4>There's a couple project rules:</h4>
1) No Blocking Cookie Consent Banners and their technologies  <br>
2) No Blocking Chat Bots  <br>
3) Don't use *main_frame* as a Resource Type in your rules

## Download

- [Chrome](https://chrome.google.com/webstore/detail/analytics-ad-blocker/fapldghopmonkbgaaiinpeopokpkhbmk)
- [Edge](https://microsoftedge.microsoft.com/addons/detail/analytics-ad-blocker/aefflmbddeelichjblegdiofcnheglho)
- [Safari](https://apps.apple.com/app/analytics-ad-blocker/id1641772773)

## Credits

This software uses the following open source packages:

- [Chart.js](https://www.chartjs.org/)

## Support

<a href='https://ko-fi.com/U6U46R9FA' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi2.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

## Contact

[Contact Me](mailto:connor@globemallow.io)

## You may also like...

- [Globemallow](https://globemallow.io/) - Create more performant webpages for a sustainable future for the internet.

## License

Apache-2.0 License

---

> [globemallow.io](https://globemallow.io/) &nbsp;&middot;&nbsp;
> GitHub [@con_schy1](https://github.com/con-schy1) &nbsp;&middot;&nbsp;
> Mastodon [@globemallow@infosec.exchange](https://infosec.exchange/@globemallow)

