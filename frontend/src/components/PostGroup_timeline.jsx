import React, { Component } from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from 'apollo-boost';
import gql from 'graphql-tag';
import { Query, ApolloProvider } from 'react-apollo';
import PostTimeline from './Post_timeline';

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

class name extends Component {
  render() {
    return (
      <div className="PostGroup-div">
        <DropdownButton title="Sort">
          <MenuItem eventKey="1">All</MenuItem>
          <MenuItem eventKey="2">Only me</MenuItem>
          <MenuItem eventKey="3">Only friends</MenuItem>
        </DropdownButton>

        <ApolloProvider client={client}>
          <Query
            query={gql`
                {
                  
                    challenges(first: 10) {
                      id,
                      category {
                        name
                      },
                      format {
                        name
                      },
                      theme {
                        name
                      },
                      comments{
                        message,
                        owner {
                          username
                        }
                        createdAt,
                        updatedAt
                      }
                      challenger {
                        user {
                          username
                        }
                        uploadDateStart,
                        uploadDateEnd,
                        input {
                          content,
                          uploadedAt,
                          updatedAt
                        },
                        numberVotes,
                      }
                      challenged {
                        user {
                          username
                        }
                        uploadDateStart,
                        uploadDateEnd,
                        input {
                          content,
                          uploadedAt,
                          updatedAt
                        }
                        numberVotes,
                      },
                      forWhomDidIVote {
                        username
                      },
                      uploadTime,
                      voteDateStart,
                      voteDateEnd,
                      createdAt,
                      updatedAt
                    }
                  }
                
              `}
          >
            {({ loading, error, data }) => {
                  console.log(`Error: ${error}`);
                  console.log('Data LISTE CHALLENGES:');
                  console.log(data);
                if (loading) return <p>Loading...</p>;
                return (
                  data.challenges.map(chall => (
                    <div>
                      <PostTimeline
                        challenger={chall.challenger.user.username}
                        challenged={chall.challenged.user.username}
                        category={chall.category.name}
                        challengerContent={chall.challenger.input.content}
                        challengedContent={chall.challenged.input.content}
                        nbvChallenger={chall.challenger.numberVotes}
                        nbvChallenged={chall.challenged.numberVotes}
                      />

                    </div>))
                );
              }}
          </Query>

        </ApolloProvider>
      </div>
    );
  }
}

export default name;
