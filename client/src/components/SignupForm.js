import React from 'react';
import validator from 'validator';
import { FormErrors } from './partials';

import {
  Button,
  Input,
  ButtonInput
} from 'react-bootstrap';

import { AppActions } from '../actions/AppActions';
import { AppStore } from '../stores/AppStore';

export class SignupForm extends React.Component {

  constructor() {
    super();
    this.state = {
      ...AppStore.getState(),
      username: '',
      password: '',
      email: ''
    };
    this.onChange = this.onChange.bind(this);
  }
  componentDidMount() {
    AppStore.listen(this.onChange);
  }
  componentWillUnmount() {
    AppStore.unlisten(this.onChange);
  }
  onChange(state) {
    this.setState(state);
  }
  clearState = () => {
    this.setState({
      username: '',
      password: '',
      email: ''
    });
  };

  handleUsernameChange = (e => this.onChange(
      {username: e.target.value})
  );
  handlePasswordChange = (e => this.onChange(
      {password: e.target.value})
  );
  handleEmailChange = (e => this.onChange(
      {email: e.target.value})
  );


  componentWillMount() {
    window.ga('send', 'pageview', window.location.pathname);
  }

  validate = () => {
    var errors = [];
    var { username,
          password,
          email
          } = this.state;
    const rules = [
      {
        failOn: !validator.isEmail(email),
        error: 'Please use a valid email address'
      },
      {
        failOn: username.trim().length < 4,
        error: 'Username must be at least 4 characters'
      },
      {
        failOn: password.trim().length < 5,
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
    e.preventDefault();


    var valid = this.validate();
    if (valid.errors) {

      let article = valid.errors.length > 1 ? 'are' : 'is';
      let noun = valid.errors.length > 1 ? 'errors' : 'error';
      let count = valid.errors.length > 1 ? valid.errors.length : 'one';

      this.setState({
        error: {
          message: `There ${article} ${count} ${noun},  please try again.`,
          data: valid.errors
        }
      });
      return;
    }

    AppActions.signup({
      username: this.state.username,
      password: this.state.password,
      email: this.state.email
    });

  };

  render() {
    // handlers
    let {
          handleSubmit,
          handleUsernameChange,
          handlePasswordChange,
          handleEmailChange
          } = this;
    // state
    let {
          error,
          username,
          password,
          email
          } = this.state;

    return (
      <section>
        {error ? <FormErrors {...error} /> : ''}
        <form onSubmit={handleSubmit}>
          <h4>Create an Account</h4>
          <hr/>
          <Input disabled={this.state.signupPending}
                 type="text"
                 label="Username"
                 value={username}
                 onChange={handleUsernameChange}
                 placeholder="Enter a username" />
          <Input disabled={this.state.signupPending}
                 type="email"
                 label="Email Address"
                 value={email}
                 onChange={handleEmailChange}
                 placeholder="Enter email" />
          <Input disabled={this.state.signupPending}
                 type="password"
                 value={password}
                 onChange={handlePasswordChange}
                 label="Password" />
          {this.state.signupPending ?
            <Button disabled>Signing up...</Button> :
            <ButtonInput bsStyle="primary"
                         type="submit"
                         value="Signup" />
          }
        </form>
      </section>
    );
  }
}
