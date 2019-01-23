import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import { Query, ApolloProvider } from 'react-apollo';
import gql from 'graphql-tag';
import client from '../Util/ApolloClientManager';


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
              <ApolloProvider client={client}>
                <Query
                  query={gql`
                      {
                        stats(userId:"${JSON.parse(localStorage.getItem('currentUser')).id}"){
                          numberVotes,
                          numberWin,
                          numberLoose
                        }
                      }
                      
                    `}
                >
                  {({ loading, error, data }) => {
                        console.log(`Error: ${error}`);
                        console.log(data);
                      if (loading) return <p>Loading...</p>;
                      return (
                        <Table condensed hover className="CardTable-style">
                          <tbody>
                            <tr>
                              <td>Street Cred</td>
                              <td>{data.stats.numberVotes}</td>
                            </tr>
                            <tr>
                              <td>Won</td>
                              <td>{data.stats.numberWin}</td>
                            </tr>
                            <tr>
                              <td>Lost</td>
                              <td>{data.stats.numberLoose}</td>
                            </tr>
                          </tbody>
                        </Table>
                      );
                    }}
                </Query>
              </ApolloProvider>
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }
}

export default CardUser;
