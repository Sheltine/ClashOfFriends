import React, { Component } from 'react';
import Sidebar from './components/Sidebar'
import PostsList from './components/PostGroup_timeline'
import NavbarHead from './components/Navbar_head'
import BoxChallenge from './components/Box_challenge'


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
              <div className="Sidebar-style">
                <Sidebar />
              </div>
            </div>
            <div className="col-md-offset-5">
              <div className="Challenge-style">
                <BoxChallenge />
              </div>
            </div>
            <div className="col-md-offset-3">
                <PostsList />
            </div>
          </div>
        </body>
       
      </div>
    );
  }
}

export default Timeline;
