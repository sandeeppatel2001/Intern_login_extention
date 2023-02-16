const crypto = require("crypto");
//let secretkey = "gax4nXE8yphF0QA6DWU0mTTNDvTDxFsO";
let express = require("express");
const { Client } = require("pg");
let app = express();
let fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var bodyParser = require("body-parser");
const cors = require("cors");
const { json } = require("express");
const { stringify } = require("querystring");
const { hasSubscribers } = require("diagnostics_channel");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const nodemailer = require("nodemailer");

let payload = {
  host: "lms.iitjammu.com",
  url: "https://lms.iitjammu.ac.in/login/index.php",
  time: 2222,
  ClientId: "mdskdsfjkdvndksjvvnkfv",
  extentionid: "1111111111111111111",
};
let data;
// let data = {
//   username: "2020umt0182",
//   password: "Glxy@261600",
// };
// data = JSON.stringify(data);
// console.log("sandeep patel");
/////////////////////////////////////

////////////////////////////////////////

let sign = function (public_key) {
  //dummy values

  const crypto = require("crypto");
  var sha512 = crypto.createHash("sha256");

  var EC = require("elliptic").ec;
  var ec = new EC("p256");

  // Generate keys
  var key1 = ec.genKeyPair(); //key1 is gen before pub key
  var key2 = ec.keyFromPublic(public_key, "hex"); //pub key gen from saved cert

  var derived_secret = key1.derive(key2.getPublic()).toString("hex");
  console.log("derivsecret", derived_secret);
  var public_key_client = key1.getPublic("hex");
  // finalyze shared secret
  // Hash shared secret
  var sha = sha512.update(derived_secret).digest("hex");
  derived_secret = sha.slice(0, 32);
  let hmac_key = sha.slice(32, 64);
  console.log("hmackey", hmac_key);
  console.log("sha", sha);

  return {
    public_key: public_key_client,
    secret: derived_secret,
    hmac_key: hmac_key,
  };
};
//console.log(sign(pub_key));

////////////////////////////////////////
const encrypt = (key, data) => {
  // iv stands for "initialization vector"
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encryptedBuffer = Buffer.concat([cipher.update(data), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    iv: iv.toString("hex"),
    ciphertext: Buffer.concat([encryptedBuffer, authTag]).toString("hex"),
  };
};
// let sec = sign(pub_key);
// let endata = encrypt(sec.secret, data);
// let hmacdata = sec.public_key + endata.iv + endata.ciphertext;
// let hmac = crypto
//   .createHmac("sha256", sec.hmac_key)
//   .update(hmacdata)
//   .digest("hex");
// console.log(hmac);
// let finalpayload = {
//   ...endata,
//   hmac: hmac,
//   pub_key: sec.public_key,
// };
//////////////////////////////////////
app.post("/img_data", (req, res) => {
  const client = new Client({
    host: "127.0.0.1",
    user: "postgres",
    database: "fusion",
    password: "Tesla@261600",
    port: 5000,
  });

  console.log(req.body.imgdata);
  const execute = async (query) => {
    await client.connect(); // gets connection
    await client.query(query);
    try {
      let insertQuery = `INSERT INTO "img_data" (
        
        "imgdata"
        )
        values('${req.body.imgdata}')`;

      client.query(insertQuery, (err, result) => {
        if (!err) {
          console.log("img_Insertion was successful");
          res.send({ v: "img_Insertion was successful" });
        } else {
          console.log(err.message);
        }
      });
      return true;
    } catch (error) {
      console.error(error.stack);
      return false;
    } finally {
      await client.end(); // closes connection
    }
  };
  const text = `
    CREATE TABLE IF NOT EXISTS "img_data" (
        "imgdata" text NOT NULL
    );`;

  execute(text).then((result) => {
    if (result) {
      res.send({ v: "table created" });
      console.log("Table created");
    } else {
      console.log("eslse");
    }
  });
});
app.get("/home", (req, res) => {
  res.send("sandeep patel");
});
let otpval = 12;
let emailval = "";
app.post("/send", (req, res) => {
  emailval = req.body.email.toLowerCase();
  otpval = Math.floor(100000 + Math.random() * 900000);
  console.log(otpval);
  let transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secureConnection: false,
    port: 587,
    tls: {
      ciphers: "SSLv3",
    },
    requireTLS: true,
    auth: {
      user: "sandeepkrpatel2002@gmail.com",
      pass: "riuwaswnpaqafoga",
    },
    tls: { rejectUnauthorized: true },
  });
  const mailOptions = {
    from: "sandeepkrpatel2002@gmail.com", // Sender address
    to: `${emailval}`, // List of recipients
    subject: "Node Mailer by sandeep", // Subject line
    text: `Your OTP is ${otpval} send by sandeep code`, // Plain text body
  };

  transport.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log("ssssssss");
      console.log(err);
      return res.send("not send");
    } else {
      console.log(info);
      return res.send({ istrue: true });
    }
  });
});

