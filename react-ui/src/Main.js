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
      <Route 
        path='/materials' 
        render={(props) => 
          <Materials 
            test="test"
            filterSettings={[
              {"dataName": null, "headerName": "Icon", "isSortable": false, "isFilterable": false},
              {"dataName": "name", "headerName": "Name", "dataType": "string", "isSortable": true, "isFilterable": true}, 
              {"dataName": "type", "headerName": "Type", "dataType": "string", "isSortable": true, "isFilterable": true}, 
              {"dataName": "sellPrice", "headerName": "Sell Price", "dataType": "integer", "isSortable": true, "isFilterable": true}, 
              {"dataName": "hpRecovery", "headerName": "HP Recovery", "dataType": "integer", "isSortable": true, "isFilterable": true},
              {"dataName": "category.name", "headerName": "Category", "dataType": "string", "isSortable": true, "isFilterable": true}, 
              {"dataName": "potencyGrade", "headerName": "Potency Grade", "dataType": "string", "isSortable": true, "isFilterable": true}, 
              {"dataName": "durationFactor", "headerName": "Duration Factor", "dataType": "integer", "isSortable": true, "isFilterable": true},
              {"dataName": null, "headerName": "Availabilities", "isSortable": false, "isFilterable": false}
            ]} 
            />}
        />
      <Route path='/' component={App}/>
    </Switch>
  </main>
)

export default Main
