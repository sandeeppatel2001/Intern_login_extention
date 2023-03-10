const crypto = require("crypto");
// let secretkey = "gax4nXE8yphF0QA6DWU0mTTNDvTDxFsO";
const express = require("express");
const fs = require("fs");
const { Client } = require("pg");
const app = express();
const emailvalidator = require("email-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var bodyParser = require("body-parser");
const cors = require("cors");
//const { json } = require("express");
//const { stringify } = require("querystring");
//const { hasSubscribers } = require("diagnostics_channel");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const nodemailer = require("nodemailer");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// let payload = {
//   host: "lms.iitjammu.com",
//   url: "https://lms.iitjammu.ac.in/login/index.php",
//   time: 2222,
//   ClientId: "mdskdsfjkdvndksjvvnkfv",
//   extentionid: "1111111111111111111",
// };
let data;
console.log("hiiiiiiiiiiiiiiiiiiii");
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
  fs.appendFile("img.txt", req.body.imgdata, function (err) {
    if (err) throw err;
    else {
      res.send({
        istrue: true,
      });
      console.log("Updated!");
    }
  });
  // const client = new Client({
  //   host: "127.0.0.1",
  //   user: "postgres",
  //   database: "fusion",
  //   password: "Tesla@261600",
  //   port: 5000,
  // });

  // console.log(req.body.imgdata);
  // const execute = async (query) => {
  //   await client.connect(); // gets connection
  //   await client.query(query);
  //   try {
  //     let insertQuery = `INSERT INTO "img_data" (

  //       "imgdata"
  //       )
  //       values('${req.body.imgdata}')`;

  //     // eslint-disable-next-line no-unused-vars
  //     client.query(insertQuery, (err, result) => {
  //       if (!err) {
  //         console.log("img_Insertion was successful");
  //         res.send({ v: "img_Insertion was successful" });
  //       } else {
  //         console.log(err.message);
  //       }
  //     });
  //     return true;
  //   } catch (error) {
  //     console.error(error.stack);
  //     return false;
  //   } finally {
  //     await client.end(); // closes connection
  //   }
  // };
  // const text = `
  //   CREATE TABLE IF NOT EXISTS "img_data" (
  //       "imgdata" text NOT NULL
  //   );`;

  // execute(text).then((result) => {
  //   if (result) {
  //     res.send({ v: "table created" });
  //     console.log("Table created");
  //   } else {
  //     console.log("eslse");
  //   }
  // });
});
app.get("/home", (req, res) => {
  res.send("sandeep patel");
});
let otpval = 12;
let emailorphone = "";

