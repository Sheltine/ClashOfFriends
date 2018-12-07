import React, { Component } from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap'
import PostTimeline from './Post_timeline'
// Passé en paramètre: liste d'id récupérés dans la main page ?

class name extends Component {
  render() {
    return (
        <div className="PostGroup-div">
                <DropdownButton title="Sort">
                    <MenuItem eventKey="1">All</MenuItem>
                    <MenuItem eventKey="2">Only me</MenuItem>
                    <MenuItem eventKey="3">Only friends</MenuItem>
                </DropdownButton>
                <PostTimeline player1="Marina" player2="Deborah" category="verbal" content="c'est un clash lol" gameResult="won" />
                <PostTimeline player1="Léo" player2="Julien" category="picture" content="https://www.royalcanin.fr/wp-content/uploads/Golden-Retriever-Images-Photos-Animal-000120.png" gameResult="won" />
        </div>
    );
  }
}

export default name;
