import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Button, Alert } from 'react-bootstrap';
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from 'apollo-boost';
// import { Mutation, ApolloProvider } from 'react-apollo';
import gql from 'graphql-tag';


const { BACKEND_URL } = require('../config.js');

const httpLink = new HttpLink({ uri: BACKEND_URL });
const authLink = new ApolloLink((operation, forward) => {
    const token = localStorage.getItem('userToken');
    operation.setContext({
    headers: {
        authorization: token ? `Bearer ${token}` : '',
    },
});
return forward(operation);
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

const user = JSON.parse(localStorage.getItem('currentUser'));

let buttonType = 'edit';

class UserInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: user.firstname,
            lastname: user.lastname,
            birthdate: user.birthdate,
            email: user.email,
            password: '',
            disabled: true,
            submitted: false,
            type: '',
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.makeInfoEditable = this.makeInfoEditable.bind(this);
        this.cancel = this.cancel.bind(this);
        this.update = this.update.bind(this);
        this.displayContent = this.displayContent.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        // this.getErrorMsg = this.getErrorMsg.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  getMsg(type) {
    switch (type) {
      case 'error':
        return (
          <div>
            <br />
            <Alert bsStyle="danger">
              <strong>Please provide valid info</strong>
            </Alert>
          </div>
        );
      case 'valid':
      return (
        <div>
          <br />
          <Alert bsStyle="success">
            <strong>Your info has been successfully updated</strong>
          </Alert>
        </div>
      );
      default:
      return <p />;
    }
  }

/*
  getErrorMsg(submitted) {
    if (submitted === true) {
      console.log(this.state.firstname);
      console.log('here we are');
        return (
          <ApolloProvider client={client}>
            <Mutation
              mutation={gql`
              mutation{
                updateProfile(user : {
                  username:"${user.username}",
                  password:"${this.state.password}",
                  firstname:"${this.state.firstname}",
                  lastname:"${this.state.lastname}",
                  email:"${this.state.email}",
                  birthdate:"${this.state.birthdate}"
                  }) {
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
                  }}
              `}
            >
              {({ loading, error, data }) => {
                console.log('coucou');
                console.log(`Error: ${error}`);
                console.log('Data:');
                console.log(data);
              if (loading) return <p>Loading...</p>;
              if (error) {
                return (
                  <div>
                    <br />
                    <Alert bsStyle="danger">
                      <strong>Please provide valid info</strong>
                    </Alert>
                  </div>
                  );
            }
            localStorage.setItem('currentUser', JSON.stringify(data.updateProfile));
            const newUser = JSON.parse(localStorage.getItem('currentUser'));
            this.setState({
              firstname: newUser.firstname,
              lastname: newUser.lastname,
              birthdate: newUser.birthdate,
              email: newUser.email,
            });
              return (
                <div>
                  <br />
                  <Alert className="vspace" bsStyle="success">
                    <strong>Your info have been successfully updated</strong>
                  </Alert>
                </div>
              );
            }}
            </Mutation>
          </ApolloProvider>
        );
      }
      return <p />;
  }
*/

  displayContent(bt) {
    switch (bt) {
      case 'edit':
        return (
          <form onSubmit={this.makeInfoEditable}>
            <Button className="minispace" type="submit">Edit</Button>
          </form>
          );
      case 'update':
        return (
          <div>
            <form onSubmit={this.update}>
              <ControlLabel>Please confirm your password</ControlLabel>
              <FormControl
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handleInputChange}
              />
              <Button className="minispace" type="submit">Update</Button>
              <Button className="minispace pull-right" onClick={this.cancel}>Cancel</Button>
            </form>
          </div>
          );
      default:
        return null;
    }
  }

  handleSubmit(event) {
    // eslint-disable-next-line react/destructuring-assignment
    this.setState({
     submitted: true,
    });
  console.log('submitted: ', this.state.submitted);
  event.preventDefault();
  }

  handleInputChange(event) {
    const value = event.target.value;
    const name = event.target.name;

    this.setState({
        [name]: value,
        submitted: false,
    });

    console.log('submitted change: ', this.state.submitted);
  }

    makeInfoEditable(event) {
        event.preventDefault();
        this.setState({
            disabled: false,
        });
        buttonType = 'update';
    }

    cancel(event) {
      event.preventDefault();
      this.setState({
          disabled: true,
          type: '',
      });
      console.log('type: ', this.state.type);
      buttonType = 'edit';
  }

    update(event) {
      event.preventDefault();
      this.setState({
          disabled: true,
      });
      buttonType = 'edit';

      client
        .mutate({
            mutation: gql`
            mutation{
              updateProfile(user : {
                username:"${user.username}",
                password:"${this.state.password}",
                firstname:"${this.state.firstname}",
                lastname:"${this.state.lastname}",
                email:"${this.state.email}",
                birthdate:"${this.state.birthdate}"
                }) {
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
                }}
            `,
        }).then((response) => {
          console.log(response);
          this.state.type = 'valid';
          localStorage.setItem('currentUser', JSON.stringify(response.data.updateProfile));
          const newUser = JSON.parse(localStorage.getItem('currentUser'));
          this.setState({
            firstname: newUser.firstname,
            lastname: newUser.lastname,
            birthdate: newUser.birthdate,
            email: newUser.email,
          });
        }).catch((errors) => {
          console.log(errors);
          this.setState({
            type: 'error',
        });
        });
  }

  render() {
    return (
      <div>
        <form>
          <center><h2>Personal information</h2></center>
          <FormGroup className="minispace">
            <ControlLabel>First name</ControlLabel>
            <FormControl
              type="text"
              name="firstname"
              value={this.state.firstname}
              onChange={this.handleInputChange}
              disabled={this.state.disabled}
            />

            <ControlLabel>Last name</ControlLabel>
            <FormControl
              type="text"
              name="lastname"
              value={this.state.lastname}
              onChange={this.handleInputChange}
              disabled={this.state.disabled}
            />
          </FormGroup>

          <ControlLabel>Birthdate</ControlLabel>
          <FormControl
            type="text"
            name="birthdate"
            value={this.state.birthdate}
            onChange={this.handleInputChange}
            disabled={this.state.disabled}
          />

          <ControlLabel>Email</ControlLabel>
          <FormControl
            type="text"
            name="email"
            value={this.state.email}
            onChange={this.handleInputChange}
            disabled={this.state.disabled}
          />
        </form>
        {this.displayContent(buttonType)}
        {this.getMsg(this.state.type)}
      </div>
    );
  }
}

export default UserInfo;
