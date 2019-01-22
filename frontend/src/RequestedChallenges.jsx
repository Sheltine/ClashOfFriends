import React, { Component } from 'react';
import { Redirect } from 'react-router';
import Sidebar from './components/Sidebar';
import PostsList from './components/PostGroup_timeline';
import NavbarHead from './components/Navbar_head';
import BoxChallenge from './components/Box_challenge';

console.log('CATEGORIES: ', JSON.parse(localStorage.getItem('categories')));
class Timeline extends Component {
  render() {
    if (localStorage.getItem('currentUser') && localStorage.getItem('userToken')) {
      return (
        <div className="App">
          <body>
            <div className="row">
              <NavbarHead />
            </div>
            <div className="col-md-2 Sidebar-style">
              <Sidebar />
            </div>
          </body>

        </div>
      );
    }
    return <Redirect to="/connexion" />;
  }
}

export default Timeline;
