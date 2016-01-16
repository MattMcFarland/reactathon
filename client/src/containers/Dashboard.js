import React from 'react';
import Relay from 'react-relay';
import moment from 'moment';

import {
  Col,
  Row,
  // Panel,
  Button,
  Input,
  Thumbnail
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

  render() {

    // TODO: Add oAuth Provider link/unlink feature

    let {
      website,
      email,
      username } = this.props.viewer.user;


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
    id: '1'
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
          pictureUrl
          github
        }
      }
    `
  }
});
