/*
 *  React
 */
import React from 'react';
import { render } from 'react-dom';

/*
 *  React-Router
 */
import {
  browserHistory,
  IndexRoute,
  Route
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
  Article,
  ArticleList,
  Home,
  NoMatch,
  Page,
  Login,
  SignUp,
  Tag,
  TagList,
  Dashboard
} from './containers';




render((
  <RelayRouter history={browserHistory}>
    <Route
      path="/"
      component={Layout}>
      <IndexRoute component={Home} />
      <Route path="/" component={Home}/>
      <Route path="/users" component={Dashboard}>
        <Route
          component={Dashboard}
          path=":id"
          queries={{
            id: () => Relay.QL`query { userById(id: $id) }`
          }} />
      </Route>
      <Route path="/dashboard"
             component={Dashboard}/>
      <Route path="/login" component={Login}/>
      <Route path="/signup" component={SignUp}/>
      <Route path="/page/:id" component={Page}/>
      <Route path="articles" component={ArticleList} />
      <Route path="/articles/:id" component={Article}/>
      <Route path="tags" component={TagList}/>
      <Route path="/tags/:id" component={Tag}/>
      <Route path="*" component={NoMatch}/>
    </Route >
  </RelayRouter>
), document.getElementById('main'));
