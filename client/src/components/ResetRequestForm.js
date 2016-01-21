import React from 'react';
import ajax from 'superagent';
import { Link } from 'react-router';

import {
  Input,
  ButtonInput
} from 'react-bootstrap';

export class ResetRequestForm extends React.Component {

  constructor() {
    super();
    this.state = {
      pending: false,
      email: '',
      emailSent: false,
    };
  }

  handleInputChange = (e => this.setState(
      {email: e.target.value})
  );

  handleSubmit = (e) => {
    let email = this.state.email;
    e.preventDefault();
    this.setState({
      pending: true
    });
    if (this.state.emailSent) {
      return;
    }
    ajax.post('/api/forgot')
        .send({email})
        .end((err, res) => {
          this.setState({
            emailSent: true
          });
          console.info(err, res);
        });

  };

  render() {

    let { emailSent, email, pending } = this.state;

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
            <ButtonInput
              disabled={pending}
              bsStyle="primary"
              type="submit">
              Send reset link
            </ButtonInput>
          </fieldset>
        </form>
      );
    }
  }

}


