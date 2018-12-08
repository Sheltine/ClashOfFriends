import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ConnexionForm from './components/Form_connexion';
import 'semantic-ui-css/semantic.min.css';

class Connexion extends Component {
  render() {
    return (
      <div className="App">
        <body>
          <div className="row">
            <div className="col-md-offset-5">
              <h2>Connexion</h2>
              <p>Not registered yet? <Link to="/register">Register</Link></p>
              <ConnexionForm />
            </div>
          </div>
        </body>
      </div>
    );
  }
}

export default Connexion;
