import React from 'react';
import Relay from 'react-relay';
import moment from 'moment';


class ArticleComponent extends React.Component {

  render() {

    var {
      author,
      title,
      content,
      dateCreated } = this.props.article;

    console.log(this.props);

    return (
      <article>
        <header>
          <h2>{title}</h2>
          <em>by {author.username} - {moment(dateCreated).fromNow()}.</em>
        </header>
        <p>
          {content}
        </p>
      </article>
    );
  }
}


export const Article = Relay.createContainer(ArticleComponent, {
  fragments: {
    article: () => Relay.QL`
      fragment on Article {
        author {
          username
        }
        title
        content
        dateCreated
      }
    `
  }
});
