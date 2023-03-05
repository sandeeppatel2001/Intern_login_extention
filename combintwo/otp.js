document.getElementById('login').addEventListener('click', (e) => {
  e.preventDefault();
  window.location.replace('./login.html');
});
document.getElementById('cam').addEventListener('click', (e) => {
  e.preventDefault();
  window.location.replace('./webcam.html');
});
document.getElementById('sign').addEventListener('click', (e) => {
  e.preventDefault();
  window.location.replace('./popup-sign-in.html');
});
document.getElementById('submitotp').addEventListener('click', (e) => {
  e.preventDefault();
  const otp = document.getElementById('otp').value;
  const req = new XMLHttpRequest();
  const baseUrl = 'http://localhost:8000/checkotp';
  const urlParams = {
    otp
  };

  req.open('POST', baseUrl, true);
  req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  req.send(JSON.stringify(urlParams));

  req.onreadystatechange = async function () {
    // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      const nodedata = JSON.parse(this.responseText);
      console.log(nodedata);
      if (nodedata.istrue) {
        chrome.runtime.sendMessage('oiklfjbjmdhnakcjhkabcmepmkneaogf', {
          m: 'savetoken',
          h: nodedata.token
        });
        /// /////////////////////////////////////
        // chrome.storage.local.set({ token: nodedata.token });
        // window.localStorage.setItem("token", JSON.stringify(nodedata.token));
        console.log(nodedata);
        window.location.replace('./success.html');
      } else {
        console.log('elselogin', nodedata);
      }
    }
  };
});
