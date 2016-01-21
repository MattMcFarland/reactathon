import React from 'react';
import Relay from 'react-relay';
import moment from 'moment';

import {
  Col,
  Row,
  // Panel,
  Button,
  Input,
  Thumbnail,
  ButtonInput
} from 'react-bootstrap';


const UserCard = ({
  displayName,
  location,
  pictureUrl,
  username,
  website,
  dateCreated
}) => (
  <div>
    <h3>Hello, {displayName}!</h3>
    <Thumbnail style={{backgroundColor: 'white' }}src={pictureUrl}>
      <p>Joined {moment(dateCreated).fromNow()}</p>
      <p>{username ? username : ''}</p>
      <p>
      {location}
      </p>
      <p>
        <a href={website}>{website}</a>
      </p>
    </Thumbnail>
  </div>
);


class DashboardComponent extends React.Component {
  constructor(props) {
    console.log(props);

    super(props);
  }


  onLinkFacebook = () => (window.location.href = '/auth/facebook');

  onLinkGithub = () => (window.location.href = '/auth/github');

  onLinkReddit = () => (window.location.href = '/auth/reddit');

  onLinkGoogle = () => (window.location.href = '/auth/google');

  onLinkTwitter = () => (window.location.href = '/auth/twitter');

  onUnlinkFacebook = () => (window.location.href = '/auth/unlink/facebook');

  onUnlinkGithub = () => (window.location.href = '/auth/unlink/github');

  onUnlinkReddit = () => (window.location.href = '/auth/unlink/reddit');

  onUnlinkGoogle = () => (window.location.href = '/auth/unlink/google');

  onUnlinkTwitter = () => (window.location.href = '/auth/unlink/twitter');

  render() {

    // Store
    let {
      website,
      email,
      username,
      github,
      google,
      twitter,
      facebook,
      reddit
      } = this.props.viewer.user;

    return (
      <section>

        <Row>
          <Col xs={12} sm={6} md={5} lg={4}>

            <UserCard {...this.props.viewer.user} />

          </Col>

          <Col xs={12} sm={6} md={7} lg={8}>
            <form style={{marginTop: '54px'}}>
              <label>Username</label>
              <Input type="text" readOnly value={username}/>
              <label>Email</label>
              <Input type="email" readOnly value={email}/>
              <label>Website</label>
              <Input type="url" readOnly value={website}/>
              <fieldset>
                <legend>Providers</legend>
                <label>Facebook</label>
                <ButtonInput
                  onClick={facebook ?
                  this.onUnlinkFacebook :
                  this.onLinkFacebook}>
                  {facebook ? 'Unlink' : 'link'}
                </ButtonInput>
                <label>Reddit</label>
                <ButtonInput
                  onClick={reddit ?
                  this.onUnlinkReddit :
                  this.onLinkReddit}>
                  {reddit ? 'Unlink' : 'link'}
                </ButtonInput>
                <label>Github</label>
                <ButtonInput
                  onClick={github ?
                  this.onUnlinkGithub :
                  this.onLinkGithub}>
                  {github ? 'Unlink' : 'link'}
                </ButtonInput>
                <label>Google</label>
                <ButtonInput
                  onClick={google ?
                  this.onUnlinkGoogle :
                  this.onLinkGoogle}>
                  {google ? 'Unlink' : 'link'}
                </ButtonInput>
                <label>Twitter</label>
                <ButtonInput
                  onClick={twitter ?
                  this.onUnlinkTwitter :
                  this.onLinkTwitter}>
                  {twitter ? 'Unlink' : 'link'}
                </ButtonInput>
              </fieldset>
              <Button bsStyle="success">Edit Profile</Button>
            </form>
          </Col>
        </Row>

      </section>
    );
  }
}

export const Dashboard = Relay.createContainer(DashboardComponent, {
  initialVariables: {
    id: localStorage.getItem('user')
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on GraphAPI {
        user(id: $id) {
          displayName,
          dateCreated,
          username,
          email,
          location,
          website,
          pictureUrl,
          github
          google
          twitter
          facebook
          reddit
        }
      }
    `
  }
});
