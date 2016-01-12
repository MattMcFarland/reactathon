import React from 'react';
import ajax from 'superagent';
import marked from 'marked';

export class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    ajax.get('/api/page/' + props.params.id, (err, res) => {
      if (err || !res) {
        this.setState({errorPage: true});
      } else {
        try {
          let data = marked(res.text.toString(), {sanitize: true});
          this.setState({ data });
        } catch (e) {
          this.setState({errorPage: true});
        }
      }
    });
  }

  render() {
    if (this.state.errorPage) {
      return (
        <article>
        <h3>Not Found</h3>
        <p>Sorry, the page requested was not found</p>
        </article>
      );
    } else {
      return (
        <article dangerouslySetInnerHTML = {{ __html: this.state.data }}>
        </article>
      );
    }
  }
}
