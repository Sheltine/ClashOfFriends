/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Glyphicon, Tooltip, OverlayTrigger, Button } from 'react-bootstrap';
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from 'apollo-boost';
import gql from 'graphql-tag';
import { Query, ApolloProvider } from 'react-apollo';
import Select from 'react-select';

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

const tooltipUnfollow = (
  <Tooltip id="tooltip">
    Unfollow
  </Tooltip>
  );

  const tooltipFollow = (
    <Tooltip id="tooltip">
      Follow back
    </Tooltip>
    );

class FriendList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // à remplacer par la vraie liste de followers
            followers: JSON.parse(localStorage.getItem('currentUser')).followers,
            following: JSON.parse(localStorage.getItem('currentUser')).following,
            newFollowing: '',
        };
        this.unfollow = this.unfollow.bind(this);
        this.follow = this.follow.bind(this);
        this.handleUserSelect = this.handleUserSelect.bind(this);
  }

  handleUserSelect(event) {
    this.setState({
        newFollowing: event.value,
    });
    console.log('Option selected:', this.state.newFollowing);
  }

    // eslint-disable-next-line class-methods-use-this
    unfollow(event) {
        // ici delete dans DB
        // si possible modifier pour prevState si moyen de faire fonctionner
        const toUnfollow = event.target.value;
        console.log(toUnfollow);
        client
        .mutate({
            mutation: gql`
            mutation {
                unfollow(username: "${toUnfollow}") {
                  id,
                  username,
                  firstname,
                  lastname,
                  email,
                  birthdate,
                  createdAt,
                  followers {
                    username,
                  },
                  following {
                    username,
                  },
                  pendingChallenges {
                    challenger {
                      user{username}
                    },
                    challenged {
                      user{username}
                    },
                    format {
                      name
                    },
                    theme {
                      name
                    },
                    category {
                      name
                    },
                    uploadTime,
                    createdAt,
                    updatedAt
                  }
                }
              }
            `,
        }).then((response) => {
                localStorage.setItem('currentUser', JSON.stringify(response.data.unfollow));
                this.setState(
                    {
                        following: JSON.parse(localStorage.getItem('currentUser')).following,
                    },
                );
            }).catch((err) => {
              console.log('An error occured ', err);
            });
    }

    follow(event) {
        const toFollow = event.target.value;
        console.log(toFollow);
        if (event.target.value !== '') {
          client
          .mutate({
              mutation: gql`
              mutation {
                  follow(username: "${toFollow}") {
                    id,
                    username,
                    firstname,
                    lastname,
                    email,
                    birthdate,
                    followers {
                      username,
                    },
                    following {
                      username,
                    },
                    pendingChallenges {
                      challenger {
                        user{username}
                      },
                      challenged {
                        user{username}
                      },
                      format {
                        name
                      },
                      theme {
                        name
                      },
                      category {
                        name
                      },
                      uploadTime,
                      createdAt,
                      updatedAt
                    }
                  }
                }
              `,
          }).then((response) => {
                  console.log('Réponse serveur: ', response.data);
                  localStorage.setItem('currentUser', JSON.stringify(response.data.follow));
                  this.setState(
                      {
                          following: JSON.parse(localStorage.getItem('currentUser')).following,
                      },
                  );
              });
        }
        // si possible modifier pour prevState si moyen de faire fonctionner
    }

  render() {
    return (
      <div>
        <ApolloProvider client={client}>
          <Query
        // dans server, remplacer if (authRequired) par if (!authRequired) pour debug
            query={gql`
            {
              users {
                username
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
          const options = [];

          data.users.map(user => (
              options.push({ value: `${user.username}`, label: `${user.username}` })
          ));

            return (
              <div className="row">
                <div className="col-md-4 col-md-offset-4">
                  <h3>Find users</h3>
                  <Select
                    onChange={this.handleUserSelect}
                    options={options}
                  />
                  <Button bsSize="medium" onClick={this.follow} value={this.state.newFollowing} type="submit">
                   Follow
                  </Button>
                </div>
              </div>
            );
          }}
          </Query>

        </ApolloProvider>
        <div className="row vspace">
          <div className="col-md-2 col-md-offset-4">
            <h1>Followers</h1>
            <ListGroup componentClass="ul">
              {
            this.state.followers.map(follower => (
              <div>
                <ListGroupItem className="Follow-style">{follower.username} <OverlayTrigger placement="right" overlay={tooltipFollow}>
                  <Button bsSize="xs" onClick={this.follow} value={follower.username} type="submit" className="pull-right">
                    <Glyphicon className="Glyph-blue" glyph="repeat" />
                  </Button>
                </OverlayTrigger>
                </ListGroupItem>
              </div>))
              }
            </ListGroup>
          </div>
          <div className="col-md-offset-6">
            <h1>Following</h1>
            <ListGroup componentClass="ul">
              {
            this.state.following.map(follow => (
              <ListGroupItem className="Follow-style">{follow.username} <OverlayTrigger placement="right" overlay={tooltipUnfollow}>
                <Button bsSize="xs" onClick={this.unfollow} value={follow.username} type="submit" className="pull-right">
                  <Glyphicon className="Glyph-red" glyph="remove" />
                </Button>
              </OverlayTrigger>
              </ListGroupItem>
                ))
                }
            </ListGroup>
          </div>
        </div>
      </div>
    );
  }
}

export default FriendList;
