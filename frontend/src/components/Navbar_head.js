import React, { Component } from 'react';
import { Navbar, FormGroup, FormControl, Button } from 'react-bootstrap'


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
      </FormGroup>{' '}
      <Button type="submit">Submit</Button>
    </Navbar.Form>
  <Navbar.Collapse>
    <Navbar.Text pullRight>John Doe
    <br/> Logout
    </Navbar.Text>
  </Navbar.Collapse>
</Navbar>
    );
  }
}

export default NavbarHead;


