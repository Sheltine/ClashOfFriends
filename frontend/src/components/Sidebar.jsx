import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

function handleSelect(selectedKey) {
    switch (selectedKey) {
      case '1':
       return <Redirect to="/register" />;
      case '3.1':
        return <p>coucou</p>;
      default:
        return null;
    }
  }
class Sidebar extends Component {
  render() {
    return (
      <Nav className="Navbar-style" stacked activeKey={1} onSelect={handleSelect}>
        <NavItem eventKey={1} href="/">
                Home
        </NavItem>
        <NavItem eventKey={2} href="/profile">
                Profile
        </NavItem>
        <NavDropdown title="Challenge" eventKey={3}>
          <MenuItem eventKey={3.1}>Verbal</MenuItem>
          <MenuItem eventKey={3.2}>Picture</MenuItem>
          <MenuItem eventKey={3.3} href="/votes">Votes</MenuItem>
          <MenuItem eventKey={3.3} href="/requested">Requested challenges</MenuItem>
        </NavDropdown>
      </Nav>
    );
  }
}

export default Sidebar;
