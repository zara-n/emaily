const passport = require("passport");

//GOOGLE STRATEGY HAS AN INTERNAL IDENTIFIER OF 'google'
//hence why passport knows the following 'google' mentioned in passport.authenticate is referring to GoogleStrategy
module.exports = app => {
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"] //we are asking for a user's profile & email
    })
  );

  //takes user request and sends it google with a code provided by above route handler
  //and requests details about the user
  app.get("/auth/google/callback", passport.authenticate("google"));

  app.get("/api/logout", (req, res) => {
    req.logout();
    res.send(req.user);
  });

  app.get("/api/current_user", (req, res) => {
    res.send(req.user);
  });
};
