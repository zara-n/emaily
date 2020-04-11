const proxy = require("http-proxy-middleware");

//only works in development
//forwards the request from the react server to the express server
//the create-react server does not exist in production/heroku
//anything that has the route api or /auth/google will be forwarded to the express api in dev mode

module.exports = function(app) {
    app.use(proxy(['/api', '/auth/google'], { target: 'http://localhost:5000' }));
}