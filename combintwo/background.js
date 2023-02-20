console.log("bacground");
let Url;
// chrome.storage.local.set(
//   {
//     r: "sandeep",
//   },
//   function () {
//     console.log("Storage Succesful");
//   }
// );
chrome.storage.local.get("r", function (st) {
  console.log(st);
  console.log(st.r);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(sender);

  // 2. A page requested user data, respond with a copy of `user`
  if (message.m === "get-user-data") {
    chrome.storage.local.get("r", function (st) {
      console.log(st);
      console.log(st.r);
      let l = st.r;
      sendResponse({ status: true, url: sender.url, id: sender.id, l: l });
    });
  }
  if (message.m == "savetoken") {
    let token = message.h;
    chrome.storage.local.set({ r: token }, function () {
      console.log("successfully set");
    });
    sendResponse({ status: true });
  }
  if (message.m == "gettoken") {
    chrome.storage.local.get("r", function (st) {
      console.log(st);
      console.log(st.r);
      let l = st.r;
      sendResponse({ status: true, l: l });
    });
  }
  // setTimeout(function () {
  //   sendResponse({ status: true });
  // }, 1);
  return true;
});

// console.log(
//   sender.tab
//     ? "from a content script:" + sender.tab.url
//     : "from the extension"
// );
/////////////////////////////////
