console.log("bacground");
let Url;

//import { CryptoJS } from "./lib/aes.3.1.2.js";

// async function getTab() {
//   let queryOptions = { active: true, currentWindow: true };
//   let tabs = await chrome.tabs.query(queryOptions);
//   console.log(tabs[0].url);
//   Url = tabs[0].url;
//   //return sendResponse(Url);
// }

// async function getCurrentTab() {
//   let queryOptions = { active: true, lastFocusedWindow: true };
//   // `tab` will either be a `tabs.Tab` instance or `undefined`.
//   let [tab] = await chrome.tabs.query(queryOptions);
//   console.log(tab);
//   //Url = tab;
//   return tab;
// }

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("msg", message);

  // 2. A page requested user data, respond with a copy of `user`
  if (message === "get-user-data") {
    sendResponse(Url);

    let queryOptions = { active: true, currentWindow: true };
    chrome.tabs
      .query(queryOptions)
      .then((result) => {
        Url = result[0].url;
        console.log(result[0].url);
        sendResponse(Url);
      })
      .catch((err) => {
        console.log(err);
      });

    console.log("hi");
  }
});

// console.log(
//   sender.tab
//     ? "from a content script:" + sender.tab.url
//     : "from the extension"
// );
/////////////////////////////////
