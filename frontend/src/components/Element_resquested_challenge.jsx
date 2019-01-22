import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import gql from 'graphql-tag';
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from 'apollo-boost';

const { BACKEND_URL } = require('../config.js');

const httpLink = new HttpLink({ uri: BACKEND_URL });
console.log(httpLink);
const authLink = new ApolloLink((operation, forward) => {
    const token = localStorage.getItem('userToken');

    // Use the setContext method to set the HTTP headers.
    operation.setContext({
    headers: {
        authorization: token ? `Bearer ${token}` : '',
    },
});
// Call the next link in the middleware chain.
return forward(operation);
});

const client = new ApolloClient({
    link: authLink.concat(httpLink), // Chain it with the HttpLink
    cache: new InMemoryCache(),
});

class RequestedChall extends Component {
  constructor(props) {
    super(props);
    this.rejectChall = this.rejectChall.bind(this);
    this.acceptChall = this.acceptChall.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  rejectChall() {
    client
    .mutate({
        mutation: gql`
        mutation {
          rejectChallenge(challengeId: "${this.props.challengeId}") {
            id
          }
        }
        `,
    }).then((response) => {
        console.log('Successfully rejected! ', response);
    }).catch((err) => {
        console.log('Rejection problem ', err);
    });
    console.log('rejected');
  }

  // eslint-disable-next-line class-methods-use-this
  acceptChall() {
    console.log('accepted');
  }

  render() {
    return (
      <div>
        {this.props.challenger} challenged you!
        <Button onClick={this.acceptChall}>Accept</Button>
        <Button onClick={this.rejectChall}>Reject</Button>
      </div>
    );
  }
}

RequestedChall.propTypes = {
  challenger: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired,
  format: PropTypes.string.isRequired,
  uploadTime: PropTypes.string.isRequired,
  challengeId: PropTypes.string.isRequired,
  // date: PropTypes.string.isRequired,
};


export default RequestedChall;
