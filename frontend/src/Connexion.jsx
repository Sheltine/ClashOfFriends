import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import ConnexionForm from './components/Form_connexion';

class Connexion extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <AppBar title="Connexion" showMenuIconButton={false} />
        <div className="App">
          <div className="row">
            <div className="col-md-offset-5">
              <ConnexionForm />
              <p>Not registered yet? </p>
              <Link to="/register">Register</Link>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Connexion;
