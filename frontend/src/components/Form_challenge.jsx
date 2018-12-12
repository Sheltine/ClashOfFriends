/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { post } from 'axios';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';

const serverUrl = 'http://localhost:4000';
const client = new ApolloClient({
  uri: serverUrl,
});

class ChallengeForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: '',
        };

        this.handleInputChange = this.handleInputChange.bind(this);
  }

    // eslint-disable-next-line class-methods-use-this
    onError(e) {
        console.log(e, 'error in file-viewer');
      }

    // will send data to server
    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.file,
        });
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        console.log('test: ', e.target.result);
        reader.onload = (a) => {
            client
                .query({
                    query: gql`
                    {
                        file(type:"png", file:"${a.target.result}")
                    }
                    `,
                })
                .then(result => console.log(result));
            };
        // console.log(formData);
        // envoyer ça différemment
    }

// check https://www.npmjs.com/package/react-file-viewer/v/0.4.1 for fileviewer
  render() {
    return (
      <div>
        <h1>{this.props.category} Challenge</h1>
        <input name="file" type="file" value={this.state.file} onChange={e => this.handleInputChange(e)} />
      </div>
    );
  }
}

ChallengeForm.propTypes = {
    category: PropTypes.string.isRequired,
};

export default ChallengeForm;
