import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import VoteBox from './Vote_box';
import '../App.css';
import NavBarHead from './Navbar_head';


class VotePage extends Component {
  render() {
    return (
      <div>
        <Row className="show-grid">
          <Col md={6} mdPush={5}>
            <VoteBox />
          </Col>
          <Col md={6} mdPull={5}>
            <VoteBox />
          </Col>
        </Row>
      </div>
    );
  }
}

export default VotePage;
