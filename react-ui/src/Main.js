import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Header from './Header/Header'
import App from './App'
import Materials from './Materials/Materials'
import MaterialsDetail from './MaterialsDetail/MaterialsDetail';

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
const Main = () => (
  <main>
    <Header/>
    <Switch>
      <Route path='/materials/:id' component={MaterialsDetail} />
      <Route path='/materials' component={Materials}/>
      <Route path='/' component={App}/>
    </Switch>
  </main>
)

export default Main
