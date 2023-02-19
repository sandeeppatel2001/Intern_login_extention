console.log("bacground");
let Url;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(sender);

  // 2. A page requested user data, respond with a copy of `user`
  if (message === "get-user-data") {
    sendResponse({
      url: sender.url,
      id: sender.id,
    });
  }
});

// console.log(
//   sender.tab
//     ? "from a content script:" + sender.tab.url
//     : "from the extension"
// );
/////////////////////////////////
