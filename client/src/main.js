/*
 *  React
 */
import React from 'react';
import { render } from 'react-dom';

/*
 *  React-Router
 */
import {
  IndexRoute,
  Route,
  browserHistory
} from 'react-router';

/*
 * Relay
 */
import Relay from 'react-relay';
import { RelayRouter } from 'react-router-relay';


/*
 * Layout
 */
import { Layout } from './Layout';


/*
 * Containers
 */

import {
  Home,
  Article,
  Page,
  Tags,
  NoMatch
} from './containers';


const CardQueries = {
  cards: () => Relay.QL`query { store }`
};


render((
  <RelayRouter history={browserHistory}>
    <Route path="/" component={Layout}>
      <IndexRoute component={Home} />
      <Route path="/" component={Home}/>
      <Route path="make" component={Proto}/>
      <Route
        path="list" component={List}
        queries={CardQueries}/>
      <Route path="/code/:id" component={Single}/>
      <Route path="*" component={NoMatch}/>
    </Route>
  </RelayRouter>
), document.getElementById('main'));
