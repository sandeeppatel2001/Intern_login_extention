const button = document.querySelector("button");

button.addEventListener("mouseover", () => {
  button.style.backgroundColor = "black";
  button.style.color = "white";
  button.style.transform = "scale(1.3)";

  document.querySelector("form").style.backgroundColor = "#d3f674";

  document.querySelectorAll("input").forEach((input) => {
    input.style.backgroundColor = "black";
    input.style.color = "white";
    input.style.transform = "scale(0.7)";
  });
});

button.addEventListener("mouseleave", () => {
  button.style.backgroundColor = "#f5c2e0";
  button.style.color = "black";
  button.style.transform = "scale(1)";

  document.querySelector("form").style.backgroundColor = "#fcee54";

  document.querySelector("#email").classList.remove("white_placeholder");
  document.querySelector("#password").classList.remove("white_placeholder");

  document.querySelectorAll("input").forEach((input) => {
    input.style.backgroundColor = "white";
    input.style.color = "black";
    input.style.transform = "scale(1)";
  });
});

document.getElementById("signup").addEventListener("click", (e) => {
  e.preventDefault();
  window.location.replace("./popup-sign-in.html");
});
document.getElementById("otp").addEventListener("click", (e) => {
  e.preventDefault();
  window.location.replace("./sendotp.html");
});

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.querySelector("#email").value;
  const pass = document.querySelector("#password").value;

  if (email && pass) {
    let obj = {
      email,
      pass,
    };
    const req = new XMLHttpRequest();
    const baseUrl = "http://localhost:8000/login";
    const urlParams = obj;

    req.open("POST", baseUrl, true);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.send(JSON.stringify(urlParams));

    req.onreadystatechange = async function () {
      // Call a function when the state changes.
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        let nodedata = JSON.parse(this.responseText);
        console.log(nodedata);
        if (nodedata.istrue) {
          ////////////////////////////////////////

          //window.localStorage.setItem("token", JSON.stringify(nodedata.token));
          console.log(nodedata.token);
          window.location.replace("./success.html");
        } else {
          console.log("elselogin", nodedata);
        }
      }
    };
  } else {
    document.querySelector("#email").placeholder = "Enter an email.";
    document.querySelector("#password").placeholder = "Enter a password.";
    document.querySelector("#email").style.backgroundColor = "red";
    document.querySelector("#password").style.backgroundColor = "red";
    document.querySelector("#email").classList.add("white_placeholder");
    document.querySelector("#password").classList.add("white_placeholder");
  }
});

///////////////////////////////////////

window.onload = function () {
  const req = new XMLHttpRequest();
  const baseUrl = "http://localhost:8000/isalreadylogin";
  const urlParams = {};

  req.open("POST", baseUrl, true);
  req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  req.send(JSON.stringify(urlParams));

  req.onreadystatechange = async function () {
    // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let nodedata = JSON.parse(this.responseText);
      if (nodedata.istrue) {
        window.location.replace("./success.html");
      }
    }
  };
};
