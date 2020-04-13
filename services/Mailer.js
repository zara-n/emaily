const sendgrid = require("sendgrid");
const helper = sendgrid.mail;
const keys = require("../config/keys");

//extendending the Mail class provided by the sendgrid lirbary
//and customising it
class Mailer extends helper.Mail {
  constructor({ subject, recipients }, content) {
    super(); //calls any constructor that is in Mail class

    //sendgrid specific set up
    this.sgApi = sendgrid(keys.sendGridKey);
    this.from_email = new helper.Email("kfuruzon@gmail.com");
    this.subject = subject;
    this.body = new helper.Content("text/html", content);
    this.recipients = this.formatAddresses(recipients);

    //addContent is an inbuilt Mail function
    //it expects to be called with the desired body of the email
    this.addContent(this.body);

    this.addClickTracking();
    this.addRecipients();
  }

  //formats the recipients array of objects with emails in them using the sendgrip helper
  formatAddresses(recipients) {
    return recipients.map(({ email }) => {
      return new helper.Email(email);
    });
  }

  addClickTracking() {
    //sendgrid specific set up for click tracking
    //to enable sendgrids click tracking (for checking if specific user has clicked the email link)
    const trackingSettings = new helper.TrackingSettings();
    const clickTracking = new helper.ClickTracking(true, true);
    
    trackingSettings.setClickTracking(clickTracking);
    this.addTrackingSettings(trackingSettings);
  }

  addRecipients() {
    //sendgrid specific set up
    const personalize = new helper.Personalization();
    this.recipients.forEach(recipient => {
      personalize.addTo(recipient);
    });
    this.addPersonalization(personalize);
  }

  //sending it off to Sendgrid
  async send() {
    const request = this.sgApi.emptyRequest({
      method: "POST",
      path: "/v3/mail/send",
      body: this.toJSON() //defined by Mail base class
    });
    const response = await this.sgApi.API(request);
    return response;
  }
}
module.exports = Mailer;