app.post("/checkotp", async (req, res) => {
  if (otpval == req.body.otp) {
    console.log("same otp");
    try {
      console.log("try_checking");
      const client = new Client({
        host: "localhost",
        user: "postgres",
        port: 5000,
        password: "Tesla@261600",
        database: "fusion",
      });
      await client.connect();
      client.query(
        `Select * from "extentionlogin" Where  extension_id='3234443' AND email='${emailval}'`,
        (err, result) => {
          if (!err) {
            console.log(emailval);
            console.log("!err");
            console.log(result.rowCount);
            if (result.rowCount) {
              //console.log("result", result);

              console.log("result.rows[0]", result.rows[0]);

              const token = jwt.sign(
                { id: result.rows[0].client_id.toString() },
                "sandeep",
                {
                  expiresIn: 60, // 1 min
                }
              );
              fs.writeFile("tokdata.txt", token, function (err) {
                if (err) throw err;
                console.log("Saved!");
              });
              console.log({
                msg: "otp match",
                user: result.rows[0].Username,
                token,
              });
              return res.status(200).send({
                msg: "otp logged in successfully",
                istrue: true,
                token: token,
                user: emailval,
              });
            }
          }
        }
      );
    } catch {
      ////////////////////////////////////////
      console.log("otp login catch function error");
    }
    ////////////////
  } else {
    console.log("invalid otp");
    return res.send({
      istrue: false,
    });
  }
});
app.post("/sing", async (req, res) => {
  let newUsername = req.body.name;
  let newPass = req.body.pass;

  let newEmail = req.body.email;
  let loweremail = newEmail.toLowerCase();
  console.log(loweremail);

  const client = new Client({
    host: "127.0.0.1",
    user: "postgres",
    database: "fusion",
    password: "Tesla@261600",
    port: 5000,
  });

  const execute = async (query) => {
    newPass = await bcrypt.hash(newPass, 8);

    await client.connect(); // gets connection
    await client.query(query);
    try {
      console.log("pasword", newPass);

      let insertQuery = `INSERT INTO "extentionlogin" (
        "extension_id" ,
        "client_id" ,
        "Username" ,
        "email" ,
        "password"
        )
        values(${3234443}, ${21}, '${newUsername}', '${loweremail}', '${newPass}')`;

      client.query(insertQuery, (err, result) => {
        if (!err) {
          console.log("Insertion was successful");
          res.send({ v: "Insertion was successful" });
        } else {
          console.log(err.message);
        }
      });
      return true;
    } catch (error) {
      console.error(error.stack);
      return false;
    } finally {
      await client.end(); // closes connection
    }
  };

  const text = `
    CREATE TABLE IF NOT EXISTS "extentionlogin" (
        "extension_id" VARCHAR(64),
	    "client_id" SERIAL,
      "Username" VARCHAR(256),
        "email" text NOT NULL UNIQUE,
        "password" VARCHAR(256)
        
    );`;

  execute(text).then((result) => {
    if (result) {
      res.send({ v: "table created" });
      console.log("Table created");
    } else {
      console.log("eslse");
    }
  });
});
app.post("/login", async (req, res) => {
  let email = req.body.email.toLowerCase();
  console.log(email);

  let password = req.body.pass;
  try {
    console.log("try_login");
    const client = new Client({
      host: "localhost",
      user: "postgres",
      port: 5000,
      password: "Tesla@261600",
      database: "fusion",
    });
    await client.connect();
    client.query(
      `Select * from "extentionlogin" Where  extension_id='3234443' AND email='${email}'`,
      (err, result) => {
        if (!err) {
          console.log("!err");
          console.log(result.rowCount);
          if (result.rowCount) {
            //console.log("result", result);

            console.log("result.rows[0]", result.rows[0]);
            bcrypt
              .compare(password, result.rows[0].password)
              .then((isMatch) => {
                if (isMatch === false) {
                  console.log("incorrect");
                  return res.status(401).send({
                    istrue: false,
                    msg: "email or Password is incorrect ",
                  });
                } else {
                  const token = jwt.sign(
                    { id: result.rows[0].client_id.toString() },
                    "sandeep",

                    {
                      expiresIn: 60, // 1 week
                    }
                  );
                  fs.writeFile("tokdata.txt", token, function (err) {
                    if (err) throw err;
                    console.log("Saved!");
                  });

                  console.log({
                    msg: "logged in successfully",
                    user: result.rows[0].Username,
                    token,
                  });
                  return res.status(200).send({
                    msg: "logged in successfully",
                    istrue: true,
                    token: token,
                    user: email,
                  });
                }
              });
            /////////////////////////////////////////
          } else {
            return res.status(401).send({
              msg: "email or password is incorrect",
              istrue: false,
            });
          }
        } else {
          console.log(err);
        }
      }
    );
  } catch {
    console.log("login catch function error");
  }
});

