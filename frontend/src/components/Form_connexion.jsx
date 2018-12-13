import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';

const serverUrl = 'http://localhost:4000';
const client = new ApolloClient({
  uri: serverUrl,
});

class FormConnexion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleInputChange(event) {
    const value = event.target.value;
    const name = event.target.name;

    this.setState({
        [name]: value,
    });
  }

    handleSubmit(event) {
        // Debug purpose
        // eslint-disable-next-line react/destructuring-assignment

        client
            .query({
                query: gql`
                  {
                    auth(username:"${this.state.username}", password:"${this.state.password}"){
                      token, user{
                        id, username
                      }
                    }
                  }
                `,
            }).then(response => console.log(response.data.auth.token));

        event.preventDefault();
      }

  render() {
    return (

      <div className="Centered-form">
        <form onSubmit={this.handleSubmit}>
          <FormGroup>
            <ControlLabel>Username</ControlLabel>
            <FormControl
              type="text"
              value={this.state.username}
              placeholder="Username"
              name="username"
              onChange={this.handleInputChange}
            />
            <FormControl.Feedback />
          </FormGroup>

          <FormGroup>
            <ControlLabel>Password</ControlLabel>
            <FormControl
              type="password"
              value={this.state.password}
              placeholder="Password"
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

export default FormConnexion;
