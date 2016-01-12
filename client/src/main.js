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
  ArticleList,
  Page,
  TagList,
  NoMatch
} from './containers';

/*
const CardQueries = {
  cards: () => Relay.QL`query { store }`
};
*/

render((
  <RelayRouter history={browserHistory}>
    <Route path="/" component={Layout}>
      <IndexRoute component={Home} />
      <Route path="/" component={Home}/>
      <Route path="/page/:id" component={Page}/>
      <Route path="articles" component={ArticleList} />
      <Route path="/articles/:id" component={Article}/>
      <Route path="tags" component={TagList}/>
      <Route path="/tags/:id" component={Tag}/>
      <Route path="*" component={NoMatch}/>
    </Route>
  </RelayRouter>
), document.getElementById('main'));
