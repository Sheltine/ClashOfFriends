import React, { Component } from 'react';
import { Redirect } from 'react-router';
import NavbarHead from './components/Navbar_head';
import Sidebar from './components/Sidebar';
import FriendList from './components/List_friends';

class Profile extends Component {
    render() {
        if (localStorage.getItem('currentUser') && localStorage.getItem('userToken')) {
          return (
            <div className="App">
              <body>
                <div className="row">
                  <NavbarHead />
                </div>
                <div className="row">
                  <div className="col-md-2">
                    <div className="Sidebar-style">
                      <Sidebar />
                    </div>
                  </div>
                  <div className="col-md-offset-3">
                    <div className="row">
                      {console.log(JSON.parse(localStorage.getItem('currentUser')))}
                      <FriendList />
                    </div>
                  </div>
                </div>
              </body>
            </div>
          );
        }
        return <Redirect to="/connexion" />;
      }
}

export default Profile;
