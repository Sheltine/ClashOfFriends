import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Inscription from './components/Form_inscription';
import 'semantic-ui-css/semantic.min.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';

class Register extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <AppBar title="Register" showMenuIconButton={false} />
          <body>
            <div className="row">
              <div className="col-md-6 col-md-offset-5">
                <Inscription />
                <p>Already have an account? <Link to="/connexion">Connect</Link></p>
              </div>
            </div>
          </body>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Register;
