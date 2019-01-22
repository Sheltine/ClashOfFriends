import React, { Component } from 'react';
import '../App.css';


class VoteBox extends Component {
  render() {
    return (
      <div>
        <center>
          <div className="main">
            <p>
              <button className="add-button" type="button">&#x1f44d;</button>
            </p>
            <p>
              <h2>Challenger2</h2>
            </p>
            <p />
            <div>
              <div>
                <strong>42</strong><br />
                <span className="details">votes</span>
              </div>
            </div>
          </div>
        </center>
      </div>
    );
  }
}

export default VoteBox;
