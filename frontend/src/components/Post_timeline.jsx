import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem, Glyphicon } from 'react-bootstrap';
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

class PostTimeline extends Component {
  render() {
    return (
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
