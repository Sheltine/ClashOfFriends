import Test from './Test'
import App from './App'
import React, { Component } from 'react';

import { Switch, Route } from 'react-router-dom'

// Ajouter ici les routes vers les pages
const Routing = () => (
  <main>
    <Switch>
      <Route exact path='/' component={App}/>
      <Route path='/loul' component={Test}/>
    </Switch>
  </main>
)

export default Routing