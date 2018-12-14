import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, FormGroup, FormControl, Button } from 'react-bootstrap';

function disconnect() {
  // localStorage.clear();
  sessionStorage.clear();
  console.log('déconnexion');
}
class NavbarHead extends Component {
  render() {
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#home">ClashOfFriends</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Form pullLeft>
          <FormGroup>
            <FormControl type="text" placeholder="Search" />
          </FormGroup>
          {''}
          <Button type="submit">Submit</Button>
        </Navbar.Form>
        <Navbar.Collapse>
          <Navbar.Text pullRight>
            {JSON.parse(localStorage.getItem('currentUser')).username}
            <br />
            <Link onClick={disconnect()} to="/connexion">Logout</Link>
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default NavbarHead;
