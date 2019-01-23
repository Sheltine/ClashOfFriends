import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem, Panel } from 'react-bootstrap';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import Comment from '../comment';


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
function displayWin(challenger, challenged, challengerContent, challengedContent, nvbChallenger, nvbChallenged) {
  console.log('on est la lol', challenger);
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
                        <ListGroupItem className="ListComments-style"><b>{comment.user}</b>: {comment.comment}</ListGroupItem>
                      </div>))
                  }
                </ListGroup>
              </div>
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
                        <ListGroupItem className="ListComments-style"><b>{comment.user}</b>: {comment.comment}</ListGroupItem>
                      </div>))
                  }
                </ListGroup>
              </div>
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
      </div>
  );
}


class PostTimeline extends Component {
  constructor(props) {
    super(props);
    /*
      if (this.props.nbvChallenger > this.props.nbvChallenged) {
      console.log('1');
      this.setState({
          winner: this.props.challenger,
          loser: this.props.challenged,
          winContent: this.props.challengerContent,
          loseContent: this.props.challengedContent,
      });
    } else if (this.props.nbvChallenger < this.props.nbvChallenged) {
      console.log('2');

      this.setState({
        loser: this.props.challenger,
        winner: this.props.challenged,
        loseContent: this.props.challengerContent,
        winContent: this.props.challengedContent,
    });
    } else {
      console.log('3');

      this.setState({
        winner: this.props.challenger,
        loser: this.props.challenged,
        winContent: this.props.challengerContent,
        loseContent: this.props.challengedContent,
      });
    } */
    this.state = {
      winner: '',
      loser: '',
      winContent: '',
      loseContent: '',
    };
  }

  render() {
    return (
      <div>
        {console.log(this.props.challenger)}
        {displayWin(this.props.challenger, this.props.challenged, this.props.challengerContent, this.props.challengedContent, this.props.nbvChallenger, this.props.nbvChallenged)}
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
};

export default PostTimeline;
