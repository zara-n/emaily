const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const requireCredits = require("../middlewares/requireCredits");
const Mailer = require("../services/Mailer");
const surveyTemplate = require("../services/emailTemplates/surveyTemplate");
const _ = require("lodash");
const { Path } = require("path-parser");
const { URL } = require("url"); //integrated module in nodes - https://www.w3schools.com/nodejs/nodejs_url.asp

const Survey = mongoose.model("surveys");

module.exports = app => {
  app.get("/api/surveys", requireLogin, async (req, res) => {
    const surveys = await Survey.find({ _user: req.user.id }).select({
      recipients: false
    });
    res.send(surveys);
  });

  app.get("/api/surveys/:surveyId/:choice", (req, res) => {
    res.send("Thank you for voting");
  });

  //sendgrid sends bundled up request to our server (once every 30 seconds or so)
  app.post("/api/surveys/webhooks", (req, res) => {
    const p = new Path("/api/surveys/:surveyId/:choice"); //extracting the two pieces of necessary data in the path and assigning them a variable

    _.chain(req.body) //lodash chainer
      .map(({ email, url }) => {
        const match = p.test(new URL(url).pathname); //extracts the two variables from the url provided in req.body.url
        if (match) {
          //if match exists
          return { email, surveyId: match.surveyId, choice: match.choice }; //return an array with an object that contains req.body.email, the extracted surveyID & choice from the URL
        }
      })
      .compact() //removing any undefined/null elements
      .uniqBy("email", "surveyId") //removing duplicates
      .each(({ surveyId, email, choice }) => {
        //finds a record in mongoDB surveys that matches criteria, and then updates it.
        Survey.updateOne(
          {
            _id: surveyId, //has to be _id in Mongo queries
            recipients: {
              //$elemMatch is a mongo operator that checks for matches
              $elemMatch: { email: email, responded: false }
            }
          },
          {
            //$inc is a mongo operator, that increments the property
            $inc: { [choice]: 1 },
            $set: { "recipients.$.responded": true }, //set recipient's property responded to true
            lastResponded: new Date()
          }
        ).exec(); //executes query
      })
      .value(); //returning final value

    res.send({}); //we do not need to send anything back to SendGrid. No async handlers
  });

  app.post("/api/surveys", requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;

    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(",").map(email => ({ email: email.trim() })),
      _user: req.user.id,
      dateSent: Date.now()
    });

    //send an email
    const mailer = new Mailer(survey, surveyTemplate(survey));

    try {
      await mailer.send();
      await survey.save();
      req.user.credits -= 1; //deducting credit
      const user = await req.user.save();

      //sending updated user model for dynamic updates
      res.send(user);
    } catch (err) {
      res.status(422).send(err);
    }
  });
};
