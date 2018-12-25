/* eslint-disable no-underscore-dangle */
/* eslint-disable no-alert */
import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Glyphicon, Tooltip, OverlayTrigger, Button } from 'react-bootstrap';

const followers_ = [];
followers_.push('Johanna');
followers_.push('Leo');
followers_.push('Marinou');
followers_.push('Yann');
followers_.push('Joel');

const following_ = [];
following_.push('Leo');
following_.push('Stevie');

const tooltip = (
  <Tooltip id="tooltip">
    Unfollow
  </Tooltip>
  );

class FriendList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            followers: followers_,
            following: following_,
        };
        this.unfollow = this.unfollow.bind(this);
  }

    // eslint-disable-next-line class-methods-use-this
    unfollow(event) {
        // ici delete dans DB
        this.setState(
            {
                // eslint-disable-next-line react/no-access-state-in-setstate
                following: this.state.following.filter((_, i) => i === (this.state.following.findIndex(f => f === event.target.value), 1)),
            },
        );
    }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-2">
            <h1>Followers:</h1>
            <ListGroup componentClass="ul">
              {
            this.state.followers.map(follower => (
              <div>
                <ListGroupItem className="Follow-style">{follower}</ListGroupItem>
              </div>))
              }
            </ListGroup>
          </div>
          <div className="col-md-offset-5">
            <h1>Following:</h1>
            <ListGroup componentClass="ul">
              {
            this.state.following.map(follow => (
              <ListGroupItem className="Follow-style">{follow} <OverlayTrigger placement="right" overlay={tooltip}>
                <Button bsSize="xs" onClick={this.unfollow} value={follow} type="submit" className="pull-right">
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
