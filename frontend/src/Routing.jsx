import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Connexion from './Connexion';
import Register from './Register';
import Timeline from './Timeline';

// Ajouter ici les routes vers les pages
const Routing = () => (
  <main>
    <Switch>
      <Route exact path="/" component={Timeline} />
      <Route path="/register" component={Register} />
      <Route path="/connexion" component={Connexion} />
    </Switch>
  </main>
);

export default Routing;
