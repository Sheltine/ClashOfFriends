import React, { Component } from 'react';
import { ButtonToolbar, ButtonGroup, Button, Glyphicon } from 'react-bootstrap';


class name extends Component {
  render() {
    return (
      <div>
        <h1>Challenge!</h1>
        <ButtonToolbar>
          <ButtonGroup>
            <Button bsSize="large">
              <Glyphicon glyph="camera" />
              <br />
Picture
            </Button>
            <Button bsSize="large">
              <Glyphicon glyph="music" />
              <br />
Sound
            </Button>
            <Button bsSize="large">
              <Glyphicon glyph="pencil" />
              <br />
Verbal
            </Button>
            <Button bsSize="large">
              <Glyphicon glyph="film" />
              <br />
Video
            </Button>
          </ButtonGroup>
        </ButtonToolbar>
      </div>
    );
  }
}

export default name;
