import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem, Panel } from 'react-bootstrap';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from 'apollo-boost';
import gql from 'graphql-tag';
import { Query, ApolloProvider } from 'react-apollo';
import Comment from '../comment';

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

// ICI récupération d'un post en particulier selon son id
// TODO: remplacer this.props.blablabla par les champs de l'objet récupéré

const comments = [];
comments.push(new Comment('0', 'John', 'Bien ouéj!'));
comments.push(new Comment('1', 'Marina', 'Cimer'));

function displayContent(category, content) {
  switch (category) {
    case 'verbal':
      return <blockquote>{content}</blockquote>;
    case 'picture':
      return <div className="pull-right"><img alt="Winning pic" className="PicChallenge-icon" src={content} height="150em" width="150em" /></div>;
    case 'sound':
      return (
        <audio controls>
          <source src={content} type="audio/mpeg" />
        </audio>
      );
    default:
      return null;
  }
}


class PostTimeline extends Component {
  render() {
    return (
      /*
      <div>
        <div className="Post-div">
          <div className="row">
            <p bsSize="small">
              {this.props.player1} {this.props.gameResult} against {this.props.player2}
            </p>
            {displayContent(this.props.category, this.props.content)}
          </div>
          <div className="row">
            <Glyphicon className="Glyphicon-large pull-right" glyph="comment" />
          </div>
          <div className="row">
            <ListGroup componentClass="ul">
              {
                comments.map(comment => (
                  <div>
                    <ListGroupItem className="ListComments-style">{comment.user}: {comment.comment}</ListGroupItem>
                  </div>))
              }
            </ListGroup>
          </div>
        </div>
      </div>
      */

      <div>
        <div className="Post-div">
          <div className="row">

            <ApolloProvider client={client}>
              <Query
                query={gql`
                {
                  query {
                    challenges(first: 10, offset: 5) {
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
                      comments(first: 2, offset: 1) {
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
                }
              `}
              >
                {({ loading, error, data }) => {
                  console.log(`Error: ${error}`);
                  console.log('Data LISTE CHALLENGES:');
                  console.log(data);
                if (loading) return <p>Loading...</p>;

                return (
                  <div>
                    <p>Welcome !</p>
                  </div>
                );
              }}
              </Query>

            </ApolloProvider>
            <Panel bsStyle="primary">
              <Panel.Heading>
                <Panel.Title componentClass="h3">{this.props.player1} {this.props.gameResult} against {this.props.player2}</Panel.Title>
              </Panel.Heading>
              <Panel.Body>
                <div className="row">
                  {displayContent(this.props.category, this.props.content)}
                </div>
                {/*
                <div className="row">
                  <Glyphicon className="Glyphicon-large pull-right" glyph="comment" />
                </div>
                */}

                <div className="row">
                  <ListGroup componentClass="ul">
                    {
                      comments.map(comment => (
                        <div>
                          <ListGroupItem className="ListComments-style"><b>{comment.user}</b>: {comment.comment}</ListGroupItem>
                        </div>))
                    }
                  </ListGroup>
                </div>

                {/* TODO : DB Acces to post comment */}
                <form>
                  <TextField
                    className="commentBox"
                    type="text"
                    hintText="Comment"
                    floatingLabelText="Comment"
                    name="comment"
                  />
                  <Button variant="contained" type="submit">Comment</Button>
                </form>

              </Panel.Body>
            </Panel>
          </div>
        </div>
      </div>
    );
  }
}

PostTimeline.propTypes = {
  player1: PropTypes.string.isRequired,
  gameResult: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  player2: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default PostTimeline;
