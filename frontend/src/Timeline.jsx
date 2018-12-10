import React, { Component } from 'react';
import ApolloClient from 'apollo-boost';
import { Query, ApolloProvider } from 'react-apollo';
import gql from 'graphql-tag';
import Sidebar from './components/Sidebar';
import PostsList from './components/PostGroup_timeline';
import NavbarHead from './components/Navbar_head';
import BoxChallenge from './components/Box_challenge';
import ChallengeForm from './components/Form_challenge';


const client = new ApolloClient({
  uri: 'http://localhost:4000',
});

class Timeline extends Component {
  render() {
    return (
      <div className="App">
        <ApolloProvider client={client}>
          <div>
            <h2>Co&apos; to server debug</h2>
          </div>
          <Query
            query={gql`
              {
                auth(username:"amadeous", password:"coucou1234"){
                  token, user{
                    id, username
                  }
                }
              }
            `}
          >
            {({ loading, error, data }) => {
              if (loading) return <p>Loading...</p>;
              if (error) return <p>Error :(</p>;
              console.log('DATAAAAAAAAAA:', data);
              return (
                <div>
                  <p>{`${data.auth.user.username}`}</p>
                </div>
              );
            }}
          </Query>

        </ApolloProvider>
        <body>
          <div className="row">
            <NavbarHead />
          </div>
          <div className="row">
            <div className="col-md-2">
              <div className="Sidebar-style">
                <Sidebar />
              </div>
            </div>
            <div className="col-md-offset-5">
              <div className="Challenge-style">
                <BoxChallenge />
              </div>
            </div>
            <div className="col-md-offset-3">
              <PostsList />
            </div>
            <div>
              <ChallengeForm />
            </div>
          </div>
        </body>

      </div>
    );
  }
}

export default Timeline;
