import { Query, ApolloProvider } from 'react-apollo';
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import gql from 'graphql-tag';
import Sidebar from './components/Sidebar';
import NavbarHead from './components/Navbar_head';
import RequestedChall from './components/Element_resquested_challenge';
import client from './Util/ApolloClientManager';

class RequestedChallenges extends Component {
  render() {
    if (localStorage.getItem('currentUser') && localStorage.getItem('userToken')) {
      return (
        <div className="App">
          <body>
            <div className="row">
              <NavbarHead />
            </div>
            <div className="col-md-2 Sidebar-style">
              <Sidebar />
            </div>
            <h1>Challenge from your friends</h1>
            <ApolloProvider client={client}>
              <Query
                query={gql`
                {
                  user(username: "${JSON.parse(localStorage.getItem('currentUser')).username}") {
                    requestedChallenges {
                      id,
                      challenger{user{username}},
                      category{name, fileType},
                      theme{name},
                      format{name},
                      uploadTime
                    }
                  }
                }`}
              >
                {
                  ({ loading, error, data }) => {
                    console.log(`Error: ${error}`);
                    console.log('Data:');
                    console.log(data);
                    if (loading) return <p>Loading...</p>;
                    if (error) {
                      return null;
                    }

                    return (
                      data.user.requestedChallenges.map(chall => (
                        <div>
                          <RequestedChall
                            challenger={chall.challenger.user.username}
                            category={chall.category.name}
                            theme={chall.theme.name}
                            format={chall.format.name}
                            uploadTime={chall.uploadTime}
                            challengeId={chall.id}
                          />
                        </div>))
                      );
                    }
                  }
              </Query>
            </ApolloProvider>
          </body>
        </div>
      );
    }
    return <Redirect to="/connexion" />;
  }
}

export default RequestedChallenges;
