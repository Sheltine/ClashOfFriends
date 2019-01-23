import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';
import gql from 'graphql-tag';
import ReactCountdownClock from 'react-countdown-clock';

import client from '../Util/ApolloClientManager';

class RequestedChall extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      textfile: '',
      validateButton: '',
    };
    this.rejectChall = this.rejectChall.bind(this);
    this.acceptChall = this.acceptChall.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.timeout = this.timeout.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.validateChallenge = this.validateChallenge.bind(this);
  }

  handleClose() {
    this.setState({ show: false });
  }

  timeout() {
    this.setState({
      validateButton: 'disabled',
    });
  }

  handleTextChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  validateChallenge() {
    if (this.state.textfile !== '') {
      client.mutate({
        mutation: gql`
          mutation {
              upload(challengeId:"${this.props.challengeId}", content:"${this.state.textfile}")
              {
                challenger {
                  user {
                      username
                  }
                }
              }
            }
        `,
      });
  }
}

  rejectChall() {
    client.mutate({
      mutation: gql`
        mutation {
          rejectChallenge(challengeId: "${this.props.challengeId}") {
            id
          }
        }
      `,
    }).then((response) => {
        console.log('Successfully rejected! ', response);
        return <p>Done</p>;
    }).catch((err) => {
        console.log('Rejection problem ', err);
    });
  }

  acceptChall() {
    client.mutate({
      mutation: gql`
        mutation {
          acceptChallenge(challengeId: "${this.props.challengeId}") {
            id
          }
        }
      `,
    }).then((response) => {
      console.log('Successfully accepted! ', response);
      this.setState({
        show: true,
      });
    }).catch((err) => {
      console.log('Acceptation problem ', err);
    });
    this.setState({
      show: true,
    });
  }

  render() {
    return (
      <div>
        <div>
          <p><strong>{this.props.challenger}</strong> challenged you!</p>
          <Button onClick={this.acceptChall}>Accept</Button>
          <Button onClick={this.rejectChall}>Reject</Button>
        </div>
        <div>

          <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Answer to challenge</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                <h3>You&apos;re challenging {this.props.challenger}!</h3>
                <p>You need to upload a text with these constraints:</p>
                <p><strong>Format:  {this.props.format}</strong></p>
                <p><strong>Theme: {this.props.theme}</strong></p>
                <p><strong>Time to upload: {this.props.uploadTime}</strong></p>
                <textarea name="textfile" type="text" value={this.state.textfile} onChange={e => this.handleTextChange(e)} />
                <center>
                  <ReactCountdownClock
                    seconds={parseInt(this.props.uploadTime, 10) * 60}
                    color="#00bcd4"
                    alpha={0.9}
                    size={200}
                    onComplete={this.timeout}
                  />
                </center>
                <Button className="pull-right" type="submit" onClick={this.validateChallenge} disabled={this.state.validateButton}>Upload</Button>
                <p>{this.state.accepeted}</p>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.handleClose}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }
}

RequestedChall.propTypes = {
  challenger: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired,
  format: PropTypes.string.isRequired,
  uploadTime: PropTypes.string.isRequired,
  challengeId: PropTypes.string.isRequired,
};


export default RequestedChall;
