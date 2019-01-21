import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import { FormGroup, FormControl, Alert } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import { Redirect } from 'react-router-dom';
import { Query, ApolloProvider } from 'react-apollo';
import TextField from 'material-ui/TextField';

const { BACKEND_URL } = require('../config.js');

const client = new ApolloClient({
  uri: BACKEND_URL,
});

function getErrorMsg(username, password, submitted) {
  if (submitted === true) {
      return (
        <ApolloProvider client={client}>
          <Query
        // dans server, remplacer if (authRequired) par if (!authRequired) pour debug
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
                }
              }
            }
          `}
          >
            {({ loading, error, data }) => {
              console.log(`Error: ${error}`);
              console.log('Data:');
              console.log(data);
            if (loading) return <p>Loading...</p>;
            if (error) {
              return (
                <div>
                  <br />
                  <Alert bsStyle="danger">
                    <strong>Error while registering!</strong>
                  </Alert>
                </div>
                );
          }
            localStorage.setItem('userToken', data.auth.token);
            localStorage.setItem('currentUser', JSON.stringify(data.auth.user));
            return (
              <div>
                <p>Welcome !</p>
                <Redirect to="/" />
              </div>
            );
          }}
          </Query>

        </ApolloProvider>
      );
    }
    return <p />;
}

class FormInscription extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: '',
            lastname: '',
            email: '',
            birthdate: new Date(),
            username: '',
            password: '',
            submitted: false,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getDate = this.getDate.bind(this);
        this.passwordValidation = this.passwordValidation.bind(this);
        this.usernameValidation = this.usernameValidation.bind(this);
  }


  getDate(date) {
    this.setState({
        birthdate: date,
    });
  }

  handleInputChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({
        [name]: value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      submitted: true,
     });
    client
        .mutate({
            mutation: gql`
            mutation{register(user : {
                username:"${this.state.username}",
                password:"${this.state.password}",
                firstname:"${this.state.firstname}",
                lastname:"${this.state.lastname}",
                email:"${this.state.email}",
                birthdate:"${this.state.birthdate}"
                }) {
                  token,
                  user {
                    id,
                    username,
                    firstname,
                    lastname,
                    email,
                    birthdate,
                    followers {
                      username,
                    },
                    following {
                      username,
                    },
                    pendingChallenges {
                      challenger {
                        username
                      },
                      challenged {
                        username
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
                }}
            `,
        }).then((response) => {
          console.log(response.data.register.token);
          if (response.data.register.token !== null) {
            console.log('noice');
            localStorage.setItem('userToken', response.data.register.token);
            localStorage.setItem('currentUser', JSON.stringify(response.data.register.user));
            window.location('/');
          }
        });
}

      passwordValidation() {
        const length = this.state.password.length;
        if (length > 11) {
            return 'success';
        }
        if (length > 7) {
            return 'warning';
        }
        if (length > 0) {
            return 'error';
        }
        return null;
      }

      usernameValidation() {
        const length = this.state.username.length;
        if (length > 3 /* et qu'il n'est pas dans bd */) {
            return 'success';
        }
        if (0/* n'est pas dans la bd */) {
            return 'warning';
        }
        return 'error';
      }

      birthdateValidation() {
        const length = this.state.birthdate.length;
        if (length !== 8 || !this.state.birthdate.match(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{2}$/i)) {
          return 'error';
        }
        return null;
      }

  render() {
    return (
      <div className="Centered-form">
        <br />
        {localStorage.clear()}
        {sessionStorage.clear()}
        <form onSubmit={this.handleSubmit}>
          <FormGroup
            controlId="formBasicText"
          >
            <TextField
              hintText="Enter your First Name"
              floatingLabelText="First Name"
              name="firstname"
              onChange={this.handleInputChange}
            />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup>
            <TextField
              hintText="Enter your Last Name"
              floatingLabelText="Last Name"
              name="lastname"
              onChange={this.handleInputChange}
            />
            <FormControl.Feedback />
          </FormGroup>

          <FormGroup>
            <TextField
              hintText="Enter your Email"
              type="email"
              floatingLabelText="Email"
              name="email"
              onChange={this.handleInputChange}
            />
            <FormControl.Feedback />
          </FormGroup>

          <FormGroup
            validationState={this.birthdateValidation()}
          >
            <TextField
              hintText="Enter your Birthdate"
              floatingLabelText="jj/mm/yy"
              name="birthdate"
              onChange={this.handleInputChange}
            />
            <FormControl.Feedback />
          </FormGroup>


          <FormGroup
            validationState={this.usernameValidation()}
          >
            <TextField
              hintText="Enter your Username"
              floatingLabelText="Username"
              name="username"
              onChange={this.handleInputChange}
            />
            <FormControl.Feedback />
          </FormGroup>

          <FormGroup
            validationState={this.passwordValidation()}
          >
            <TextField
              type="password"
              hintText="Enter your Password"
              floatingLabelText="Password"
              name="password"
              onChange={this.handleInputChange}
              validationState={this.passwordValidation()}
            />
            <FormControl.Feedback />
          </FormGroup>
          <Button type="submit">Submit</Button>
          <p>{getErrorMsg(this.state.username, this.state.password, this.state.submitted)}</p>
        </form>
      </div>
    );
  }
}

export default FormInscription;
