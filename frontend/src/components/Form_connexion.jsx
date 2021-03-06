import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Alert } from 'react-bootstrap';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import { Query, ApolloProvider } from 'react-apollo';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import '../App.css';

const { BACKEND_URL } = require('../config');

console.log(`BackendURL: ${BACKEND_URL}`);

const client = new ApolloClient({
  uri: BACKEND_URL,
});

const style = {
  margin: 15,
};

function getErrorMsg(username, password, submitted) {
  if (submitted === true) {
    return (
      <ApolloProvider client={client}>
        <Query
          query={gql`
          {
            auth(username:"${username}", password:"${password}"){
              token, user{
                id,
                username,
                firstname,
                lastname,
                email,
                birthdate,
                createdAt,
                followers {
                  username,
                },
                following {
                  username,
                },
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
          }
        `}
        >
          {
            ({ loading, error, data }) => {
              if (loading) return <p>Loading...</p>;
              if (error) {
                return (
                  <div>
                    <br />
                    <Alert className="myAlert" bsStyle="danger">
                      <strong>Wrong credentials!</strong> <br /> Please try again
                    </Alert>
                  </div>
                );
              }
              localStorage.setItem('userToken', data.auth.token);
              localStorage.setItem('currentUser', JSON.stringify(data.auth.user));
              client.query({
                query: gql`
                {
                  categories {
                    id,
                    name,
                    uploadDurationMin,
                    uploadDurationMax,
                    voteDurationMin,
                    voteDurationMax
                  }
                }
                `,
              }).then((result) => {
                localStorage.setItem('categories', JSON.stringify(result.data.categories));
              }).catch(err => console.log('err: ', err));

              return (
                <div>
                  <p>Welcome {`${data.auth.user.username}`}</p>
                  <Redirect to="/" />
                </div>
              );
            }
          }

        </Query>
      </ApolloProvider>
      );
    }
    return <></>;
}

class FormConnexion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      submitted: false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const value = event.target.value;
    const name = event.target.name;

    this.setState({
      [name]: value,
      submitted: false,
    });
  }

  handleSubmit(event) {
    this.setState({
      submitted: true,
    });
    event.preventDefault();
  }

  render() {
    return (
      <div>
        {localStorage.clear()}
        {sessionStorage.clear()}
        <MuiThemeProvider>
          <div>
            <form onSubmit={this.handleSubmit}>
              <TextField
                hintText="Enter your Username"
                floatingLabelText="Username"
                name="username"
                onChange={this.handleInputChange}
              />
              <br />
              <TextField
                type="password"
                hintText="Enter your Password"
                floatingLabelText="Password"
                name="password"
                onChange={this.handleInputChange}
              />
              <br />
              <RaisedButton type="submit" label="Submit" primary style={style} />
            </form>
          </div>
        </MuiThemeProvider>
        <div>{getErrorMsg(this.state.username, this.state.password, this.state.submitted)}</div>
      </div>
      );
  }
}

export default FormConnexion;
