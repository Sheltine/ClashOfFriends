import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem, Panel } from 'react-bootstrap';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
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


function displayWin(challenger, challenged, challengerContent, challengedContent, nvbChallenger, nvbChallenged, comments) {
  console.log('on est la lol');
  if (nvbChallenger === nvbChallenged) {
    return (
      <div>
        <h2>{challenger} and {challenged} were even!</h2>
        <Panel.Body>
          <div className="row">
            <blockquote>{challengerContent}</blockquote><i className="pull-right">- {challenger}</i><br />
            <blockquote>{challengedContent}</blockquote><i className="pull-right">- {challenged}</i><br />
          </div>
          <div className="row">
            <ListGroup componentClass="ul">
              {
                    comments.map(comment => (
                      <div>
                        <ListGroupItem className="ListComments-style"><b>{comment.owner.username}</b>: {comment.message}</ListGroupItem>
                      </div>))
                  }
            </ListGroup>
          </div>

        </Panel.Body>
      </div>
    );
  }
  let winner;
  let loser;
  let winnerContent;
  let loserContent;
  if (nvbChallenger > nvbChallenged) {
    winner = challenger;
    loser = challenged;
    winnerContent = challengerContent;
    loserContent = challengedContent;
  } else {
    loser = challenger;
    winner = challenged;
    loserContent = challengerContent;
    winnerContent = challengedContent;
  }
  return (
    <div>
      <Panel.Heading>
        <h2>{winner} won against {loser}</h2>
      </Panel.Heading>
      <Panel.Body>
        <div className="row">
          <blockquote>{winnerContent}</blockquote><i className="pull-right">- {winner}</i><br />
          <blockquote>{loserContent}</blockquote><i className="pull-right">- {loser}</i><br />
        </div>
        <div className="row">
          <ListGroup componentClass="ul">
            {
                    comments.map(comment => (
                      <div>
                        <ListGroupItem className="ListComments-style">
                        <b>{comment.owner.username}</b>: {comment.message}
                        <div className="pull-right">{comment.createdAt}</div>
                        </ListGroupItem>
                      </div>))
                  }
          </ListGroup>
        </div>

      </Panel.Body>
    </div>
  );
}


class PostTimeline extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      commentText: '',
      commentList: this.props.comments,
    };
    this.commentChall = this.commentChall.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  handleTextChange(e) {
    this.setState({
        [e.target.name]: e.target.value,
    });
}

  commentChall() {
    if (this.state.commentText !== '') {
      client.mutate({
        mutation: gql`
          mutation {
            comment (challengeId: "${this.props.challengeId}", message: "${this.state.commentText}") {
              comments {
                message,
                owner {
                  username
                },
                createdAt
              }
            }
          }
        `,
        }).then((response) => {
            console.log(response);
            this.setState({
              commentList: response.data.comment.comments,
            });
        }).catch((error) => {
          console.log(error);
        });
    }
  }

  render() {
    console.log('conmments:', this.props.comments);
    return (
      <div>
        {console.log(this.props.challenger)}
        {displayWin(this.props.challenger, this.props.challenged, this.props.challengerContent, this.props.challengedContent, this.props.nbvChallenger, this.props.nbvChallenged, this.state.commentList)}
        <form>
          <TextField
            className="commentBox"
            type="text"
            hintText="Comment"
            floatingLabelText="Comment"
            name="commentText"
            onChange={e => this.handleTextChange(e)}
          />
          <Button variant="contained" onClick={this.commentChall}>Comment</Button>
        </form>
      </div>
    );
  }
}

PostTimeline.propTypes = {
  challenger: PropTypes.string.isRequired,
  challenged: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  challengerContent: PropTypes.string.isRequired,
  challengedContent: PropTypes.string.isRequired,
  nbvChallenger: PropTypes.string.isRequired,
  nbvChallenged: PropTypes.string.isRequired,
  comments: PropTypes.string.isRequired,
  challengeId: PropTypes.string.isRequired,
};

export default PostTimeline;
