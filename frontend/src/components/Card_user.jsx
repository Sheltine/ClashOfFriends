import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';

const { SERVER_DATE_FORMAT } = require('../config.js');

const user = JSON.parse(localStorage.getItem('currentUser'));
class CardUser extends Component {
  render() {
    return (
      <Card>
        <CardActionArea>
          <CardMedia
            image="/img/zucky.png"
            title="Contemplative Reptile"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              <center>{user.username}</center>
            </Typography>
            <Typography>
              <div className="pull-right"><img alt="Profile pic" className="PicChallenge-icon" src="https://www.royalcanin.fr/wp-content/uploads/Golden-Retriever-Images-Photos-Animal-000120.png" height="150em" width="150em" /></div>
            </Typography>
            <Typography component="i">
              <center>Player since {moment(user.createdAt, SERVER_DATE_FORMAT).format('LL')}</center>
            </Typography>
            <Typography component="p">
              <Table condensed hover className="CardTable-style">
                <tbody>
                  <tr>
                    <td>Street Cred</td>
                    <td>270</td>
                  </tr>
                  <tr>
                    <td>Won</td>
                    <td>150</td>
                  </tr>
                  <tr>
                    <td>Lost</td>
                    <td>15</td>
                  </tr>
                </tbody>
              </Table>
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="small" color="primary">
            Share
          </Button>
          <Button size="small" color="primary">
            Learn More
          </Button>
        </CardActions>
      </Card>
    );
  }
}

export default CardUser;
