import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from 'apollo-boost';
import gql from 'graphql-tag';
import Sidebar from './components/Sidebar';
import PostsList from './components/PostGroup_timeline';
import NavbarHead from './components/Navbar_head';
import { Query, ApolloProvider } from 'react-apollo';
import RequestedChall from './components/Element_resquested_challenge';

const { BACKEND_URL } = require('./config.js');

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
            <h1>ICI</h1>
            {console.log('YOOOOOOOOOOOOOOOOOOOOOOO', JSON.parse(localStorage.getItem('currentUser')).username)}
            <ApolloProvider client={client}>
              <Query
        // dans server, remplacer if (authRequired) par if (!authRequired) pour debug
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
            }
          `}
              >
                {({ loading, error, data }) => {
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
          }}
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
