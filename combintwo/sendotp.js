document.getElementById("signup").addEventListener("click", (e) => {
  e.preventDefault();
  window.location.replace("./popup-sign-in.html");
});
document.getElementById("send").addEventListener("click", (e) => {
  e.preventDefault();
  let otp = "";
  const req = new XMLHttpRequest();
  const baseUrl = "http://localhost:8000/send";
  const urlParams = {
    otp: otp,
  };

  req.open("POST", baseUrl, true);
  req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  req.send(JSON.stringify(urlParams));

  req.onreadystatechange = async function () {
    // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let nodedata = JSON.parse(this.responseText);
      console.log(nodedata);
      if (nodedata.istrue) {
        window.location.replace("./otp.html ");
      } else {
        console.log("elselogin", nodedata);
      }
    }
  };
});