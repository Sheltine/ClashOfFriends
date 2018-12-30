import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from 'apollo-boost';
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
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.makeInfoEditable = this.makeInfoEditable.bind(this);
        this.cancel = this.cancel.bind(this);
        this.update = this.update.bind(this);
        this.displayContent = this.displayContent.bind(this);
  }

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
              <form className="pull-right" onSubmit={this.cancel}>
                <Button className="minispace" type="submit">Cancel</Button>
              </form>
            </form>

          </div>
          );
      default:
        return null;
    }
  }

  handleInputChange(event) {
    const value = event.target.value;
    const name = event.target.name;

    this.setState({
        [name]: value,
    });
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
      });
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
                birthdate:"${new Date(parseInt(this.state.birthdate.substring(8, 10)), parseInt(this.state.birthdate.substring(4, 6)), parseInt(this.state.birthdate.substring(0, 2)))}"
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
          localStorage.setItem('currentUser', JSON.stringify(response.data.updateProfile));
          const newUser = JSON.parse(localStorage.getItem('currentUser'));
          this.setState({
            firstname: newUser.firstname,
            lastname: newUser.lastname,
            birthdate: newUser.birthdate,
            email: newUser.email,
          });
        });
  }

  render() {
    return (
      <div>
        <form>
          <FormGroup>
            <ControlLabel>First name</ControlLabel>
            <FormControl
              type="text"
              name="firstname"
              value={this.state.firstname}
              onChange={this.handleInputChange}
              disabled={this.state.disabled}
            />
            <FormControl.Feedback />

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
      </div>
    );
  }
}

export default UserInfo;
