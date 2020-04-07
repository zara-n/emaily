//NOTE: es 2015 modules would look like "import express from "express"
//common js modules
//node does not support es2015 import syntax
const express = require("express");
const mongoose = require("mongoose");
const keys = require("./config/keys");
const cookiesSession = require("cookie-session");
const passport = require("passport"); //we need to tell passport to make use of the cookie sessions

require("./models/User");
require("./services/passport");

//this app object is used to set up confirguation to listen to incoming requests from node and route those to route handlers to deal with those requests
const app = express();

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

//environment variable - checks for underlying environment (e.g. Heroku) and select what port they have told us to use
//if no define environment variable use port 5000 as default
const PORT = process.env.PORT || 5000;
app.listen(PORT);

//connecting mongo to mongoDB
mongoose.connect(keys.mongoURI);
