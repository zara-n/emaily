## **Node.js & Express**

### 101

Initiate root/startup file e.g. *index.js*

`const express = require("express");`

`const app = express();`

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

### Deployment

**Create account**

**Commit our codebase to git**



