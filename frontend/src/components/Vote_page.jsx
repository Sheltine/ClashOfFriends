import React, { Component } from 'react';
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from 'apollo-boost';
import { Query, ApolloProvider } from 'react-apollo';
import Divider from '@material-ui/core/Divider';
import gql from 'graphql-tag';
import NavbarHead from './Navbar_head';
import VoteLine from './Vote_line';
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

class VotePage extends Component {
  render() {
    return (
      <div>
        <div className="row">
          <NavbarHead />
        </div>

        <ApolloProvider client={client}>
          <Query
            query={gql`
            {
              votables {
                id,
                challenger {
                  user {
                    id,
                    username
                  },
                  input {
                    content,
                    uploadedAt,
                    updatedAt
                  }
                  numberVotes
                }
                challenged {
                  user {
                    id,
                    username
                  },
                  input {
                    content,
                    uploadedAt,
                    updatedAt
                  }
                  numberVotes
                },
                forWhomDidIVote {
                  id
                }
              }
            }
            `}
          >
            {({ loading, error, data }) => {
              console.log(`Error: ${error}`);

              if (loading) return <p>Loading...</p>;
              if (error) {
                return null;
              }
              
              return (
                <>
                  { data.votables.map(chall => (
                    <div>
                      <VoteLine challenge={chall} />
                      <Divider variant="middle" />
                    </div>
                  )) }
                </>
              );
            }}
          </Query>

        </ApolloProvider>
      </div>
    );
  }
}

export default VotePage;
