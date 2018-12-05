import React, { Component } from 'react';
import logo from './logo.svg';
import { Link } from 'react-router-dom'
import './App.css';
import Routing from './Routing'


class Main extends Component {
  render() {
    return (
        <div>
        <Routing />
      </div>
    );
  }
}

export default Main;