const auth = async (req, res, next) => {
  try {
    fs.readFile("tokdata.txt", "utf8", function (err, data) {
      const token = data;

      if (!token) {
        console.log("!Token");
        return res.status(403).send("A token is required for authentication");
      } else {
        console.log("tryveryfy");
        const decoded = jwt.verify(token, "sandeep", (err, res) => {
          if (err) console.log(err);
          else {
            return next();
          }
        });
        req.user = decoded;
        console.log(req.user);
      }
      console.log("tokendata", data);
    });
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};
app.post("/isalreadylogin", async (req, ress) => {
  try {
    fs.readFile("tokdata.txt", "utf8", function (err, data) {
      const token = data;

      if (!token) {
        console.log("!Token");
        return ress.status(403).send("A token is required for authentication");
      } else {
        console.log("tryveryfy");
        jwt.verify(token, "sandeep", (err, res) => {
          if (err) console.log(err.message);
          else {
            return ress.send({
              istrue: true,
            });
          }
        });
        // req.user = decoded;
        // console.log(req.user);
      }
      console.log("tokendata", data);
    });
  } catch (err) {
    return ress.status(401).send({
      istrue: false,
      result: "invalid token",
    });
  }
});
app.post("/logout", (req, res) => {
  fs.writeFile("tokdata.txt", "", function (err) {
    if (err) {
      res.send({
        istrue: false,
      });
      throw err;
    } else {
      console.log("logout");
      res.send({
        istrue: true,
      });
    }
  });
});
app.post("/browser", auth, async (req, res) => {
  // console.log(req.body);
  // console.log(req.body.pub_key);
  // console.log(req.body.der);
  var puKeyPem2 = req.body.pub_key;
  let p = req.body.p;
  console.log(p);
  var hexSign2 = req.body.der;
  var verifier = crypto.createVerify("sha256"),
    //digest = "test";
    digest = JSON.stringify(payload);
  verifier.update(digest);
  verifier.end();
  let g = verifier.verify(puKeyPem2, hexSign2, "hex");
  if (g == true) {
    console.log("if");

    // console.log("serverPub", sec.public_key);
    // console.log("secret", sec.secret);
    let postgres = async () => {
      try {
        console.log("try");
        const client = new Client({
          host: "localhost",
          user: "postgres",
          port: 5000,
          password: "Tesla@261600",
          database: "fusion",
        });
        await client.connect();
        client.query(
          `Select * from "passwordmgmr" Where  website='website' AND extension_id='3234443' AND client_id=21`,
          (err, result) => {
            if (!err) {
              if (result.rowCount) {
                //console.log("result", result);
                let sdata = result.rows[0];
                console.log(sdata);
                console.log(sdata.fullname);
                console.log(sdata.password);
                let mailorname;
                if (!sdata.email) {
                  mailorname = sdata.email;
                } else {
                  mailorname = sdata.fullname;
                }
                data = {
                  username: mailorname,
                  password: sdata.password,
                };
                data = JSON.stringify(data);
                console.log(data);
                let sec = sign(p);
                let endata = encrypt(sec.secret, data);
                console.log(endata);
                let hmacdata = sec.public_key + endata.iv + endata.ciphertext;
                console.log("hmacdata", hmacdata);
                let hmac = crypto
                  .createHmac("sha256", sec.hmac_key)
                  .update(hmacdata)
                  .digest("hex");
                console.log(hmac);
                let finalpayload = {
                  ...endata,
                  hmac: hmac,
                  pub_key: sec.public_key,
                };
                res.send(finalpayload);

                // res.send(result.rows[0]);
              } else {
                console.log("some error", err);
              }
            } else {
              console.log(err);
            }
          }
        );
        client.end;
      } catch {
        console.log("catch");
      }
    };
    postgres();
  }

  //return res.send(finalpayload);
});
//function send(data) {}
// verifier.end();
// console.log(verifier.verify(puKeyPem, hexSign, "hex"));
app.listen(8000, () => {
  console.log(`listen at port ${8000}`);
});
//////////////////////////////////////////////////////////
////////////////////////////////////////////////////
