//NOTE: es 2015 modules would look like "import express from "express"
//common js modules
//node does not support es2015 import syntax
const express = require("express");

//this app object is used to set uo confirguation to listen to incoming requests from node and route those to route handlers to deal with those requests
const app = express();

//route handler
app.get("/", (req, res) => {
  res.send({ hi: "there" });
});

//environment variable - checks for underlying environment (e.g. Heroku) and select what port they have told us to use
//if no define environment variable use port 5000 as default
const PORT = process.env.PORT || 5000;
app.listen(PORT);
