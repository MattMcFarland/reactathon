import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import moment from 'moment';


const ArticleListItem = ({
  author,
  dateCreated,
  title,
  content,
  url
}) => (
  <section>
    <header>
      {author.username} posted an article
      <Link to={url}>{moment(dateCreated).fromNow()}.</Link>
    </header>
    <h5>{title}</h5>
    <p>{content}</p>
  </section>
);

class ArticleListComponent extends React.Component {

  renderList = () => {
    return this.props.viewer.articles.edges.map(edge =>
      <ArticleListItem key={edge.node.id} {...edge.node} />
    );
  };
  loadNextPage = () => {
    // Increments the number of articles being rendered by 5.
    this.props.relay.setVariables({
      count: this.props.relay.variables.count + 5
    });
  };
  render() {
    var hasNextPage = this.props.viewer.articles.pageInfo.hasNextPage;
    return (
      <section>
        <div>{this.renderList()}</div>
        {hasNextPage ?
          <button onClick={this.loadNextPage}>Load More</button> : ''}
      </section>

    );
  }

}



export const ArticleList = Relay.createContainer(ArticleListComponent, {
  initialVariables: {
    count: 5
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on GraphAPI {
        articles(first: $count) {
          pageInfo {
            hasNextPage
          }
          edges {
            node {
              id
              url
              author {
                username
              }
              dateCreated
              content
              title
            }
          }
        }
      }
    `
  }
});
