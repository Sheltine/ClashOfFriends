import React, { Component } from 'react';
import { Nav, NavItem, DropdownButton, MenuItem } from 'react-bootstrap';

function handleSelect(selectedKey) {
    alert(selectedKey);
    // do something
  }

class Sidebar extends Component {
  render() {
    return (
      <Nav className="Navbar-style" stacked activeKey={1} onSelect={handleSelect}>
        <NavItem eventKey={1} href="/">
                Home
        </NavItem>
        <NavItem eventKey={2} href="/register">
                Profile
        </NavItem>
        <NavItem eventKey={3}>
          <DropdownButton
            title="Challenge"
          >
            <MenuItem eventKey="1">Verbal</MenuItem>
            <MenuItem eventKey="2">Picture</MenuItem>
          </DropdownButton>
        </NavItem>
      </Nav>
    );
  }
}

export default Sidebar;
