import React, { Component } from 'react';
import logo from './logo.svg';
import { Link } from 'react-router-dom'
import Connexion from './components/Form_connexion'
import Inscription from './components/Form_inscription'
import Sidebar from './components/Sidebar'
import NavbarHead from './components/Navbar_head'

import 'semantic-ui-css/semantic.min.css';
class App extends Component {
  render() {
    return (
     
      <div className="App">

        <body>

        <div className="row">

          <div className="col-md-offset-5">
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
