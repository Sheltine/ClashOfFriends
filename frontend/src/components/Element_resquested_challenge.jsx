import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';
import gql from 'graphql-tag';
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from 'apollo-boost';
import ReactCountdownClock from 'react-countdown-clock';

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
    client
    .mutate({
        mutation: gql`
        mutation {
            upload(
                    challengeId:"${this.props.challengeId}", content:"${this.state.textfile}"
                )
            {
                challenger{
                    user{
                        username
                    }
                }
            }
         }
        `,
    }).then((response) => {
        console.log('CHALLENGE ACCEPTE! ', response);
    }).catch((err) => {
        console.log('erreur à l\'upload: ', err);
    });
  }
    console.log('C COUCOU LOL');
}


  // eslint-disable-next-line class-methods-use-this
  rejectChall() {
    client
    .mutate({
        mutation: gql`
        mutation {
          rejectChallenge(challengeId: "${this.props.challengeId}") {
            id
          }
        }
        `,
    }).then((response) => {
        console.log('Successfully rejected! ', response);
        return <p>done</p>;
    }).catch((err) => {
        console.log('Rejection problem ', err);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  acceptChall() {
    client
    .mutate({
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
  category: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired,
  format: PropTypes.string.isRequired,
  uploadTime: PropTypes.string.isRequired,
  challengeId: PropTypes.string.isRequired,
  // date: PropTypes.string.isRequired,
};


export default RequestedChall;
