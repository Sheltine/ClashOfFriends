/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import Select from 'react-select';

const { backendURL } = require('../config.js');

const client = new ApolloClient({
  uri: backendURL,
});

const options = [];

class ChallengeForm extends Component {
    constructor(props) {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user !== null) {
            user.following.map(following => (
                options.push({ value: `${following.username}`, label: `${following.username}` })
            ));
        }

        console.log('options: ', options);
        super(props);
        this.state = {
            file: '',
            challenger: '',
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleUserSelect = this.handleUserSelect.bind(this);
  }

    handleUserSelect(event) {
        this.setState({
            challenger: event.value,
        });
        console.log('Option selected:', this.state.challenger);
      }

    // will send data to server
    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.file,
        });
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = (a) => {
            console.log('file', a.target.result);
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
        <p>Find your friend</p>
        <Select
          onChange={this.handleUserSelect}
          options={options}
        />
        <h3>Your challenger: {this.state.challenger}</h3>
        <input name="file" type="file" value={this.state.file} onChange={e => this.handleInputChange(e)} />
      </div>
    );
  }
}

ChallengeForm.propTypes = {
    category: PropTypes.string.isRequired,
};

export default ChallengeForm;
