import React, { Component } from 'react';
import logo from './logo.svg';
import { Link } from 'react-router-dom'
import Connexion from './components/Form_connexion'
import Inscription from './components/Form_inscription'

import 'semantic-ui-css/semantic.min.css';
class Register extends Component {
  render() {
    return (
     
      <div className="App">

        <body>
        <div className="row">
        <div className="col-md-6 col-md-offset-5">
        <h1>Register</h1>
        <p>Already have an account? <Link to='/'>Connect</Link></p>
        <Inscription />
        
        </div>
        </div>
        </body>
      </div>
    );
  }
}

export default Register;