// this code for dending otp at phone or email
app.post("/sendotp", (req, res) => {
  //emailvalidater validate that is email or not
  //if email is tru then send otp at email else phone number
  if (emailvalidator.validate(req.body.emailorphone)) {
    console.log("email.......");
    emailorphone = req.body.emailorphone.toLowerCase();
    // this ganerate 6 digit random otp
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
        //nodemailer user email
        user: "sandeepkrpatel2002@gmail.com",
        //your  password it's ganerated by google when
        //you allow from google setting to send mail from nodemailer
        pass: "riuwaswnpaqafoga",
      },
      // tls: { rejectUnauthorized: true },
    });
    const mailOptions = {
      from: "sandeepkrpatel2002@gmail.com", // Sender address
      to: `${emailorphone}`, // List of recipients
      subject: "Node Mailer by sandeep", // Subject line
      text: `Your OTP is ${otpval} send by sandeep code`, // Plain text body
    };

    transport.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log("otp send error function running");
        console.log(err);
        return res.send("not send");
      } else {
        console.log(info);
        return res.send({ istrue: true });
      }
    });
  } else {
    console.log("this is not email");
    console.log("sending at phone.....");
    emailorphone = req.body.emailorphone;
    otpval = Math.floor(100000 + Math.random() * 900000);
    // this is twilio Sid and authtoken that's ganerated after resister at twilio
    const accountSid = "ACcabaf757707dbd83323156057eb1621c";
    const authToken = "b36ac79462cc8e4c617f1892f53f53a3";
    const client = require("twilio")(accountSid, authToken);

    client.messages
      .create({
        body: `Your OTP Is ${otpval} `,
        from: "+1 567 409 2840", //phone number given by twilio
        to: `+91${emailorphone}`, //where we have to send msg but for free version it is sending only veryfied nuber by twilio only
        //first you have to veryfied  at twilio, where you resister your number there you can verifie it
      })
      .then((message) => {
        console.log(message.sid);
        res.send({
          istrue: true,
          t: "from phonesend",
        });
      });
  }
});
// this code for veryfieng otp is true or not
app.post("/checkotp", async (req, res) => {
  let variable = "mobilenum";
  if (otpval == req.body.otp) {
    console.log("same otp");
    // if we send otp at email then we have to search data by email otherwise by phone nuber
    if (emailvalidator.validate(emailorphone)) {
      variable = "email";
    }
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
      //searching data by email or phone number
      client.query(
        `Select * from "extentionlogin" Where  extension_id='3234443' AND ${variable}='${emailorphone}'`,
        (err, result) => {
          if (!err) {
            console.log(emailorphone);
            console.log("!err");
            console.log(result.rowCount);
            if (result.rowCount) {
              //console.log("result", result);

              console.log("result.rows[0]", result.rows[0]);
              //ganerated token for valied only 3000 second
              const token = jwt.sign(
                { id: result.rows[0].client_id.toString() },
                "sandeep",
                {
                  expiresIn: 3000,
                }
              );

              console.log({
                msg: "otp match",
                user: result.rows[0].Username,
                token,
              });
              return res.status(200).send({
                msg: "otp logged in successfully",
                istrue: true,
                token: token,
                user: emailorphone,
              });
            }
          }
        }
      );
    } catch {
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
// this code for extention resistretion(sign in)
app.post("/sing", async (req, res) => {
  const client = new Client({
    host: "127.0.0.1",
    user: "postgres",

    password: "Tesla@261600",
    port: 5000,
  });
  await client.connect(); // gets connection
  //if user first time doing signin then we have creat database
  const createDatabase = async () => {
    try {
      await client.query("CREATE DATABASE fusion");
      console.log("tryrrrr"); // sends queries
      return true;
    } catch (error) {
      console.log(error.stack);
      console.log(error.code);
      return true;
    } finally {
      //await client.end(); // closes connection
    }
  };
  await createDatabase().then((result) => {
    if (result) {
      console.log("Database created");
    }
  });
  console.log("now passwordmngr");
  // await client.end();

  // await client.end()
  // const execute2 = async (query) => {
  //   //await client.connect(); // gets connection
  //   await client.query(query);
  //   // await client.end();
  //   return true;
  // };
  // execute2(text).then((result) => {
  //   if (result) {
  //     console.log("passwordmngr Table created");
  //     res.send({ v: "passwordmngr table created" });
  //   } else {
  //     console.log(" exicute2 eslse db creat if not exist");
  //   }
  // });

  let newUsername = req.body.name;
  let newPass = req.body.pass;

  let newEmail = req.body.email;
  let loweremail = newEmail.toLowerCase();
  const mobilenum = req.body.mobilenum;
  console.log(loweremail);
  // we have to check user email is valied or not
  // we chacked phone nuber at fronted site so no need to check again
  if (emailvalidator.validate(req.body.email)) {
    console.log("email is true");
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
        // saving data in database
        let insertQuery = `INSERT INTO "extentionlogin" (
          "extension_id" ,
          "client_id" ,
          "Username" ,
          "email" ,
          "mobilenum",
          "password"
          )
          values(${3234443}, ${21}, '${newUsername}', '${loweremail}','${mobilenum}', '${newPass}')`;

        // eslint-disable-next-line no-unused-vars
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
        //await client.end(); // closes connection
      }
    };
    const execute3 = async (query) => {
      // await client.connect(); // gets connection
      await client.query(query);
      return true;
    };
    // if user first time doing signin then we have to creat table
    // for saving deferent site credensials
    const text3 = `
        CREATE TABLE IF NOT EXISTS "passwordmgnr" (
            "extension_id" VARCHAR(64),
          "client_id" SERIAL,
            "email" VARCHAR(128),
            "website" VARCHAR(256),
            "password" VARCHAR(256),
            "pubkey" VARCHAR(256),
            "expiry" VARCHAR(256),
          "fullname" VARCHAR(100) 
        );`;
    // await client.connect();
    execute3(text3).then((res) => {
      if (res) {
        console.log(" passswordmnr Table created");
      } else {
        console.log("eslse");
      }
    });
    //if user resister first time then we have to ganerate table in data base
    const text = `
      CREATE TABLE IF NOT EXISTS "extentionlogin" (
          "extension_id" VARCHAR(64),
        "client_id" SERIAL,
        "Username" VARCHAR(256),
          "email" text NOT NULL UNIQUE,
          "mobilenum" text,
          "password" VARCHAR(256)
          
      );`;

    execute(text)
      .then((result) => {
        if (result) {
          res.send({ v: "table created" });
          console.log("Table created");
        } else {
          console.log("eslse");
        }
      })
      .then(() => {
        // client.end();
      });
  } else {
    // client.end();
    console.log("email not valied");
    res.status(400).send({
      istrue: false,
      t: "emailnot valie",
    });
  }
});
// this code for login in extention
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
    //matching credentials if match then do login
    client
      .query(
        `Select * from "extentionlogin" Where  extension_id='3234443' AND email='${email}'`,
        (err, result) => {
          if (!err) {
            console.log("!err");
            console.log(result.rowCount);
            if (result.rowCount) {
              //console.log("result", result);

              console.log("result.rows[0]", result.rows[0]);
              //we were save password as encrypted form so we have to encrypt then match
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
                        expiresIn: 3000, // 1 week
                      }
                    );
                    console.log(token);
                    // fs.writeFile("tokdata.txt", token, function (err) {
                    //   if (err) throw err;
                    //   console.log("Saved!");
                    // });

                    console.log("aa", {
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
      )
      .then(() => client.end());
  } catch (err) {
    console.log("login catch function error", err);
  }
});
// chaking that token is valide or not
const auth = async (req, res, next) => {
  try {
    // fs.readFile("tokdata.txt", "utf8", function (err, data) {
    //   const token = data;
    const authtoken = req.body.token;
    console.log("authfunxction");
    console.log("auth", req.body);
    console.log("authfunction", authtoken);
    if (!authtoken) {
      console.log("!Token");
      return res.status(403).send("A token_ is required for authentication");
    } else {
      console.log("tryveryfy");
      // veryfying token
      jwt.verify(authtoken, "sandeep", (err, res) => {
        console.log("res", res);
        if (err) {
          console.log("auth function error running");
          console.log(err);
        } else {
          console.log("verify true");

          return next();
        }
      });
    }

    //});
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};
// if we load popup windows then we are chacking that token is valid then
//thn we have to show "you are logedin"
app.post("/isalreadylogin", auth, async (req, res) => {
  return res.send({
    istrue: true,
  });
});

//when we open any site then it is chacking that for that site url data is present or not
app.post("/browser", auth, async (req, res) => {
  console.log(req.body);
  console.log("/browser");
  let browserdata = JSON.parse(req.body.payload);
  console.log(browserdata);
  var puKeyPem2 = req.body.pub_key;
  let p = req.body.p;
  console.log(req.body.payload);
  var hexSign2 = req.body.der;
  var verifier = crypto.createVerify("sha256");
  //digest = "test";
  // digest = JSON.stringify(payload);
  verifier.update(req.body.payload);
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
        //searching data from database that data is present or not
        client.query(
          `Select * from "passwordmgnr" Where  website='${browserdata.url}' AND extension_id='${browserdata.extentionid}' AND client_id=21`,
          (err, result) => {
            if (!err) {
              if (result.rowCount) {
                //console.log("result", result);
                let sdata = result.rows[0];
                console.log("sdata", sdata);
                console.log("sdata.fullname", sdata.fullname);
                console.log("sdata.password", sdata.password);
                let mailorname;
                if (sdata.email) {
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
                console.log("user not exist");
                res.send(null);
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
  } else {
    console.log("payload not matching");
  }

  //return res.send(finalpayload);
});
// chacking that data is already present then update it otherwise sae it
// when user click login button
app.post("/credential", auth, async (req, res) => {
  console.log("credential");
  const client = new Client({
    host: "127.0.0.1",
    user: "postgres",
    database: "fusion",
    password: "Tesla@261600",
    port: 5000,
  });
  await client.connect();
  let _username = req.body.username;
  let _Password = req.body.Password;
  let _Exid = req.body.extentionid;
  let _url = req.body.url;
  let _email = "";
  const emailvalidator = require("email-validator");
  if (emailvalidator.validate(_username)) {
    _email = _username;
    _username = "";
  }
  console.log(_username, _Password);

  console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

  try {
    // chacking that data is already present then update it otherwise save it
    client.query(
      `Select * from "passwordmgnr" Where  website='${_url}' AND extension_id='${_Exid}' AND client_id=21`,
      async (err, result) => {
        if (!err) {
          if (result.rowCount) {
            // updating data
            console.log("updated");
            const text2 = `UPDATE "passwordmgnr" 
                           SET "email" = $1, "password" = $2 ,"fullname"=$3
                           WHERE extension_id=$4 AND website = $5 `;
            console.log("data exist already");
            await client.query(text2, [
              _email,
              _Password,
              _username,
              `${_Exid}`,
              `${_url}`,
            ]);
          } else {
            // saving data beacuse data is not present for that site
            console.log("not updating saving data");
            let insertQuery = `INSERT INTO "passwordmgnr" (
                    "extension_id" ,
                    "client_id" ,
                    "email" ,
                    "website" ,
                    "password" ,
                    "pubkey" ,
                    "expiry" ,
                    "fullname"
                    )
                    values('${_Exid}', '${21}', '${_email}', '${_url}', '${_Password}', '${"pubkey"}', '${"expiry"}', '${_username}')`;
            // eslint-disable-next-line no-unused-vars
            client.query(insertQuery, (err, result) => {
              if (!err) {
                console.log("Insertion was successful");
                res.send({ v: "Insertion was successful" });
                return true;
              } else {
                console.log(err.message);
                res.send({ v: "Insertion was not done" });
                return false;
              }
            });
          }
        } else {
          console.log(err);
          return false;
        }
      }
    );
  } catch (error) {
    console.log(error);

    return false;
  }

  // const text = `
  //       CREATE TABLE IF NOT EXISTS "passwordmgnr" (
  //           "extension_id" VARCHAR(64),
  //         "client_id" SERIAL,
  //           "email" VARCHAR(128),
  //           "website" VARCHAR(256),
  //           "password" VARCHAR(256),
  //           "pubkey" VARCHAR(256),
  //           "expiry" VARCHAR(256),
  //         "fullname" VARCHAR(100)
  //       );`;

  // execute(text).then((result) => {
  //   if (result) {
  //     res.send({ v: "table created" });
  //     console.log("Table created");
  //   } else {
  //     console.log("eslse db creat if not exist");
  //   }
  // });
});

app.listen(8000, () => {
  console.log(`listen at port ${8000}`);
});
//////////////////////////////////////////////////////////
////////////////////////////////////////////////////
