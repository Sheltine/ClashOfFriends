import React, { Component } from 'react';
import { ButtonToolbar, ButtonGroup, Button, Glyphicon, Modal } from 'react-bootstrap';
import ChallengeForm from './Form_challenge';

class name extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
        show: false,
        category: 'Picture',
      };
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow(event) {
    this.setState({
      show: true,
      category: event.target.name,
    });
  }

  render() {
    return (
      <div>
        <h1>Challenge!</h1>
        <ButtonToolbar>
          <ButtonGroup>
            { /* Those types could be added later in the project. Let's start with the basics
            <Button name="Picture" bsSize="large" onClick={this.handleShow}>
              <Glyphicon glyph="camera" />
              <br />
              Picture
            </Button>
            <Button name="Sound" bsSize="large" onClick={this.handleShow}>
              <Glyphicon glyph="music" />
              <br />
              Sound
            </Button>
            */ }
            <Button name="Verbal" bsSize="large" onClick={this.handleShow}>
              <Glyphicon glyph="pencil" />
              <br />
              Verbal
            </Button>
            { /*
            <Button name="Video" bsSize="large" onClick={this.handleShow}>
              <Glyphicon glyph="film" />
              <br />
              Video
            </Button>
            */ }
          </ButtonGroup>
        </ButtonToolbar>
        <div>
          <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>New challenge</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ChallengeForm category={this.state.category} />
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.handleClose}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }
}

export default name;
