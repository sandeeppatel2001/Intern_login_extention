const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const cors = require("cors");
// const { json } = require("express");
// const { stringify } = require("querystring");
// const { hasSubscribers } = require("diagnostics_channel");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.get("/", (req, res) => {
  res.cookie("ffff", "ttttttt", { httpOnly: true });
  res.send("sandeepp");
});
app.post("/", () => {
  console.log("sandeep");
});
app.listen("3000", () => {
  console.log("listing at 3000");
});
