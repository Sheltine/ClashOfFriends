import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';

const { BACKEND_URL } = require('../config.js');

const client = new ApolloClient({
  uri: BACKEND_URL,
});

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
                    createdAt
                  }
                }}
            `,
        }).then(response => console.log(response.data.auth.token));
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
        <form onSubmit={this.handleSubmit}>
          <FormGroup
            controlId="formBasicText"
          >
            <ControlLabel>First name</ControlLabel>
            <FormControl
              label="First name"
              type="text"
              value={this.state.firstname}
              placeholder="First name"
              name="firstname"
              onChange={this.handleInputChange}
            />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Last name</ControlLabel>
            <FormControl
              type="text"
              value={this.state.lastname}
              placeholder="Last name"
              name="lastname"
              onChange={this.handleInputChange}
            />
            <FormControl.Feedback />
          </FormGroup>

          <FormGroup>
            <ControlLabel>Email address</ControlLabel>
            <FormControl
              type="email"
              value={this.state.email}
              placeholder="Email"
              name="email"
              onChange={this.handleInputChange}
            />
            <FormControl.Feedback />
          </FormGroup>

          <FormGroup
            validationState={this.birthdateValidation()}
          >
            <ControlLabel>Birthdate</ControlLabel>
            <FormControl
              type="text"
              name="birthdate"
              placeholder="jj/mm/yy"
              // selected={this.birthdate}
              onChange={this.handleInputChange}
            />
          </FormGroup>


          <FormGroup
            validationState={this.usernameValidation()}
          >
            <ControlLabel>Username</ControlLabel>
            <FormControl
              type="text"
              value={this.state.username}
              placeholder="Usename"
              name="username"
              onChange={this.handleInputChange}
            />
            <FormControl.Feedback />
          </FormGroup>

          <FormGroup
            validationState={this.passwordValidation()}
          >
            <ControlLabel>Password</ControlLabel>
            <FormControl
              type="password"
              value={this.state.password}
              name="password"
              onChange={this.handleInputChange}
            />
            <FormControl.Feedback />
          </FormGroup>
          <Button type="submit">Submit</Button>

        </form>
      </div>
    );
  }
}

export default FormInscription;
