console.log('bacground');

// chrome.storage.local.get('r', function (st) {
//   console.log(st);
//   console.log(st.r);
// });
// we are taking tree types massegs "get-user-data","save-token","get-token"
// acording to massege we perform operation
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(sender);

  // 2. A page requested user data, respond with a copy of `user`
  if (message.m === 'get-user-data') {
    chrome.storage.local.get('r', function (st) {
      console.log(st);
      console.log(st.r);
      const l = st.r;
      sendResponse({ status: true, url: sender.url, id: sender.id, l });
    });
  }
  if (message.m === 'savetoken') {
    const token = message.h;
    chrome.storage.local.set({ r: token }, function () {
      console.log('successfully set');
    });
    sendResponse({ status: true });
  }
  if (message.m === 'gettoken') {
    chrome.storage.local.get('r', function (st) {
      console.log(st);
      console.log(st.r);
      const l = st.r;
      sendResponse({ status: true, l });
    });
  }
  // setTimeout(function () {
  //   sendResponse({ status: true });
  // }, 1);
  return true;
});
