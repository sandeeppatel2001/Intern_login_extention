let msg;
let tag;
async function test3() {
  let ecdhpubk;
  let ecdhprivk;
  // Text to sign:
  //var source = "test";
  let payload = {
    host: "lms.iitjammu.com",
    url: "https://lms.iitjammu.ac.in/login/index.php",
    time: 2222,
    ClientId: "mdskdsfjkdvndksjvvnkfv",
    extentionid: "1111111111111111111",
  };
  let priv;
  var source = JSON.stringify(payload);
  let pubKey;
  // Auxs
  function length(hex) {
    return ("00" + (hex.length / 2).toString(16)).slice(-2).toString();
  }

  function pubKeyToPEM(key) {
    var pem = "-----BEGIN PUBLIC KEY-----\n",
      keydata = "",
      bytes = new Uint8Array(key);

    for (var i = 0; i < bytes.byteLength; i++) {
      keydata += String.fromCharCode(bytes[i]);
    }

    keydata = window.btoa(keydata);

    while (keydata.length > 0) {
      pem += keydata.substring(0, 64) + "\n";
      keydata = keydata.substring(64);
    }

    pem = pem + "-----END PUBLIC KEY-----";

    return pem;
  }

  // Generate new keypair.
  window.crypto.subtle
    .generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, [
      "sign",
      "verify",
    ])
    .then(function (keypair) {
      // Encode as UTF-8
      priv = keypair.privateKey;
      var enc = new TextEncoder("UTF-8"),
        digest = enc.encode(source);
      // Sign with subtle
      window.crypto.subtle
        .sign(
          { name: "ECDSA", hash: { name: "SHA-256" } },
          keypair.privateKey,
          digest
        )
        .then(function (signature) {
          signature = new Uint8Array(signature);

          // Extract r & s and format it in ASN1 format.
          var signHex = Array.prototype.map
              .call(signature, function (x) {
                return ("00" + x.toString(16)).slice(-2);
              })
              .join(""),
            r = signHex.substring(0, signHex.length / 2),
            s = signHex.substring(signHex.length / 2),
            rPre = true,
            sPre = true;

          while (r.indexOf("00") === 0) {
            r = r.substring(2);
            rPre = false;
          }

          if (rPre && parseInt(r.substring(0, 2), 16) > 127) {
            r = "00" + r;
          }

          while (s.indexOf("00") === 0) {
            s = s.substring(2);
            sPre = false;
          }

          if (sPre && parseInt(s.substring(0, 2), 16) > 127) {
            s = "00" + s;
          }

          var payload = "02" + length(r) + r + "02" + length(s) + s,
            der = "30" + length(payload) + payload;

          // Export public key un PEM format (needed by node)
          window.crypto.subtle
            .exportKey("spki", keypair.publicKey)
            .then(function (key) {
              pubKey = pubKeyToPEM(key);

              console.log("This is pubKey -> ", pubKey);
              console.log("This is signature -> ", der);
            });
          let p;
          // window.crypto.subtle.exportKey("raw", keypair.publicKey).then((t) => {
          //   console.log(t);
          //   p = [...new Uint8Array(t)]
          //     .map((v) => v.toString(16).padStart(2, "0"))
          //     .join("");
          //   console.log("publickeyinhex", p);
          // });

          // For test, we verify the signature, nothing, anecdotal.
          window.crypto.subtle
            .verify(
              { name: "ECDSA", hash: { name: "SHA-256" } },
              keypair.publicKey,
              signature,
              digest
            )
            .then(async (res) => {
              await window.crypto.subtle
                .generateKey({ name: "ECDH", namedCurve: "P-256" }, true, [
                  "deriveBits",
                ])
                .then(function (keypair) {
                  // Encode as UTF-8
                  ecdhprivk = keypair.privateKey;

                  window.crypto.subtle
                    .exportKey("raw", keypair.publicKey)
                    .then((t) => {
                      console.log(t);
                      p = [...new Uint8Array(t)]
                        .map((v) => v.toString(16).padStart(2, "0"))
                        .join("");
                      console.log("publickeyinhex", p);
                      let obj = {
                        payload: source,
                        pub_key: pubKey,
                        der: der,
                        p,
                      };
                      if (res) {
                        console.log(res);
                        server(obj);
                      }
                    });
                });
            });
        });
    });
  // {
  //   name: "ECDH",
  //   namedCurve: "P-256",
  //   public: publicKey,
  // },
  // privateKey,
  // 256
  async function deriveSharedSecret(privateKey, publicKey) {
    return new Promise((resolve, reject) => {
      let sharedSecret = window.crypto.subtle
        .deriveBits(
          {
            name: "ECDH",
            namedCurve: "P-256", //can be "P-256", "P-384", or "P-521"
            public: publicKey, //an ECDH public key from generateKey or importKey
          },
          privateKey, //your ECDH private key from generateKey or importKey
          256 //the number of bits you want to derive
        )
        .then(function (bits) {
          console.log("bits", bits);
          let hexbit = [...new Uint8Array(bits)]
            .map((v) => v.toString(16).padStart(2, "0"))
            .join("");
          console.log(hexbit);
          (enc = new TextEncoder("UTF-8")), (hexbit = enc.encode(hexbit));
          const bufer = crypto.subtle.digest("SHA-256", hexbit).then((t) => {
            console.log(t);
            const sha256 = [...new Uint8Array(t)]
              .map((v) => v.toString(16).padStart(2, "0"))
              .join("");
            console.log(sha256);
            const secret = sha256.slice(0, 32);
            const hm = sha256.slice(32, 64);
            console.log("secret", secret);
            console.log("hmac", hm);
            resolve({
              secret: secret,
              hmac: hm,
            });
          });
        })
        .catch(function (err) {
          console.error(err);
        });
    });
  }

  ////////////////////////
  async function decryptMessage(key, cipher) {
    let iv = Uint8Array.from(
      cipher.iv.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
    );
    console.log(iv);
    let ciphertext = Uint8Array.from(
      cipher.ciphertext.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
    );
    console.log(ciphertext);
    const enc_key = new TextEncoder();
    const encoded_key = enc_key.encode(key);
    const key_crypto = await crypto.subtle.importKey(
      "raw",
      encoded_key,
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );
    let msg = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key_crypto,
      ciphertext
    );
    return new TextDecoder().decode(msg);
  }
  async function hmac_tt(key, payload) {
    let enc = new TextEncoder();
    enc = enc.encode(payload);
    let r = new TextEncoder();
    // let r = Uint8Array.from(
    //   key.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
    // );
    const key_crypto = await crypto.subtle.importKey(
      "raw",
      r.encode(key),
      { name: "HMAC", hash: "SHA-256" },
      true,
      ["sign", "verify"]
    );
    let signature = await window.crypto.subtle.sign("HMAC", key_crypto, enc);
    return [...new Uint8Array(signature)]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("");
  }
  let server = (obj) => {
    console.log("sandeep patel");
    const req = new XMLHttpRequest();
    const baseUrl = "http://localhost:8000/browser";
    const urlParams = obj;
    req.open("POST", baseUrl, true);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.send(JSON.stringify(urlParams));

    req.onreadystatechange = async function () {
      // Call a function when the state changes.
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        let nodedata = JSON.parse(this.responseText);
        console.log("pubk", nodedata.pub_key);
        const serverhexkey = nodedata.pub_key;
        //let pemk = pubKeyToPEM(serverhexkey);
        function importECDSAKey(serverhexkey) {
          let encoded_key = new Uint8Array(
            serverhexkey.match(/../g).map((h) => parseInt(h, 16))
          ).buffer;
          return window.crypto.subtle.importKey(
            "raw",
            encoded_key,
            {
              name: "ECDH",
              namedCurve: "P-256",
            },
            true,
            []
          );
        }
        importECDSAKey(serverhexkey).then(async (res) => {
          console.log(res);
          let secret = await deriveSharedSecret(ecdhprivk, res);
          console.log(secret);
          console.log("after derisecret function");
          let hmacdata = nodedata.pub_key + nodedata.iv + nodedata.ciphertext;
          console.log(hmacdata);
          let hmac2 = await hmac_tt(secret.hmac, hmacdata);
          console.log(hmac2);
          if (nodedata.hmac == hmac2) {
            console.log("sfsdvdfvgrg");
            decryptMessage(secret.secret, {
              iv: nodedata.iv,
              ciphertext: nodedata.ciphertext,
            }).then((ms) => {
              console.log(ms);
              msg = ms;
              let data = msg;
              console.log(data);
              console.log(JSON.parse(data));
              if (data) {
                console.log("if");

                let Data = JSON.parse(data);
                console.log("Data", Data);
                let User = Data.username;
                let Password = Data.password;

                console.log(Password, User);
                document.querySelectorAll("input").forEach((inputtag) => {
                  v.push(inputtag);
                  if (
                    inputtag.type == "email" ||
                    inputtag.name.indexOf("email") + 1 ||
                    inputtag.id.indexOf("email") + 1
                  ) {
                    flag = true;
                    console.log("trueemail");
                    setTimeout(() => {
                      inputtag.value = User;
                    }, 0);
                  }
                  if (inputtag.type == "password") {
                    let pertag = v[v.length - 2];
                    findtag();
                    setTimeout(() => {
                      // inputtag.autocomplete = "new-password";
                      console.log(Password);
                      inputtag.value = Password;

                      if (!flag) {
                        console.log("uperpassword");
                        // pertag.autocomplete = "new-password";
                        pertag.value = User;
                        console.log(pertag.value);
                      }
                    }, 0);
                  }
                });
                //document.querySelectorAll("[id*=user]").values = "sandddd";
                //console.log(v);
                if (!flag) {
                  flag2 = true;
                  document.querySelectorAll("[id*=user]").forEach((r) => {
                    setTimeout(() => {
                      console.log("!flag");
                      document.getElementById(r.id).value = User;
                    }, 0);
                  });
                }
                if (!flag & !flag2) {
                  flag3 = true;
                  document.querySelectorAll("[id*=User]").forEach((r) => {
                    setTimeout(() => {
                      console.log("!flag & !flag2");
                      document.getElementById(r.id).value = User;
                    }, 0);
                  });
                }
                if (!flag & !flag2 & !flag3) {
                  document.querySelectorAll("[id*=name]").forEach((r) => {
                    setTimeout(() => {
                      document.getElementById(r.id).value = User;
                      console.log("!flag & !flag2 & !flag3");
                    }, 0);
                  });
                }
                setTimeout(() => {
                  console.log("done");
                  tag.click();
                }, 0);
              }
            });
          }
        });

        console.log("Got response 200!", JSON.parse(this.responseText));
      }
    };
  };
}

