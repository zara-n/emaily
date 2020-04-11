const keys = require("../config/keys");
const stripe = require("stripe")(keys.stripeSecretKey); //https://stripe.com/docs/api/charges/create
const requireLogin = require("../middlewares/requireLogin");

module.exports = app => {
  app.post("/api/stripe", requireLogin, async (req, res) => {
    const charge = await stripe.charges.create({
      amount: 500,
      currency: "usd",
      source: req.body.id,
      description: "$5 for 5 credits"
    });

    req.user.credits += 5; //req.user is assigned by passport
    const user = await req.user.save();
    res.send(user); //communicating back to the browser, sending updated user
  });
};
