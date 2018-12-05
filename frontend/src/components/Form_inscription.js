import React, { Component } from 'react';
import { Form, Button, Checkbox } from 'semantic-ui-react'
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";



class FormInscription extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            firtsname: "",
            lastname: "",
            email: "",
            birthdate: new Date(),
            username: "",
            password: ""
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getDate = this.getDate.bind(this);

  }

  handleInputChange(event) {
    
    const value = event.target.value;
    const name = event.target.name;
    this.setState({
        [name]: value
    });
  }

  getDate(date) {
    this.setState({
        birthdate: date
    });
  }

  
    handleSubmit(event) {
        // Debug purpose
        alert("Firstname: " + this.state.birthdate + ", lastname: " + this.state.password);
        event.preventDefault();
      }
    

  render() {
    return (
        <Form onSubmit={this.handleSubmit}>
            <Form.Field>
            <label>First name</label>
            <input name="firstname" value={this.state.firstname} onChange={this.handleInputChange} placeholder='First nane' />
            </Form.Field>
            <Form.Field>
            <label>Last name</label>
            <input name="username" value={this.state.lastname} onChange={this.handleInputChange} placeholder='Last name' />
            </Form.Field>
            <Form.Field>
            <label>Email Address</label>
            <input name="username" value={this.state.email} onChange={this.handleInputChange} placeholder='Email address' />
            </Form.Field>
            <Form.Field>


            <Form.Field>
            <label>Birthdate</label>
            <DatePicker name="birthdate" value={this.state.birthdate}
                selected={this.birthdate}
                onChange={this.getDate} />
            </Form.Field>
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

export default FormInscription;