///////////////////////////////////////////////////////
////////////////////////////////////////////////////////

let str;
let v = [];
let flag = false;
let flag2 = false;
let flag3 = false;
let flag4 = false;
let flag5 = false;
let findtag = () => {
  document.querySelectorAll("input").forEach((input) => {
    if (input.type == "submit") {
      flag5 = true;

      tag = input;
      console.log("submitinput");
    }
  });
  if (!flag5) {
    document.querySelectorAll("button").forEach((input) => {
      //console.log("buton", input);
      //console.log(1);
      //console.log(input);
      if (input.type == "submit") {
        // input.onclick = LogIn;
        tag = input;
        console.log("submittyp");
      }
    });
  }
};
window.onload = function () {
  // document.querySelectorAll("[id*=login]").forEach((res) => {
  //   document.getElementById(res.id).t = LogIn;
  //   console.log("geteliment");
  // });
  //document.getElementById("loginbtn").onclick = LogIn;
  //console.log(2);
  function auth() {
    //let token = window.localStorage.getItem("token");
    let token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIxIiwiaWF0IjoxNjc2MTQxMzUyfQ.ANPKKuHrULnTfsi_Oy_AG09lUEvSD8v72BhQJu_htTM";
    const req = new XMLHttpRequest();
    const baseUrl = "http://localhost:8000/auth";
    const urlParams = {
      token: token,
    };
    console.log("urlParams", urlParams);
    req.open("POST", baseUrl, true);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.send(JSON.stringify(urlParams));

    req.onreadystatechange = async function () {
      // Call a function when the state changes.
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        let nodedata = JSON.parse(this.responseText);
        console.log(nodedata);
        if (nodedata.istrue) {
          LogIn();
        }
      }
    };
  }
  auth();
  function LogIn() {
    console.log("Login function run");
    chrome.runtime.sendMessage(
      "oiklfjbjmdhnakcjhkabcmepmkneaogf",
      "get-user-data",
      async (response) => {
        // 3. Got an asynchronous response with the data from the service worker
        console.log("received user data ", await response);
      }
    );
    setTimeout(() => {
      chrome.runtime.sendMessage(
        "oiklfjbjmdhnakcjhkabcmepmkneaogf",
        "get-user-data",
        (response) => {
          url = response;
          console.log("url", url);
          str = JSON.stringify(url);
          console.log(str);
          test3();
        }
      );
      console.log("hi");
    }, 4);
  }
};