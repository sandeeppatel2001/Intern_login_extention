const button = document.querySelector('button');
// just for style
button.addEventListener('mouseover', () => {
  button.style.backgroundColor = 'black';
  button.style.color = 'white';
  button.style.transform = 'scale(1.3)';

  document.querySelector('form').style.backgroundColor = '#d3f674';

  document.querySelectorAll('input').forEach((input) => {
    input.style.backgroundColor = 'black';
    input.style.color = 'white';
    input.style.transform = 'scale(0.7)';
  });
});

button.addEventListener('mouseleave', () => {
  button.style.backgroundColor = '#f5c2e0';
  button.style.color = 'black';
  button.style.transform = 'scale(1)';

  document.querySelector('form').style.backgroundColor = '#fcee54';

  document.querySelector('#email').classList.remove('white_placeholder');
  document.querySelector('#password').classList.remove('white_placeholder');

  document.querySelectorAll('input').forEach((input) => {
    input.style.backgroundColor = 'white';
    input.style.color = 'black';
    input.style.transform = 'scale(1)';
  });
});
// when clicked signup button then go signup page
document.getElementById('signup').addEventListener('click', (e) => {
  e.preventDefault();
  window.location.replace('./popup-sign-in.html');
});
// when clicked send button then go send otp page
document.getElementById('otp').addEventListener('click', (e) => {
  e.preventDefault();
  window.location.replace('./sendotp.html');
});
// when user login then send data to backend for chaking user exist or not
document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();

  const email = document.querySelector('#email').value;
  const pass = document.querySelector('#password').value;

  if (email && pass) {
    const obj = {
      email,
      pass
    };
    const req = new XMLHttpRequest();
    const baseUrl = 'http://localhost:8000/login';
    const urlParams = obj;

    req.open('POST', baseUrl, true);
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.send(JSON.stringify(urlParams));

    req.onreadystatechange = async function () {
      // Call a function when the state changes.
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        const nodedata = JSON.parse(this.responseText);
        console.log('iiiii', nodedata);
        if (nodedata.istrue) {
          chrome.runtime.sendMessage('oiklfjbjmdhnakcjhkabcmepmkneaogf', {
            m: 'savetoken',
            h: nodedata.token
          });
          // chrome.runtime.sendMessage(
          //   "oiklfjbjmdhnakcjhkabcmepmkneaogf",
          //   { m: "gettoken", h: nodedata.token },

          //   (response) => {
          //     console.log(response);
          //   }
          // );
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
  } else {
    document.querySelector('#email').placeholder = 'Enter an email.';
    document.querySelector('#password').placeholder = 'Enter a password.';
    document.querySelector('#email').style.backgroundColor = 'red';
    document.querySelector('#password').style.backgroundColor = 'red';
    document.querySelector('#email').classList.add('white_placeholder');
    document.querySelector('#password').classList.add('white_placeholder');
  }
});

/// ////////////////////////////////////
// popup page loaded then we chack that user is already loged in or not
// if user is already logedin then show "ypu are loged in " page"
window.onload = async function () {
  chrome.runtime.sendMessage(
    'oiklfjbjmdhnakcjhkabcmepmkneaogf',
    { m: 'gettoken' },

    (response) => {
      console.log(response.l);
      console.log('login.js');
      const req = new XMLHttpRequest();
      const baseUrl = 'http://localhost:8000/isalreadylogin';
      const urlParams = { token: response.l };

      req.open('POST', baseUrl, true);
      req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      req.send(JSON.stringify(urlParams));

      req.onreadystatechange = async function () {
        // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
          const nodedata = JSON.parse(this.responseText);
          console.log(nodedata);
          if (nodedata.istrue) {
            window.location.replace('./success.html');
          }
        }
      };
    }
  );
};
/// ///////////////////////////////////////////////////////////
/// ////////////////////////////////////////////////
