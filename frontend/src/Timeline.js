import React, { Component } from 'react';
import logo from './logo.svg';
import { Link } from 'react-router-dom'
import Connexion from './components/Form_connexion'
import Inscription from './components/Form_inscription'
import Sidebar from './components/Sidebar'
import NavbarHead from './components/Navbar_head'

import 'semantic-ui-css/semantic.min.css';
class Timeline extends Component {
  render() {
    return (
     
      <div className="App">

        <body>
        <div className="row">
          <NavbarHead />
        </div>
        <div className="row">
          <div className="col-md-2">
            <Sidebar />
          </div>
          <div className="col-md-offset-5">

          
         </div>
        </div>
        </body>
       
      </div>
    );
  }
}

export default Timeline;
