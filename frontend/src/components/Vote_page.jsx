import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import Divider from '@material-ui/core/Divider';
import VoteBox from './Vote_box';
import '../App.css';
import NavbarHead from './Navbar_head';


class VotePage extends Component {
  render() {
    return (
      <div>
        <div className="row">
          <NavbarHead />
        </div>
        <Row className="show-grid">
          <Col md={5} mdPush={1}>
            <VoteBox />
          </Col>
          <Col md={2}>
            <center>
              <font size="20">
                <br />
                <br />
                <br /> V.S.
              </font>
            </center>
          </Col>
          <Col md={5} mdPull={1}>
            <VoteBox />
          </Col>
        </Row>
        <br />
        <br />
        <Divider variant="middle" />
        <br />
        <br />
        <Row className="show-grid">
          <Col md={5} mdPush={1}>
            <VoteBox />
          </Col>
          <Col md={2}>
            <center>
              <font size="20">
                <br />
                <br />
                <br /> V.S.
              </font>
            </center>
          </Col>
          <Col md={5} mdPull={1}>
            <VoteBox />
          </Col>
        </Row>
      </div >
    );
  }
}

export default VotePage;
