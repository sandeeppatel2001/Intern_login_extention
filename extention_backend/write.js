var fs = require("fs");
let token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIxIiwiaWF0IjoxNjc2MTQxMzUyfQ.ANPKKuHrULnTfsi_Oy_AG09lUEvSD8v72BhQJu_htTM";

fs.writeFile("ab.txt", token, function (err) {
  if (err) throw err;
  console.log("Saved!");
});

fs.readFile("ab.txt", "utf8", function (err, data) {
  console.log(data);
});
