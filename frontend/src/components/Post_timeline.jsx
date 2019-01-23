import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem, Panel } from 'react-bootstrap';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import gql from 'graphql-tag';

import client from '../Util/ApolloClientManager';

function displayWin(challenger, challenged, challengerContent, challengedContent, nvbChallenger, nvbChallenged, comments) {
  console.log('on est la lol');
  if (nvbChallenger === nvbChallenged) {
    return (
      <div>
        <Panel bsStyle="primary">
          <Panel.Heading>
            <Panel.Title componentClass="h3">{challenger} and {challenged} were even! ({nvbChallenger} - {nvbChallenged})</Panel.Title>
          </Panel.Heading>
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
                      <ListGroupItem className="ListComments-style">
                        <b>{comment.owner.username}</b>: {comment.message}
                        <div className="pull-right">{comment.createdAt}</div>
                      </ListGroupItem>
                    </div>))
                }
              </ListGroup>
            </div>

          </Panel.Body>
        </Panel>
      </div>
    );
  }
  let winner;
  let loser;
  let winnerContent;
  let loserContent;
  let nbWin;
  let nbLose;
  if (nvbChallenger > nvbChallenged) {
    winner = challenger;
    loser = challenged;
    winnerContent = challengerContent;
    loserContent = challengedContent;
    nbWin = nvbChallenger;
    nbLose = nvbChallenged;
  } else {
    loser = challenger;
    winner = challenged;
    loserContent = challengerContent;
    winnerContent = challengedContent;
    nbLose = nvbChallenger;
    nbWin = nvbChallenged;
  }
  return (
    <div>
      <Panel bsStyle="primary">
        <Panel.Heading>
          <Panel.Title componentClass="h3">{winner} won against {loser} ({nbWin} - {nbLose})</Panel.Title>
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
      </Panel>
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
        <br />
        <br />
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
        <br />
        <br />
      </div>
    );
  }
}

PostTimeline.propTypes = {
  challenger: PropTypes.string.isRequired,
  challenged: PropTypes.string.isRequired,
  challengerContent: PropTypes.string.isRequired,
  challengedContent: PropTypes.string.isRequired,
  nbvChallenger: PropTypes.string.isRequired,
  nbvChallenged: PropTypes.string.isRequired,
  comments: PropTypes.string.isRequired,
  challengeId: PropTypes.string.isRequired,
};

export default PostTimeline;
