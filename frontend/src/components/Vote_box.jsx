import React, { Component } from 'react';
import '../App.css';


class VoteBox extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      challengerName: 'Challenger',
      nbVotes: 0,
    };
    this.addVote = this.addVote.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  addVote() {
    // TODO : DB requests and access
    this.setState({nbVotes: this.state.nbVotes + 1 });
  }

  render() {
    return (
      <div>
        <center>
          <div className="main">
            <p>
              <button className="add-button" type="button" onClick={this.addVote}>&#x1f44d;</button>
            </p>
            <p>
              <h2>{this.state.challengerName}</h2>
            </p>
            <p />
            <div>
              <div>
                <strong>{this.state.nbVotes}</strong><br />
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
