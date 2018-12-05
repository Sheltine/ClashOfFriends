import React, { Component } from 'react';
import { Form, Button, Checkbox } from 'semantic-ui-react'



class FormConnexion extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleInputChange(event) {
    
    const value = event.target.value;
    const name = event.target.name;

    this.setState({
        [name]: value
    });
  }

  
    handleSubmit(event) {
        // Debug purpose
        alert("Firstname: " + this.state.username + ", lastname: " + this.state.password);
        event.preventDefault();
      }
    

  render() {
    return (
        <Form onSubmit={this.handleSubmit}>
            <Form.Field>
            <label>Username</label>
            <input name="username" value={this.state.username} onChange={this.handleInputChange} placeholder='Username' />
            </Form.Field>
            <Form.Field>
            <label>Password</label>
            <input type="password" name="password" value={this.state.password} onChange={this.handleInputChange} placeholder='Password' />
            </Form.Field>
            <Form.Field>
            <Checkbox label='I agree to the Terms and Conditions' />
            </Form.Field>
            <Button type='submit'>Submit</Button>
      </Form>            
    );
  }
}

export default FormConnexion;
