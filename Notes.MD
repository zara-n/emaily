# Email Survey App

## What is this app?

Users can create surveys and send them out to people's emails using credits (paid for), the app will tabulate and display the data on a React UI. 

See [Appendix 1.1](#Appendix) for a high level overview of   *how it works*  behind the scenes.

## Architecture of App

This app will be using React, Redux, Node / Express API,  and MongoDB.

See Appendix 1.2 for *how it works* behind the scenes.

## Node.js & Express

See Appendix 2.1 for a high level overview of  *how it works* behind the scenes.

### 101

Initiate root/startup file e.g. *index.js*

`const express = require("express");`

`const app = express();`

Example Route Handler:

`app.get("/", (req, res) => { 
res.send({ hi: "there" });
});`

`app.listen(5000);`

**app:** represents the underlying express server

**get:** Watch for incoming request with this method (express has other methods, and get is one of them)

**"/"**: Route of the handler.

**req:** Object representing the incoming request.

**res: **Object representing the outgoing response.

**res.send({hi: "there"}):** Body of the arrow function, it tells express to immediately send some JSON back to whoever made this request.

**app.listen(5000):** (continously) instructs express to tell node to listen for incoming traffic on port 5000

### Nodemon

Everytime we  changes are made to the root file ( e.g *index.js*), the server has to be restarted.

Installing the Nodemon module fixes the need to continiously restart the server, in terminal:

`npm install --save nodemon`

In *package.json*, under `scripts` make a new addition:

`"dev": "nodemon index.js"`

Then type `npm run dev` in terminal will initiate the server and update continously on any changes made. 

## **HEROKU**

### Setup (Pre-deployment checklist)

**Dynamic Port Binding**
Heroku will tell us which port our app will use, so we need to make sure we listen to the port they tell us to.

`const PORT = process.env.PORT || 5000;`
`app.listen(PORT);`

**Specifiy Node Environment**
We need to tell Heroku to use  specific/compatible version of node.

*In package.json:*

` "engines": {
"node": "8.1.1",
"npm": "5.0.3"` 
` },`

**Specify start script**
Instructing Heroku what command to run to start our server running.

*in pacake.json - replace default* "test" with "start":

`"scripts": {
"start": "node index.js"
},`

**Create .gitignore file**
Instructing Heroku to not commit unwanted things such as all our dependencies (node modules). We want Heroku to install any dependencies itself. 

Create *.gitignore* file at root of the folder and add
`node_modules`

### Initial Deployment

**Create account**

**Commit our codebase to git**
In terminal of the directory of the app

`git init`
`git add .`
`git commit -m "initial commit"`

**Install Heroku CLI and create app**
Follow instructions at (macs: assumes you've installed home-brew):

https://devcenter.heroku.com/articles/heroku-cli

After installation, write the following into the terminal:

`heroku login`

`heroku create`

Two links will be provided in the terminal, one an to access your app to view online, second a **remote git repository** which is our *deployment target*.

We push our *local git repository* set up above to our *remote git repository* (managed by heroku) which will deploy changes to Heroku. In terminal:

`git remote add heroku [remote git repository]`
*might exist already*

`git push heroku master`

### Continuous Deployment

**Commit codebase with git**
Upon any changes to the app, do the process for the usual git commi:

`git status``
``git add .``
``git commit -m "changes'`

**Deploy App with Git**

`git push heroku master`

## Google OAuth

Allows for a sign up / sign in (authentication) with Google.

See Appendix 3.1 for a high level overview of *how it works* behind the scenes.

### PassportJS

A library to handle and automate our authentication flow between **our server** and **Google**

http://www.passportjs.org/

Issues with PassportJS: it automates a lot of the authentication flow, it doesn't do it all.

It requires two libraries to make it work with **one** specific provider.

**Passport**
The core passport library, general helpers for handling auth in Express app.

**Passport Strategy**
Helpers for authenticating with **one** very specific method (e.g.email/password, Google, Facebook, etc.).

*Additional methods will require additional passport strategies:*

http://www.passportjs.org/packages/

**Passport & Passport Strategy Installation**
*(using "oAuth20@2" for backwards compatability)*

`npm install passport --save `

`npm install passport-google-oauth20@2 --save`

### Setting Up Google API

The app needs to be registered to a google account in order to use the Google API:

1. Create new project at: http://console.developers.google.com/
2. Go to project and go to *credentials*
3. Configure consent screen
4. Create new credential
   1. Authorise URIs (e.g. http://localhost:5000)
   2. Authorise Redirect URI (e.g. http://localhost:5000/auth/google/callback)
   3. Upon creation Client ID & Client Secret will be provided

### Security - Keys

To keep the Client ID & Client Secret keys private to anyone reviewing sourcecode on places such as GitHub, a seperate file needs to be created that contains those keys.

e.g. Root -> Config -> keys.js

`module.exports = {
	googleClientID: "...",
	googleClientSecret: "..."`
`}`

**IMPORTANT**: Then add `keys.js` to *.gitignore*

### 101

1. Inside our root/startup file e.g. *index.js* import *passport*, the *passport google strategy* and the *keys*.

`const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;`
`const keys = require("./config/keys");`

2. Create a new instance of `GoogleStrategy`

   `passport.use(
   	new GoogleStrategy(
   		{
   			clientID: keys.googleClientID,
   			clientSecret: keys.googleClientSecret,
   			callbackURL: "/auth/google/callback" 
   		},
   		accessToken => {
   			console.log(accessToken);
   		}
   	)`
   `);`

**Notes:** *callbackURL* argument represents route the user will be sent after they grant permissions to out applications (redirect URI)

3. Create route handler 

   `app.get(
   	"/auth/google",
   	passport.authenticate("google", {
   		scope: ["profile", "email"] 
   	})`
   `);`

**Notes:** 
`GoogleStrategy` has an internal identifier for entered "google" parameter  in `passport.authenticate`, hency why passport knows what it is referring to.

In `scope` we are asking for access user's profile and email, these are predefined terms by Google.

### Theory of Authentication: HTTP & Tokens

By default HTTP (requests) is **stateless**: one HTTP request itself does not share information/state with other HTTP requests. 

For Authentication, tokens are used as they hold information for follow up HTTP request, to identify requests - used between browsers and servers. Browsers will automatically append that token/cookie and use it for any follow up server requests.

### Cookies

Express cannot deal with cookies directly, therefore a helper module is needed to handle cookies:

`npm install --save cookie-session`

## MongoDB

MongoDB databses are schemaless (different records can have varying attributes).
The use of mongoose does not allow this ability.

https://www.mongodb.com/cloud/atlas

**IMPORTANT:** Add mongoURI to *keys.js.*

### Mongoose

Allows the easier use of MongoDB and creating MongoDB collections.

**Model classes** are used access **MongoDB collection** ( a collection of data e.g. Users)

**Model Instances** represent individual **MongoDB records** within collections. (e.g. a single user).

## Production Vs Development

Seperate Mongodatabase & Google API  key have been set up to seperate production (Heroku) vs Development Environements.

Created seperate files for prod & dev keys in Config project folder, and a seperate file to deal with handling checking which environment is running and require keys accordingly. 

NOTE:  update .gitignore

The following code checks if the environment is in production or not.

`if (process.env.NODE_ENV === "production")` 

For production environment we check for environment variables (Heroku), e.g.:

` googleClientID: process.env.GOOGLE_CLIENT_ID` 

And assign the config variables inside Heroku (in settings). 



## Appendix

### 1.1

### 1.2

### 2.1

### 3.1

