document.getElementById("logout").addEventListener("click", (e) => {
  e.preventDefault();
  console.log("logout");
  chrome.runtime.sendMessage(
    "oiklfjbjmdhnakcjhkabcmepmkneaogf",
    { m: "savetoken", h: "" },
    (response) => {
      console.log(response.l);
    }
  );
  window.location.replace("./login.html");
});
