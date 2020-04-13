//NOTE: es 2015 modules would look like "import express from "express"
//common js modules
//node does not support es2015 import syntax
const express = require("express");
const mongoose = require("mongoose");
const keys = require("./config/keys");
const cookiesSession = require("cookie-session");
const passport = require("passport"); //we need to tell passport to make use of the cookie sessions
const bodyParser = require("body-parser");

require("./models/User");
require("./models/Survey");
require("./services/passport");

//this app object is used to set up confirguation to listen to incoming requests from node and route those to route handlers to deal with those requests
const app = express();

//all express middleware needs to be wired up with app.use(//)
app.use(bodyParser.json());

//cookies-session puts cookie data inside req.session
//passport will look for relevant data inside req.session
//all relevant data (14kb max) with cookie-session is stored inside the cookie
app.use(
  cookiesSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, //30days
    keys: [keys.cookieKey]
  })
);

//telling passport to use cookies to handle authentication
app.use(passport.initialize());
app.use(passport.session());

require("./routes/authRoutes")(app);
require("./routes/billingRoutes")(app);
require("./routes/surveyRoutes")(app);

if(process.env.NODE_ENV ==="production"){
  //order matters
  //Express will serve up production assets
  //like our main.js file, or main.css files
  app.use(express.static("client/build"))

  //Express will serve up the index.html file 
  //if it doesn't recognize the route
  const path = require("path");
  app.get("*", (req, res)=>{
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  })
}

//environment variable - checks for underlying environment (e.g. Heroku) and select what port they have told us to use
//if no define environment variable use port 5000 as default
const PORT = process.env.PORT || 5000;
app.listen(PORT);

//connecting mongo to mongoDB
mongoose.connect(keys.mongoURI);
