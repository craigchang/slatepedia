import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Header from './Header/Header'
import App from './App'
import Materials from './Materials/Materials'
import MaterialsDetail from './MaterialsDetail/MaterialsDetail';
import Recipes from './Recipes/Recipes';
import RecipesDetail from './RecipesDetail/RecipesDetail';
import Armor from './Armor/Armor';
import ArmorDetail from './ArmorDetail/ArmorDetail';
import Food from './Food/Food'
import FoodDetail from './FoodDetail/FoodDetail';

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"


// const MaterialsPage = (props) => {
//   return (
//     <ProductPage 
//       toggleSidebarOn={this.toggleSidebarOn.bind(this)}
//       {...props}
//     />
//   );
// }

const Main = () => (
  <main>
    <Header/>
    <Switch>
      <Route path='/materials/:id' component={MaterialsDetail} />
      <Route path='/materials' component={Materials} />
      <Route path='/recipes/:id' component={RecipesDetail} />
      <Route path='/recipes' component={Recipes} />
      <Route path='/armor/:id' component={ArmorDetail} />
      <Route path='/armor' component={Armor} />
      <Route path='/food/:id' component={FoodDetail} />
      <Route path='/food' component={Food} />
      <Route path='/' component={App}/>
    </Switch>
  </main>
)

export default Main
