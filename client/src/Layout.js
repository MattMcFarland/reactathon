import React from 'react';
import { Link } from 'react-router';
import {
  Navbar,
  Nav,
  MenuItem,
  Modal,
  Button,
  NavDropdown
} from 'react-bootstrap';
import { SignupForm, LoginForm } from './components';
import { Logo } from './components/partials/Elements';
import { AppActions } from './actions/AppActions';
import { AppStore } from './stores/AppStore';
import NotificationSystem from 'react-notification-system';

const Content = ({children}) => (
  <div>{children}</div>
);

export class Layout extends React.Component {

  constructor() {
    super();
    this.state = {
      ...AppStore.getState()
    };
    this._notificationSystem = null;
    this.onChange = this.onChange.bind(this);
  }
  componentDidMount() {
    AppStore.listen(this.onChange);
    this._notificationSystem = this.refs.notificationSystem;
  }
  componentWillUnmount() {
    AppStore.unlisten(this.onChange);
  }
  addNotification = (queue) => {
    let message = queue.slice(0, 1);
    this._notificationSystem.addNotification(message[0]);
  };
  onChange(state) {
    if (state.queue && state.queue.length) {
      setTimeout(this.addNotification(state.queue), 100);
    }
    this.setState(state);
  }

  render() {

    var Menu;

    var name = this.props.location.pathname;
    let { showSignupModal, showLoginModal } = this.state;


    let onShowSignupForm = () => (AppActions.showSignupModal());
    let onShowLoginForm = () => (AppActions.showLoginModal());
    let onHideSignupForm = () => (AppActions.hideSignupModal());
    let onHideLoginForm = () => (AppActions.hideLoginModal());
    let logout = (e) => {
      e.preventDefault();
      AppActions.logout();
    };
    let gotoDashboard = (e) => {
      e.preventDefault();
      this.props.history.push('/dashboard');
    };
    let gotoAddNewArticle = (e) => {
      e.preventDefault();
      this.props.history.push('/add-article');
    };
    if (this.state.user) {
      Menu = ({}) => (
        <Nav pullRight style={{marginTop: '5px'}}>
          <NavDropdown eventKey={2} title='Create' id='create-dropdown'>
            <MenuItem onClick={gotoAddNewArticle} eventKey={2.1}>
              Add New Article
            </MenuItem>
          </NavDropdown>
          <NavDropdown eventKey={3} title='Account' id='user-dropdown'>
            <MenuItem onClick={gotoDashboard} eventKey={3.1}>
              Dashboard
            </MenuItem>
            <MenuItem divider />
            <MenuItem onClick={logout} eventKey={3.2}>Logout</MenuItem>
          </NavDropdown>


        </Nav>
      );

    } else {

      Menu = ({}) => (
        <Nav pullRight style={{marginTop: '5px'}}>
          <Button bsStyle='link' onClick={onShowSignupForm}>
            Create Account
          </Button>
          <Button bsStyle='link' onClick={onShowLoginForm}>
            Login
          </Button>
        </Nav>
      );
    }




    return (
      <section>
        <Navbar inverse>
          <Navbar.Header>
            <Navbar.Brand>
              <Link
                style={{paddingTop: '21px'}}
                to='/'>
                <Logo />
              </Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <Navbar.Text>
                <Link
                  activeClassName='active'
                  className='nav-item nav-link btn btn-link'
                  to='/page/about'>About</Link>
              </Navbar.Text>
              <Navbar.Text>
                <Link
                  activeClassName='active'
                  className='nav-item nav-link btn btn-link'
                  to='/articles'>Articles</Link>
              </Navbar.Text>
            </Nav>
            <Menu/>
          </Navbar.Collapse>
        </Navbar>
        <section className='container'>
          <Content key={name}>
            {this.props.children}
          </Content>
        </section>
        {showSignupModal ?
          <Modal
            show={showSignupModal}
            onHide={onHideSignupForm}>
            <Modal.Header closeButton>
              <Modal.Title>Signup</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <SignupForm />
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={onHideSignupForm}>
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>
          : ''}

        {showLoginModal ?
          <Modal
            show={showLoginModal}
            onHide={onHideLoginForm}>
            <Modal.Header closeButton>
              <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <LoginForm />
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={onHideLoginForm}>
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>
          : ''}

        <NotificationSystem ref='notificationSystem' />
      </section>
    );
  }
}

Layout.contextTypes = {
  router: React.PropTypes.object.isRequired
};
