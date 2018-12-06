import React, { Component } from 'react';
import { Nav, NavItem } from 'react-bootstrap'

function handleSelect(selectedKey) {
    alert(`selected ${selectedKey}`);
  }

class Sidebar extends Component {
  render() {
    return (
        <Nav className="Navbar-style" bsStyle="pills" stacked activeKey={1} onSelect={handleSelect}>
            <NavItem eventKey={1} href="/">
            Home
            </NavItem>
            <NavItem eventKey={2} href="/register">
            Profile
            </NavItem>
            <NavItem eventKey={3}>
            Challenge
            </NavItem>
        </Nav>
    );
  }
}

export default Sidebar;
