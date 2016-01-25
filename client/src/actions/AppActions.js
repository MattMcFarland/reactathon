import alt from '../alt';
import ajax from 'superagent';

class AppActionsSpec {
  constructor() {
    this.generateActions(
      'signupPending',
      'signupSuccess',
      'signupFail',

      'loginPending',
      'loginSuccess',
      'loginFail',

      'logoutPending',
      'logoutSuccess',
      'logoutFail',

      'addArticlePending',
      'addArticleSuccess',
      'addArticleFail',


      'requestNewPassword',

      'showSignupModal',
      'hideSignupModal',
      'showLoginModal',
      'hideLoginModal',

      'pushQueue',
      'shiftQueue'

    );
  }

  logout() {
    ajax.post('/api/logout')
      .end((err, res) => {
        if (!err) {
          if (res && res.body) {
            this.actions.pushQueue({
              level: 'success',
              title: 'Goodbye!',
              message: 'You are now logged out!'
            });
            this.actions.shiftQueue();
            this.actions.logoutFail();
            this.actions.logoutSuccess(res.body.user);
          } else {
            this.actions.pushQueue({
              level: 'error',
              title: 'Oh snap!',
              message: 'Something bad happened!'
            });
            this.actions.shiftQueue();
            this.actions.logoutFail();
          }
        } else {
          this.actions.logoutFail(err);
        }
      });
    this.actions.logoutPending();
  }
  login({username, password}) {
      ajax.post('/api/login')
        .send({
          username,
          password
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .end((err, res) => {
          if (!err) {
            if (res && res.body && res.body.user) {
              this.actions.pushQueue({
                level: 'success',
                title: 'Success!',
                message: 'You are now logged in!'
              });
              this.actions.shiftQueue();
              this.actions.loginFail();
              this.actions.loginSuccess(res.body.user);
            } else {
              this.actions.pushQueue({
                level: 'error',
                title: 'Oh snap!',
                message: 'Something bad happened!'
              });
              this.actions.shiftQueue();
              this.actions.loginFail();
            }
          } else {
            this.actions.loginFail(err);
          }
        });
    this.actions.loginPending();
  }

  addArticle({title, content}) {
    ajax.post('/api/add-article')
      .send({
        title,
        content
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (!err) {
          if (res && res.body && res.body.user) {
            this.actions.pushQueue({
              level: 'success',
              title: 'Success!',
              message: 'Your article has been created!'
            });
            this.actions.shiftQueue();
            this.actions.addArticleFail();
            this.actions.addArticleSuccess(res.body.user);
          } else {
            this.actions.pushQueue({
              level: 'error',
              title: 'Oh snap!',
              message: 'Something bad happened!'
            });
            this.actions.shiftQueue();
            this.actions.addArticleFail();
          }
        } else {
          this.actions.addArticleFail(err);
        }
      });
    this.actions.addArticlePending();
  }

  signup({username, password, email}) {
    ajax.post('/api/signup')
      .send({
        username,
        password,
        email
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (!err) {
          if (res && res.body && res.body.user) {
            this.actions.pushQueue({
              level: 'success',
              title: 'Success!',
              message: 'You are now logged in!'
            });
            this.actions.shiftQueue();
            this.actions.signupFail();
            this.actions.signupSuccess(res.body.user);
          } else {
            this.actions.pushQueue({
              level: 'error',
              title: 'Oh snap!',
              message: 'Something bad happened!'
            });
            this.actions.shiftQueue();
            this.actions.signupFail();
          }
        } else {
          this.actions.signupFail(err);
        }
      });
    this.actions.signupPending();
  }

  toast(options) {
    this.actions.pushQueue(options);
    this.actions.shiftQueue();
  }
}

export const AppActions = alt.createActions(AppActionsSpec);
