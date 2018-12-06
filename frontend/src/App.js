import React, { Component } from 'react';
import logo from './logo.svg';
import { Link } from 'react-router-dom'
import Connexion from './components/Form_connexion'
import Inscription from './components/Form_inscription'

import 'semantic-ui-css/semantic.min.css';
class App extends Component {
  render() {
    return (
     
      <div className="App">

        <header className="App-header">
        
          <p>
            Please connect to ayour account.
            <Link to='/loul'>LOUL</Link>
          </p>
        </header>
        <body>
        
        <div className="row">
        <div className="col-md-6 col-md-offset-5">
        <h2>Connexion</h2>
        <p>Not registered yet? <Link to='/register'>Register</Link></p>
        <Connexion />
        
         </div>
        </div>
        </body>
       
      </div>
    );
  }
}

export default App;
