import React from 'react';
import { FormErrors } from './partials';
import {
  Button,
  Input,
  ButtonInput
} from 'react-bootstrap';

import { AppActions } from '../actions/AppActions';
import { AppStore } from '../stores/AppStore';

export class AddNewArticleForm extends React.Component {

  constructor() {
    super();
    this.state = {
      ...AppStore.getState(),
      title: '',
      content: ''
    };
    this.onChange = this.onChange.bind(this);
  }
  componentDidMount() {
    AppStore.listen(this.onChange);
  }
  componentWillUnmount() {
    AppStore.unlisten(this.onChange);
  }
  onChange(state) {
    this.setState(state);
  }



  handleTitleChange = (e => this.onChange(
      {title: e.target.value})
  );
  handleContentChange = (e => this.onChange(
      {content: e.target.value})
  );


  validate = () => {
    var errors = [];
    var { title,
      content
      } = this.state;
    const rules = [
      {
        failOn: title.trim().length < 10,
        error: 'Title must be at least 10 characters'
      },
      {
        failOn: content.trim().length < 30,
        error: 'Content must be at least 30 characters'
      }
    ];

    rules.forEach((rule) => {

      if (rule.failOn) {
        errors.push(rule);
      }
    });

    if (errors.length) {
      return {
        errors: errors,
        valid: false
      };
    } else {
      return {
        errors: null,
        valid: true
      };
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();


    var valid = this.validate();
    if (valid.errors) {

      let article = valid.errors.length > 1 ? 'are' : 'is';
      let noun = valid.errors.length > 1 ? 'errors' : 'error';
      let count = valid.errors.length > 1 ? valid.errors.length : 'one';

      this.setState({
        error: {
          message: `There ${article} ${count} ${noun},  please try again.`,
          data: valid.errors
        }
      });
      return;
    }

    AppActions.addArticle({
      title: this.state.title,
      content: this.state.content
    });

  };

  render() {
    // handlers
    let {
      handleSubmit,
      handleTitleChange,
      handleContentChange
      } = this;
    // state
    let {
      error,
      title,
      content
      } = this.state;

    return (
      <section>
        {error ? <FormErrors {...error} /> : ''}
        <form onSubmit={handleSubmit}>
          <h4>Create new Article</h4>
          <hr/>
          <Input disabled={this.state.addArticlePending}
                 type="text"
                 label="Title"
                 value={title}
                 onChange={handleTitleChange}
                 placeholder="Enter a title" />
          <Input disabled={this.state.addArticlePending}
                 type="textarea"
                 value={content}
                 onChange={handleContentChange}
                 label="Content" />
          {this.state.addArticlePending ?
            <Button disabled>Saving...</Button> :
            <ButtonInput bsStyle="success"
                         type="submit"
                         value="Save" />

          }

        </form>
      </section>
    );
  }
}
