import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import VoteBox from './Vote_box';
import '../App.css';

class VoteLine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            challengeId: props.challenge.id,
            challengerSide: props.challenge.challenger,
            challengedSide: props.challenge.challenged,
            votedFor: props.challenge.forWhomDidIVote,
        };
    }

    hasChallengedVoted() {
        return this.state.votedFor && this.state.votedFor.id === this.state.challengedSide.user.id;
    }

    hasChallengerVoted() {
        return this.state.votedFor && this.state.votedFor.id === this.state.challengerSide.user.id;
    }

    render() {
        return (
          <Row className="show-grid">
            <Col md={5} mdPush={1}>
              <VoteBox challengeId={this.state.challengeId} challengeSide={this.state.challengerSide} voted={this.hasChallengerVoted()} />
            </Col>

            <Col md={2}>
              <center>
                <font size="20">
                  <br />
                  <br />
                  <br /> V.S.
                </font>
              </center>
            </Col>

            <Col md={5} mdPull={1}>
              <VoteBox challengeId={this.state.challengeId} challengeSide={this.state.challengedSide} voted={this.hasChallengedVoted()} />
            </Col>
          </Row>
        );
    }
}

VoteLine.propTypes = {
    challengeId: PropTypes.string.isRequired,
    challengerSide: PropTypes.object.isRequired,
    challengedSide: PropTypes.object.isRequired,
    votedFor: PropTypes.object.isRequired,
};

export default VoteLine;
