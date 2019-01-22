import React, { Component } from 'react';
import '../App.css';


class VoteBox extends Component {
  render() {
    return (
      <div>
        <div class="main">
          <p>
            <button class="add-button" >&#x1f44d;</button>
          </p>
          <p>
            <h2>Challenger1</h2>
          </p>
          <p>
          </p>
          <div>
            <div>
              <strong>2k</strong><br />
              <span class="details">votes</span>
            </div>
          </div>
        </div> 
      </div>
    );
  }
}

export default VoteBox;
