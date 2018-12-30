/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Glyphicon, Tooltip, OverlayTrigger, Button } from 'react-bootstrap';
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from 'apollo-boost';
import gql from 'graphql-tag';

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
        };
        this.unfollow = this.unfollow.bind(this);
        this.follow = this.follow.bind(this);
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
                }
              }
            `,
        }).then((response) => {
                console.log('Réponse serveur: ', response.data);
                localStorage.setItem('currentUser', JSON.stringify(response.data.unfollow));
                this.setState(
                    {
                        following: JSON.parse(localStorage.getItem('currentUser')).following,
                    },
                );
            });
    }

    follow(event) {
        // ici delete dans DB
        console.log('coucou');
        const toFollow = event.target.value;
        console.log(toFollow);
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
        // si possible modifier pour prevState si moyen de faire fonctionner
    }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-2">
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
          <div className="col-md-offset-5">
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
