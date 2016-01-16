import alt from '../alt';
import { AppActions } from '../actions/AppActions';


class AppStoreSpec {
  constructor() {
    this.bindActions(AppActions);
    var userEl = document.getElementById('user');
    this.user = userEl ? JSON.parse(userEl.innerHTML) : null;
    localStorage.setItem('user', this.user);
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

  onSignupPending = () => {
    localStorage.removeItem('user');
    this.signupPending = true;
  };

  onSignupSuccess(user) {
    this.user = user.id.toString();
    localStorage.setItem('user', this.user);
    this.signupPending = false;
    this.showSignupModal = false;
    window.location.href = '/dashboard';
  }
  onSignupFail() {
    this.signupPending = false;
    localStorage.removeItem('user');
  }


  onLoginPending = () => {
    localStorage.removeItem('user');
    this.loginPending = true;
  };

  onLoginSuccess(user) {
    this.user = user.id.toString();
    localStorage.setItem('user', this.user);
    this.loginPending = false;
    this.showLoginModal = false;
  }
  onLoginFail() {
    this.loginPending = false;
    localStorage.removeItem('user');
  }
  onLogoutPending = () => (this.logoutPending = true);

  onLogoutSuccess() {
    this.user = null;
    localStorage.removeItem('user');
    this.logoutPending = false;
    window.location.href = '/';
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
