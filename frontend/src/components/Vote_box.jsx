import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from 'apollo-boost';
import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';
import gql from 'graphql-tag';
import '../App.css';

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

class VoteBox extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      username: props.challengeSide.user.username,
      userId: props.challengeSide.user.id,
      challengeId: props.challengeId,
      content: props.challengeSide.input.content,
      nbVotes: props.challengeSide.numberVotes,
      voted: props.voted,
    };
    this.vote = this.vote.bind(this);
  }

  vote() {
    client.mutate({
      mutation: gql`
        mutation {
          vote (challengeId: "${this.state.challengeId}", supporterId: "${this.state.userId}") {
            challenger {
              user {
                id
              },
              numberVotes
            }
            challenged {
              user {
                id
              },
              numberVotes
            }
          }
        }
      `,
      }).then((response) => {
        this.setState({ voted: true });
        if (response.data.vote.challenged.user.id === this.state.userId) {
          this.setState({ nbVotes: response.data.vote.challenged.numberVotes });
        } else if (response.vote.data.challenger.user.id === this.state.userId) {
          this.setState({ nbVotes: response.data.vote.challenger.numberVotes });
        }
      }).catch((error) => {
        this.setState({ error });
      });
  }

  render() {
    return (
      <div>
        <center>
          <div className="vote-box">
            <div>
              <button className="add-button" type="button" onClick={this.vote}>&#x1f44d;</button>
              { this.state.voted ? (
                <div>
                  VOTED !
                </div>
              ) : <>
                </>
              }
            </div>
            <div>
              <strong>{this.state.nbVotes}</strong> <span className="details">votes</span>
            </div>
            <div>
              <h2><em>{this.state.content}</em></h2>
              <b className="vote-box-username">{this.state.username}</b>
            </div>
            { this.state.error ? (
              <Alert bsStyle="danger">
                {this.state.error}
              </Alert>
              ) : <>
              </>
            }
          </div>
        </center>
      </div>
    );
  }
}

export default VoteBox;
