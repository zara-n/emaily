# Email Survey App

A work in progress for new features and a fancier UI, however the "MVP" so to speak is completed. 

The main purpose of this project was to learn Node.js in depth and utilise its functionalities.

This read me is essentially a diary of libraries, APIs, code and helpers I have used, explaining why I have used them and how I have incorporated them into my application.

`npm run dev`

You will not be able to run on your local machine if you don't have the appropriate API keys (that have not been commited).

## What is this app?

Production Link: https://sleepy-wildwood-37773.herokuapp.com/

Users can create surveys and send them out to people's emails using credits (paid for), the app will tabulate and display the data on a React UI. Incorporating a Google login.

(pending) See [Appendix 1.1](#Appendix) for a high level overview of _how it works_ behind the scenes.

## Architecture of App

This app will be using React, Redux, Node / Express API, and MongoDB.

(pending) See Appendix 1.2 for _how it works_ behind the scenes.

## Node.js & Express

(pending) See Appendix 2.1 for a high level overview of _how it works_ behind the scenes.

### 101

Initiate root/startup file e.g. _index.js_

`const express = require("express");`

`const app = express();`

Example Route Handler:

`app.get("/", (req, res) => { res.send({ hi: "there" }); });`

`app.listen(5000);`

**app:** represents the underlying express server

**get:** Watch for incoming request with this method (express has other methods, and get is one of them)

**"/"**: Route of the handler.

**req:** Object representing the incoming request.

**res: **Object representing the outgoing response.

**res.send({hi: "there"}):** Body of the arrow function, it tells express to immediately send some JSON back to whoever made this request.

**app.listen(5000):** (continously) instructs express to tell node to listen for incoming traffic on port 5000

### Nodemon

Everytime we changes are made to the root file ( e.g _index.js_), the server has to be restarted.

Installing the Nodemon module fixes the need to continiously restart the server, in terminal:

`npm install --save nodemon`

In _package.json_, under `scripts` make a new addition:

`"dev": "nodemon index.js"`

Then type `npm run dev` in terminal will initiate the server and update continously on any changes made.

## **HEROKU**

### Setup (Pre-deployment checklist)

**Dynamic Port Binding**
Heroku will tell us which port our app will use, so we need to make sure we listen to the port they tell us to.

`const PORT = process.env.PORT || 5000;`
`app.listen(PORT);`

**Specifiy Node Environment**
We need to tell Heroku to use specific/compatible version of node.

_In package.json:_

`"engines": { "node": "8.1.1", "npm": "5.0.3"`
`},`

NOTE: Can cause error, matching node version to one on machine can fix issue.

**Specify start script**
Instructing Heroku what command to run to start our server running.

_in pacake.json - replace default_ "test" with "start":

`"scripts": { "start": "node index.js" },`

**Create .gitignore file**
Instructing Heroku to not commit unwanted things such as all our dependencies (node modules). We want Heroku to install any dependencies itself.

Create _.gitignore_ file at root of the folder and add
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

Two links will be provided in the terminal, one an to access your app to view online, second a **remote git repository** which is our _deployment target_.

We push our _local git repository_ set up above to our _remote git repository_ (managed by heroku) which will deploy changes to Heroku. In terminal:

`git remote add heroku [remote git repository]`
_might exist already_

`git push heroku master`

### Continuous Deployment

**Commit codebase with git**
Upon any changes to the app, do the process for the usual git commi:

` git status`` ``git add .`` ``git commit -m "changes' `

**Deploy App with Git**

`git push heroku master`

### Heroku Build

We need to build production assets after dependencies are installed.

https://devcenter.heroku.com/articles/nodejs-support#customizing-the-build-process

We tell Heroku to install client dependencies. and we tell Heroku to run `npm run build`

Inside server directory, in package.json under `"scripts"`:

`"heroku-postbuild": "NPM_CONFIG_PRODUCTION=false npm install --prefix client && npm run build --prefix client"`

## Google OAuth

Allows for a sign up / sign in (authentication) with Google.

See Appendix 3.1 for a high level overview of _how it works_ behind the scenes.

### PassportJS

A library to handle and automate our authentication flow between **our server** and **Google**

http://www.passportjs.org/

Issues with PassportJS: it automates a lot of the authentication flow, it doesn't do it all.

It requires two libraries to make it work with **one** specific provider.

**Passport**
The core passport library, general helpers for handling auth in Express app.

**Passport Strategy**
Helpers for authenticating with **one** very specific method (e.g.email/password, Google, Facebook, etc.).

_Additional methods will require additional passport strategies:_

http://www.passportjs.org/packages/

**Passport & Passport Strategy Installation**
_(using "oAuth20@2" for backwards compatability)_

`npm install passport --save`

`npm install passport-google-oauth20@2 --save`

### Setting Up Google API

The app needs to be registered to a google account in order to use the Google API:

1. Create new project at: http://console.developers.google.com/
2. Go to project and go to _credentials_
3. Configure consent screen
4. Create new credential
   1. Authorise URIs (e.g. http://localhost:5000)
   2. Authorise Redirect URI (e.g. http://localhost:5000/auth/google/callback)
   3. Upon creation Client ID & Client Secret will be provided

### Security - Keys

To keep the Client ID & Client Secret keys private to anyone reviewing sourcecode on places such as GitHub, a seperate file needs to be created that contains those keys.

e.g. Root -> Config -> keys.js

`module.exports = { googleClientID: "...", googleClientSecret: "..."`
`}`

**IMPORTANT**: Then add `keys.js` to _.gitignore_

### 101

1. Inside our root/startup file e.g. _index.js_ import _passport_, the _passport google strategy_ and the _keys_.

`const passport = require("passport"); const GoogleStrategy = require("passport-google-oauth20").Strategy;`
`const keys = require("./config/keys");`

2. Create a new instance of `GoogleStrategy`

   `passport.use( new GoogleStrategy( { clientID: keys.googleClientID, clientSecret: keys.googleClientSecret, callbackURL: "/auth/google/callback" }, accessToken => { console.log(accessToken); } )`
   `);`

**Notes:** _callbackURL_ argument represents route the user will be sent after they grant permissions to out applications (redirect URI)

3. Create route handler

   `app.get( "/auth/google", passport.authenticate("google", { scope: ["profile", "email"] })`
   `);`

**Notes:**
`GoogleStrategy` has an internal identifier for entered "google" parameter in `passport.authenticate`, hency why passport knows what it is referring to.

In `scope` we are asking for access user's profile and email, these are predefined terms by Google.

### Theory of Authentication: HTTP & Tokens

By default HTTP (requests) is **stateless**: one HTTP request itself does not share information/state with other HTTP requests.

For Authentication, tokens are used as they hold information for follow up HTTP request, to identify requests - used between browsers and servers. Browsers will automatically append that token/cookie and use it for any follow up server requests.

### Cookies-session

Express cannot deal with cookies directly, therefore a helper module is needed to handle cookies:

`npm install --save cookie-session`

Cookies-session puts cookie data inside req.session & passport will look for relevant data inside req.session

All relevant data (14kb max) with cookie-session is stored inside the cookie, as opposed to _express-session_ which stores the information remotely (e.g. database) without a size limit. Since this application only require to store the user's ID (a small piece of data) - so cookie-session will suffice.

## MongoDB

MongoDB databses are schemaless (different records can have varying attributes).
The use of mongoose does not allow this ability.

https://www.mongodb.com/cloud/atlas

**IMPORTANT:** Add mongoURI to _keys.js._

### Mongoose

Allows the easier use of MongoDB and creating MongoDB collections.

**Model classes** are used access **MongoDB collection** ( a collection of data e.g. Users)

**Model Instances** represent individual **MongoDB records** within collections. (e.g. a single user).

**Important:** For the seperate production project in MongoDB make sure to whitelist all IPs so that Heroku can access it. (0.0.0.0/0)

## Production Vs Development

Seperate Mongodatabase & Google API key have been set up to seperate production (Heroku) vs Development Environements.

Created seperate files for prod & dev keys in Config project folder, and a seperate file to deal with handling checking which environment is running and require keys accordingly.

NOTE: update .gitignore

The following code checks if the environment is in production or not.

`if (process.env.NODE_ENV === "production")`

For production environment we check for environment variables (Heroku), e.g.:

`googleClientID: process.env.GOOGLE_CLIENT_ID`

And assign the config variables inside Heroku (in settings).

### Express vs React Server

Express has route handlers for requests, and React has route handlers for rendering pages/components.

Therefore, Express needs to be instructed to assume that any routes that it does not have handlers for, it is not responsible for.

## Create React App - The Front End

Inside the server/project directory

`npx create-react-app client`

### Setting up proxy in Create React App 2.0 & 3.0 for our DEVELOPMENT ENVIRONMENT

IN DEVELOPMENT: Inside the client (front end) part of the application we want to allow the user to sign in using google and redirect them to our oAuth flow which sits in our back end server in a different port. To redirect them to `/auth/google` dynamically dependant on wether we are in our dev or production environment we must set up some sort of proxy:

in client directory:

`npm install http-proxy-middleware@0.21.0`

And added proxies to `setupProxy.js` inside `client/src/` (no need to import):

`const proxy = require("http-proxy-middleware"); module.exports = function(app) { app.use(proxy(['/api', '/auth/google'], { target: 'http://localhost:5000' }));`
`}`

### **IMPORTANT**

Whitelist / add a second URI redirect to the Google Project:

`http://localhost:3000/auth/google/callback`

## Two Concurrent Servers

Front end react server (client) needs to run at the same time as the back end server (express).

Inside _package.json_ under `"scripts"` to allow for both servers to run concurrently -under the **server's** directory:

`"scripts": { "start": "node index.js", "server": "nodemon index.js", "client": "npm run start --prefix client", "dev": "concurrently \"npm run server\" \"npm run client\""`
`}`

"_Concurrently_" module allows for both servers to run with one command:

`npm install --save concurrently`

## React & More

### Redux

Inside client directory:
`npm install --save redux react-redux`

### React-Router

Inside client directory:
`npm install --save react-router-dom`

### Thunk

Middleware necessary to maintain asyn actions to behave the it is expected, in client directory:

`npm install --save redux-thunk`

Default/vanilla Redux action creators expect an action to be **immediately** returned, Thunk allows us direct access to the dispatch function and use it manually that is automatically returned otherwise(behind the scenes).

### Axios

Axios is responsible to make API/Ajax requests to the back end API, in client directory:

`npm install --save axios`

### Redux-Form

Making wiring up state to forms easier, especially for survey form review (wizard type form).

https://redux-form.com/8.3.0/

In client directory: (specific version to avoid bugs in new version)

`npm install --save redux-form@8.1.0`

## Materialize

https://materializecss.com/

CSS library that is only partly compatible with React.

In client directory:

`npm install --save materialize-css`

## Stripe (Payment method)

Stripe is a payment api.

https://dashboard.stripe.com/

For the front end portion, in the client directory:

`npm install --save react-stripe-checkout`

Add the API keys from the Strip dashboard to the keys file in config

`stripePublishableKey`
`stripeSecretKey`

In production mode update the config variables inside heroku settings.

In the client directory setup .env.production & .env.development files to store front end publishable key. https://create-react-app.dev/docs/adding-custom-environment-variables/

For the back end portion, in the server directory:

`npm install --save stripe`

https://www.npmjs.com/package/stripe

On creating a charge: https://stripe.com/docs/api/charges/create

## Body-Parser ( Express & Parsing Post Requests)

When a POST request is made to an Express server, it does not by default parse the request payload. Therefore a module helper is required:

https://www.npmjs.com/package/body-parser

In server directory:

`npm install --save body-parser`

Payload data will be put in `req` and can be accessed with `req.body`

## SendGrid (email API)

A helper module to help create and send emails using SendGrid, in server directory:

`npm install --save sendgrid`

https://sendgrid.com/

https://app.sendgrid.com/settings/api_keys

Add api keys to server config keys file, (prod & heroku, dev);

## Ngrock & Webhooks in Development

Ngrok allows for Sendgrid to make a post request to our local express server in development mode.

Ngrock listens for requests made by Sendgrid which is then forwarded to the local host express server.

We can use npx to run ngrok and have it forward traffic to port 5000 without installing anything. To do this, open a brand new terminal and run:

`npx ngrok http 5000`

This will launch up a pop-up window with the address that can be used.

This address that was generated will only exist for 8 hours.The terminal session should remain open and running during development.

`npx ngrok http 5000`x can be re-ran and the address will be different. Ngrok generated address may need to be updated several times in the Sendgrid dashboard through the development process.

### Sendgrid integration

In sendgrid dashboard settings, under **event web hooks / notifications** enter in ngrok generated address to HTTP Post URL with suffix `/api/surveys/webhooks` (the route handler) and **enable webhook status**

Will have to be replaced for production mode with heroku, or seperate sendgrid account can be made as only 1 POST URL is allowed per Sendgrid account.

https://app.sendgrid.com/settings/mail_settings

Test the integration.

Select desired event notification post, in the case of this project **Click events.**

## Path-parser

Allows us to extract necessary information out of URL paths, in server directory:

`npm install --save path-parser`

## Lodash

For some javascript helpers, in server directory:

`npm install --save lodash`

## Appendix

### 1.1

### 1.2

### 2.1

### 3.1
