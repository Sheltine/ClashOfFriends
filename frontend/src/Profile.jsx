import React, { Component } from 'react';
import { Redirect } from 'react-router';
import NavbarHead from './components/Navbar_head';
import Sidebar from './components/Sidebar';
import FriendList from './components/List_friends';
import CardUser from './components/Card_user';
import UserInfo from './components/List_user_info';

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
                  <div className="col-md-2">
                    <div className="Card-style">
                      <CardUser />
                    </div>
                    
                  </div>
                  <div className="col-md-offset-4">
                  <div className="UserInfo-style">
                      <UserInfo />
                    </div>
                  </div>
                  <div className="vspace">
                    <FriendList />
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
