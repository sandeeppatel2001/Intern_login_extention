const crypto = require("crypto");
// let secretkey = "gax4nXE8yphF0QA6DWU0mTTNDvTDxFsO";
const express = require("express");
const fs=require("fs");
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
  fs.appendFile('img.txt', req.body.imgdata, function (err) {
    if (err) throw err;
    else{
      res.send({
        istrue:true,
      });
      console.log('Updated!');
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

// app.post('/sendatphone',(req,res)=>{
  
// });
app.post("/sendotp", (req, res) => {
  if(emailvalidator.validate(req.body.emailorphone)){
    console.log("email.......");
    emailorphone = req.body.emailorphone.toLowerCase();
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
        console.log("ssssssss");
        console.log(err);
        return res.send("not send");
      } else {
        console.log(info);
        return res.send({ istrue: true });
      }
    });
  }else{
    console.log("this is not email");
    console.log("sending at phone.....");
    emailorphone=req.body.emailorphone;
    otpval = Math.floor(100000 + Math.random() * 900000);
    const accountSid = "ACcabaf757707dbd83323156057eb1621c";
    const authToken = "b36ac79462cc8e4c617f1892f53f53a3";
    const client = require('twilio')(accountSid, authToken);
  
    client.messages
      .create({
        body: `Your OTP Is ${otpval} `,
        from: '+1 567 409 2840',
        to: `+91${emailorphone}`
      })
      .then(message => {
        console.log(message.sid);
        res.send({
          istrue:true,
          t:"from phonesend"
        });
      });
  }
});

app.post("/checkotp", async (req, res) => {
  let variable="mobilenum";
  if (otpval == req.body.otp) {
    console.log("same otp");
    if(emailvalidator.validate(emailorphone)){
      variable="email";
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
  const mobilenum=req.body.mobilenum;
  console.log(loweremail);
  if(emailvalidator.validate(req.body.email)){
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
  
    const text = `
      CREATE TABLE IF NOT EXISTS "extentionlogin" (
          "extension_id" VARCHAR(64),
        "client_id" SERIAL,
        "Username" VARCHAR(256),
          "email" text NOT NULL UNIQUE,
          "mobilenum" text,
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
  }else{
    console.log("email not valied");
    res.status(400).send({
      istrue:false,
      t:"emailnot valie"
    });
  }
  
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
    );
  } catch {
    console.log("login catch function error");
  }
});

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
      jwt.verify(authtoken, "sandeep", (err, res) => {
        console.log("res", res);
        if (err) {
          console.log(err);
          //return;
        } else {
          console.log("verify true");
          // req.user = decoded;
          // console.log(req.user);
          return next();
        }
      });
    }

    //});
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};
app.post("/isalreadylogin", auth, async (req, res) => {
  return res.send({
    istrue: true,
  });
});

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
//function send(data) {}
// verifier.end();
// console.log(verifier.verify(puKeyPem, hexSign, "hex"));

app.post("/credential", auth, (req, res) => {
  console.log("credential");
  const client = new Client({
    host: "127.0.0.1",
    user: "postgres",
    database: "fusion",
    password: "Tesla@261600",
    port: 5000,
  });

  const execute = async (query) => {
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
    //_Password = await bcrypt.hash(_Password, 8);
    await client.connect(); // gets connection
    await client.query(query);
    try {
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
    } catch (error) {
      console.error(error.stack);
      res.send({ v: "catchfunction running at /credential" });
      return false;
    } finally {
      // closes connection
    }
  };

  const text = `
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

  execute(text).then((result) => {
    if (result) {
      res.send({ v: "table created" });
      console.log("Table created");
    } else {
      console.log("eslse db creat if not exist");
    }
  });
});
app.listen(8000, () => {
  console.log(`listen at port ${8000}`);
});
//////////////////////////////////////////////////////////
////////////////////////////////////////////////////
