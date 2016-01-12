import alt from '../alt';
import { AppActions } from '../actions/AppActions';


class AppStoreSpec {
  constructor() {
    this.bindActions(AppActions);
    var userEl = document.getElementById('user');
    this.user = userEl ? JSON.parse(userEl.innerHTML) : null;
    this.showSignupModal = false;
    this.showLoginModal = false;
    this.signupPending = false;
    this.queue = [];
  }

  onShowSignupModal() {
    this.setState({showSignupModal: true});
  }

  onHideSignupModal() {
    this.setState({showSignupModal: false});
  }

  onShowLoginModal() {
    this.setState({showLoginModal: true});
  }

  onHideLoginModal() {
    this.setState({showLoginModal: false});
  }

  onSignupPending = () => (this.signupPending = true);

  onSignupSuccess(user) {
    this.user = user;
    this.signupPending = false;
    this.showSignupModal = false;
  }
  onSignupFail() {
    this.signupPending = false;
  }

  onLoginPending = () => (this.loginPending = true);

  onLoginSuccess(user) {
    this.user = user;
    this.loginPending = false;
    this.showLoginModal = false;
  }
  onLoginFail() {
    this.loginPending = false;
  }
  onLogoutPending = () => (this.logoutPending = true);

  onLogoutSuccess() {
    this.user = null;
    this.logoutPending = false;
  }
  onLogoutFail() {
    this.logoutPending = false;
  }

  onPushQueue(options) {
    this.queue.push(options);
  }

  onShiftQueue() {
    this.queue.shift();
  }

}

export const AppStore =
               alt.createStore(AppStoreSpec, 'AppStore');
