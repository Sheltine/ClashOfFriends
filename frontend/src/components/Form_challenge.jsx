/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import Select from 'react-select';
import { Button } from 'react-bootstrap';
import Countdown from 'react-countdown-now';
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from 'apollo-boost';
import { Query, ApolloProvider } from 'react-apollo';
import { recomposeColor } from '@material-ui/core/styles/colorManipulator';
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

const options = [];
class ChallengeForm extends Component {
    constructor(props) {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user !== null) {
            user.following.map(following => (
                options.push({ value: `${following.username}`, label: `${following.username}` })
            ));
        }

        console.log('options: ', options);
        super(props);
        this.state = {
            test: false,
            file: '',
            challenger: '',
            ready: false,
            category: '5c2fe5379591d0aa36b42ceb',
            textfile: '',
            theme: '',
            uploadtime: '',
            format: '',
            validateButton: '',
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleUserSelect = this.handleUserSelect.bind(this);
        this.handleReady = this.handleReady.bind(this);
        this.sendChallenge = this.sendChallenge.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.timeout = this.timeout.bind(this);
  }

    sendChallenge() {
        client
        .mutate({
            mutation: gql`
            mutation {
                challenge(username: "${this.state.challenger}", categoryId: "${this.state.category}") {
                  id,
                  username,
                  pendingChallenges {
                    challenger {
                      user{username}
                    },
                    challenged {
                      user{username}
                    },
                    format {
                      name
                    },
                    theme {
                      name
                    },
                    category {
                      name
                    },
                    uploadTime,
                    createdAt,
                    updatedAt
                  }
                }
              }
            `,
        }).then((response) => {
                console.log(response);
                const PC = response.data.challenge.pendingChallenges[(response.data.challenge.pendingChallenges.length) - 1];
                this.setState({
                    format: PC.format.name,
                    uploadtime: PC.uploadTime,
                    theme: PC.theme.name,
                });
            }).catch((err) => { console.log('err: ', err); });
    }

    // eslint-disable-next-line class-methods-use-this
    displayReadyContent(ready) {
        if (ready) {
            return (
              <div>
                <h3>You&apos;re challenging {this.state.challenger}!</h3>
                <p>You need to upload a text with thiese constraints:</p>
                <strong>Format: {this.state.format}</strong><br />
                <strong>Theme: {this.state.theme}</strong><br />
                <strong>Time to upload: {this.state.uploadtime}</strong>
                <input name="file" type="file" value={this.state.file} onChange={e => this.handleInputChange(e)} />
                <textarea name="textfile" type="text" value={this.state.textfile} onChange={e => this.handleTextChange(e)} />
                {this.renderTimeout(this.state.test)}
                <ReactCountdownClock
                  seconds={parseInt(this.state.uploadtime)}
                  color="#000"
                  alpha={0.9}
                  size={100}
                  onComplete={this.timeout}
                />
                <Button type="submit" name="validation" disabled={this.state.validateButton}>Update</Button>

                <p>Bien joué lol</p>
              </div>
            );
        }
        return (
          <div>
            <p>Find your friend</p>
            <Select
              onChange={this.handleUserSelect}
              options={options}
            />
            <Button onClick={this.handleReady}>Ready!</Button>
          </div>
        );
    }

    timeout() {
        this.state.test = true;
        this.setState({
            test: true,
            validateButton: 'disabled',
        });
        console.log('TIMEOUT DONE', this.state.test);
        return <p>cojsibfnem</p>;
    }

    handleReady(event) {
        if (this.state.challenger !== '') {
        this.setState({
            ready: true,
        });
        this.sendChallenge();
        }
    }

    handleUserSelect(event) {
        this.setState({
            challenger: event.value,
        });
        console.log('Option selected:', this.state.challenger);
      }

    // will send data to server
    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.file,
        });
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = (a) => {
            console.log('file', a.target.result);
            client
                .query({
                    query: gql`
                    {
                        file(type:"png", file:"${a.target.result}")
                    }
                    `,
                })
                .then(result => console.log(result));
            };
        // console.log(formData);
        // envoyer ça différemment
    }

    handleTextChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    // eslint-disable-next-line class-methods-use-this
    renderTimeout(test) {
        if (test) {
            return <p>timeout</p>;
        }
        return <p>default</p>;
    }

// check https://www.npmjs.com/package/react-file-viewer/v/0.4.1 for fileviewer
  render() {
    return (
      <div>
        <h1>{this.props.category} Challenge</h1>
        {this.displayReadyContent(this.state.ready)}
      </div>
    );
  }
}

ChallengeForm.propTypes = {
    category: PropTypes.string.isRequired,
};

export default ChallengeForm;
