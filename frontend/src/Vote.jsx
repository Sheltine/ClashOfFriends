import React, { Component } from 'react';
import { Query, ApolloProvider } from 'react-apollo';
import Divider from '@material-ui/core/Divider';
import gql from 'graphql-tag';
import NavbarHead from './components/Navbar_head';
import VoteLine from './components/Vote_line';
import './App.css';
import client from './Util/ApolloClientManager';
import Sidebar from './components/Sidebar';

class VotePage extends Component {
  render() {
    return (
      <div>
        <div className="row">
          <NavbarHead />
        </div>
        <div className="col-md-2 Sidebar-style">
          <Sidebar />
        </div>
        <div>
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
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
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
      </div>
    );
  }
}

export default VotePage;
