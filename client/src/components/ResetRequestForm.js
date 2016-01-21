import React from 'react';

import { Link } from 'react-router';

import {
  Input,
  ButtonInput
} from 'react-bootstrap';

export class ResetRequestForm extends React.Component {

  constructor() {
    super();
    this.state = {
      email: '',
      emailSent: false
    };
  }

  handleInputChange = (e => this.setState(
      {email: e.target.value})
  );

  handleSubmit = (e) => {
    // let email = this.state.email;
    e.preventDefault();
    this.setState({
      emailSent: true
    });

  };

  render() {

    let { emailSent, email } = this.state;

    if (emailSent) {
      return (
        <div style={{padding: '2em'}}>
          <p>
            A link to reset your password has been sent to&nbsp;
            <strong>{email}</strong>.
            Make sure to check your spam folder in case you do not see it.
          </p>

          <p><Link
            ref="homeLink"
            to="/">Back to home</Link></p>
        </div>
      );
    } else {
      return (
        <form onSubmit={this.handleSubmit}>
          <fieldset>
            <legend>
              Reset Password
            </legend>
            <p>
              <span>Enter your email address below and</span>
              <span>&nbsp;we will send you a link to reset your password</span>
            </p>
            <Input
              required
              type="email"
              onChange={this.handleInputChange}
              value={email}
              placeholder="Email address"/>
            <ButtonInput bsStyle="primary" type="submit">
              Send reset link
            </ButtonInput>
          </fieldset>
        </form>
      );
    }
  }

}


