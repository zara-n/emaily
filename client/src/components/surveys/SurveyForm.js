import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { Link } from "react-router-dom";
import SurveyField from "./SurveyField";
import validateEmails from "../../utils/validateEmails";
import formFields from "./formFields";

class SurveyForm extends Component {
  renderFields() {
    return formFields.map(({ label, name }) => {
      return (
        <Field component={SurveyField} label={label} name={name} type="text" />
      );
    });
  }

  render() {
    return (
      <div>
        <form
          onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}
        >
          {this.renderFields()}
          <Link to="/surveys" className="red btn-flat left white-text">
            Cancel
          </Link>
          <button className="teal btn-flat right white-text" type="submit">
            Next
            <i className="material-icons right">done</i>
          </button>
        </form>
      </div>
    );
  }
}

function validate(values) {
  const errors = {};

  //redux will automatically mathch up the errors to the fields rendered
  //assumoing  "meta" is passed prop to the child SurveyField component

  errors.recipients = validateEmails(values.recipients || "");

  formFields.forEach(({ name }) => {
    if (!values[name]) {
      errors[name] = "You must provide value";
    }
  });

  //will check if array returned by validateEmails has anything invalid inside
  //only cares about properties with values assigned to it, does not care about properties that have "undefined" assigned

  return errors; //if empty, redux form will be good to go and allow for a submit
}

export default reduxForm({
  validate,
  form: "surveyForm", //naming our form
  destroyOnUnmount: false //values not destroyed on dismount so we can go back in our form wizard
})(SurveyForm);
