import React from 'react';
import ajax from 'superagent';
import { Link } from 'react-router';
import { FormErrors } from './partials';
import { AppActions } from '../actions/AppActions';
import {
  Input,
  ButtonInput
} from 'react-bootstrap';

export class ResetPasswordForm extends React.Component {

  constructor() {
    super();
    this.state = {
      newPassword: '',
      processing: false,
      passwordReset: false,
      errors: []
    };
  }

  handleInputChange = (e => this.setState(
      {newPassword: e.target.value})
  );

  validate = () => {
    var errors = [];
    var { newPassword } = this.state;
    const rules = [
      {
        failOn: newPassword.trim().length < 5,
        error: 'Password must be at least 5 characters'
      }
    ];

    rules.forEach((rule) => {

      if (rule.failOn) {
        errors.push(rule);
      }
    });

    if (errors.length) {
      return {
        errors: errors,
        valid: false
      };
    } else {
      return {
        errors: null,
        valid: true
      };
    }
  };


  handleSubmit = (e) => {
    let newPassword = this.state.newPassword;
    e.preventDefault();

    var valid = this.validate();
    if (valid.errors) {

      let article = valid.errors.length > 1 ? 'are' : 'is';
      let noun = valid.errors.length > 1 ? 'errors' : 'error';
      let count = valid.errors.length > 1 ? valid.errors.length : 'one';

      this.setState({
        error: {
          processing: false,
          message: `There ${article} ${count} ${noun},  please try again.`,
          data: valid.errors
        }
      });
      return;
    }
    this.setState({
      processing: true
    });
    ajax.post('/api/reset')
      .send({password: newPassword})
      .end((err, res) => {
        if (err || res.text !== 'ok') {
          AppActions.toast({
            level: 'error',
            title: 'Server Error',
            message: 'Password reset token is invalid or has expired.'
          });
          this.context.router.push('/reset');
        }
        AppActions.toast({
          level: 'success',
          title: 'Success',
          message: 'Your password has been changed.'
        });
        this.setState({
          passwordReset: true
        });
      });
  };

  render() {

    let {
      processing,
      passwordReset,
      error,
      newPassword } = this.state;


    if (passwordReset) {
      return (
        <div style={{padding: '2em'}}>
          <p>
            Password successfully reset.
          </p>

          <p><Link
            to="/login">Go Login</Link></p>
        </div>
      );
    } else {
      return (
        <form onSubmit={this.handleSubmit}>
          {error ? <FormErrors {...error} /> : ''}
          <fieldset>
            <legend>
              Reset Password
            </legend>
            <p>
              <span>Enter a new password:</span>
            </p>
            <Input
              required
              type="password"
              onChange={this.handleInputChange}
              value={newPassword}
              placeholder="New Password"/>
            <ButtonInput
              disabled={processing}
              bsStyle="primary"
              type="submit">
              Change Password
            </ButtonInput>
          </fieldset>
        </form>
      );
    }
  }
}

ResetPasswordForm.contextTypes = {
  router: React.PropTypes.object.isRequired
};

