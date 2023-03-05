const button = document.querySelector('button');

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

document.getElementById('login').addEventListener('click', (e) => {
  e.preventDefault();
  window.location.replace('./login.html');
});
document.getElementById('cam').addEventListener('click', (e) => {
  e.preventDefault();
  window.location.replace('./webcam.html');
});
document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();

  const email = document.querySelector('#email').value;
  const pass = document.querySelector('#password').value;
  const name = document.querySelector('#name').value;
  const rpass = document.querySelector('#rpassword').value;
  let mobilenum = document.querySelector('#mo').value;
  mobilenum = mobilenum.replace(/[^\d]/g, '');
  console.log(mobilenum);

  if (email && pass && name && rpass && mobilenum) {
    if (rpass === pass) {
      if (mobilenum.length > 6 && mobilenum.length < 11) {
        window.location.replace('./login.html');
        const obj = {
          name,
          pass,
          email,
          mobilenum
        };
        console.log(obj);
        const req = new XMLHttpRequest();
        const baseUrl = 'http://localhost:8000/sing';
        const urlParams = obj;

        req.open('POST', baseUrl, true);
        req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        req.send(JSON.stringify(urlParams));

        req.onreadystatechange = async function () {
          // Call a function when the state changes.
          if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            const nodedata = JSON.parse(this.responseText);
            console.log(nodedata);
            if (nodedata) {
              window.location.replace('./popup-sign-out.html');
            } else {
              console.log('elselogin', nodedata);
            }
          }
        };
      } else {
        document.querySelector('#mo').value = mobilenum + ' Not valied';
        document.querySelector('#mo').style.backgroundColor = 'red';
        setTimeout(() => {
          document.querySelector('#mo').value = '';
        }, 500);
      }
    } else {
      document.querySelector('#password').placeholder = 'Not Match';
      document.querySelector('#rpassword').placeholder = 'Not Match';
      document.querySelector('#password').style.backgroundColor = 'red';
      document.querySelector('#rpassword').style.backgroundColor = 'red';
    }
  } else {
    document.querySelector('#email').placeholder = 'Enter an email.';
    document.querySelector('#password').placeholder = 'Enter a password.';
    document.querySelector('#rpassword').placeholder = 'Enter a repassword.';
    document.querySelector('#name').placeholder = 'Enter a name.';
    document.querySelector('#email').style.backgroundColor = 'red';
    document.querySelector('#password').style.backgroundColor = 'red';
    document.querySelector('#rpassword').style.backgroundColor = 'red';
    document.querySelector('#name').style.backgroundColor = 'red';
    document.querySelector('#email').classList.add('white_placeholder');
    document.querySelector('#password').classList.add('white_placeholder');
    document.querySelector('#rpassword').classList.add('white_placeholder');
    document.querySelector('#name').classList.add('white_placeholder');
  }
});
