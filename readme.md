# what does this extension do

By using this we can skip login page after login for site then this extension takes your credentials and save it in database, while saving your credentials we use end-to-end encryption

# how to set-up

Download final folder, inside final folder there are two folders one is extension(frontend) and another is backend, we need setup as follow
<!-- 
## how to setup extension(frontend) ???

go to browser extension setting , click developer mood on then click load unpack and go inside your extension(frontend) folder (make sure you are inside extension (frontend) folder where all different file like server.js , img.txt and other present ) click select folder and your extension is ready to go make sure you extension is turn on

![Screenshot](setting.png)

## how to setup backend(server)???

Go to terminal and open backend directory, you need to install npm package separately all the packages listed in package.json
Since all required packages are present in package.json file so you don't need to install all package separately you just need to run command

```bash
npm i

```

You have to run npm i (not npm init -y and not other commands otherwise you have to install all packages separately)
-->
# set for sending otp by mail or phone

## sending otp at mail by using nodemailer

You must allow nodemailer to mail from Google settings

for that you have to do following steps-

1 Log in to your Google account
Go to security

2 Under Signing in to Google enable 2-Step Verification

3 Under Signing in to Google click on App passwords.

4 You'll now generate a new password. Select the app as Mail and the device as Other (Custom name) and name it.

5 Save the app password

## path

1 https://www.google.com/settings/security/lesssecureapps

2 https://g.co/allowaccess

![Screenshot](nodemailer.png)

#### if you are facing any issu then follow this link

stackoverflow(https://stackoverflow.com/questions/19877246/nodemailer-with-gmail-and-nodejs)

### after setting nodemail at google you have to replace your email id and password ganerated by google during setup at at tranceport function.

## sending otp at phone by using twilio

for this you have to follow this link
[How to create your Free Twilio Trial Account](https://www.twilio.com/docs/usage/tutorials/how-to-use-your-free-trial-account)

after setup thi you have to change accountSid and authToken with your accountSid and authToken and also update from(from where you have to send massege) in "client.messages.create" funtion with your twilio number

#### in free version you have to verify with youn phone number where you want to send otp also but for paid version you can send otp any where

# you have to change some line for connecting postgressql

### in client function you have to change your password and port

postgres default port is 5432 if you are not changing your port during installing postgress then you port is 5432 ,in my case i have changed my default port from 5432 to 5000 ,so set your port according to you

# how to start server

for starting servere you have to run command

```bash
node servere.js
```

and you are good to go

# how to use ???

first turn on your extension as says upper ,now click on
Extension icons then click your extension icons then popup window will open then you have to signin first

![Screenshot](signinpage.png)

then you have to login as follow

![Screenshot](loginpage.png)

you can also login by sending otp at registered email or phone number

![Screenshot](otppage.png)

# how hole code works ???

## You can see the complete code which is commented, the comments explain which function is doing what

### some encryption process(https://github.com/mai1x9/internship-sandeep/tree/main/passwd-extension#readme)

## manifest.json file code explanation

### 1. "manifest_version": "manifest_version": 3, tell that extension version this should be 3 because version version 2 will deprecated from july 2023

### 2. "name": name is your extension name will show in frontend when we click extension icon

### 3. "version": this version is just your updated version you can put any number here

### 4. "description": description show ,when you click on extension detail button ,it can be anythings

### 5. "content_scripts": A content script is a part of your extension that runs in the context of a particular web page or for all url as you defined in match(we define it as <all_urls> we can put some particular url also)

### 6. "web_accessible_resources": for some permission or if we required to get some user detail or some media required then that file should be in web_accessible_resources so that user can see what kind of information or permition you are taking , If you don't put it in web_accessible_resources, it won't work it's blocked by google

### 7."background": Background scripts or a background page enable you to monitor and react to events in the browser, such as navigating to a new page,

A background script is usually used for central handling of tasks, while content scripts act as intermediaries between it and pages you want to interact with. As for your situation: You need to have a background script to listen to the button click event. You need to have a content script to interact with a page.

### 8. "action": In "action" we define that when we click extension from side of bookmark tab then which file should open here we are openig login page

### 9. "incognito": By This incognito process runs along side the regular process, but has a separate memory-only cookie store. Each process sees events and messages only from its own context (for example, the incognito process will see only incognito tab updates)

### 10. "host_permissions": A host permission is any match pattern specified in the "permissions" and "content_scripts" fields of the extension manifest

### 11. "permissions":we have to take permition for any kind of operation we are doing in frontent side

"activeTab":
The activeTab permission gives an extension temporary access to the currently active tab when the user invokes the extension

"declarativeNetRequest":The declarativeNetRequestFeedback permission is required to access functions and events which return information on declarative rules matched.

"declarativeNetRequestWithHostAccess":
The declarativeNetRequestWithHostAccess permission always requires host permissions to the request URL and initiator to act on a request.

"declarativeNetRequestFeedback":
The declarativeNetRequestFeedback permission is required to access functions and events which return information on declarative rules matched.

"storage": for access of local store we have to take permission of storage
