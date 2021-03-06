/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import Select from 'react-select';
import { Button } from 'react-bootstrap';
import ReactCountdownClock from 'react-countdown-clock';

import client from '../Util/ApolloClientManager';

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
            challenger: '',
            ready: false,
            category: '5c2fe5379591d0aa36b42ceb',
            textfile: '',
            theme: '',
            uploadtime: '',
            format: '',
            validateButton: '',
            challengeId: '',
            accepeted: '',
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleUserSelect = this.handleUserSelect.bind(this);
        this.handleReady = this.handleReady.bind(this);
        this.sendChallenge = this.sendChallenge.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.timeout = this.timeout.bind(this);
        this.validateChallenge = this.validateChallenge.bind(this);
  }

  validateChallenge() {
      if (this.state.textfile !== '') {
        client.mutate({
            mutation: gql`
                mutation {
                    upload(
                            challengeId:"${this.state.challengeId}", content:"${this.state.textfile}"
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
        }).then(() => {
            this.setState({ accepeted: 'Accepted ! You can upload again to modify you text.' });
        }).catch(() => {
            this.setState({ accepeted: 'Error !' });
        });
    }
  }

    sendChallenge() {
        client.mutate({
            mutation: gql`
                mutation {
                    challenge(username: "${this.state.challenger}", categoryId: "${this.state.category}") {
                        username,
                        pendingChallenges {
                            id,
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
                const PC = response.data.challenge.pendingChallenges[(response.data.challenge.pendingChallenges.length) - 1];
                this.setState({
                    format: PC.format.name,
                    uploadtime: PC.uploadTime,
                    theme: PC.theme.name,
                    challengeId: PC.id,
                });
        }).catch((err) => { console.log('err: ', err); });
    }

    displayReadyContent(ready) {
        if (ready) {
            return (
              <div>
                <h3>You&apos;re challenging {this.state.challenger}!</h3>
                <p>You need to upload a text with these constraints:</p>
                <p><strong>Format:  {this.state.format}</strong></p>
                <p><strong>Theme: {this.state.theme}</strong></p>
                <p><strong>Time to upload: {this.state.uploadtime}</strong></p>

                {/* This could be add when file upload will be used
                <input name="file" type="file" value={this.state.file} onChange={e => this.handleInputChange(e)} />
                */}

                <textarea name="textfile" type="text" value={this.state.textfile} onChange={e => this.handleTextChange(e)} />
                <center>
                  <ReactCountdownClock
                    seconds={parseInt(this.state.uploadtime, 10) * 60}
                    color="#00bcd4"
                    alpha={0.9}
                    size={200}
                    onComplete={this.timeout}
                  />
                </center>
                <Button className="pull-right" type="submit" onClick={this.validateChallenge} disabled={this.state.validateButton}>Upload</Button>
                <p>{this.state.accepeted}</p>
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
            <Button classname="vspace" onClick={this.handleReady}>Ready!</Button>
          </div>
        );
    }

    timeout() {
        this.setState({
            validateButton: 'disabled',
        });
    }

    handleReady() {
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
    }

    // will send data to server
    // Not functional yet.
    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.file,
        });
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = (a) => {
            console.log('file', a.target.result);
            client.query({
                    query: gql`
                    {
                        file(type:"png", file:"${a.target.result}")
                    }
                    `,
                });
            };
    }

    handleTextChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
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
