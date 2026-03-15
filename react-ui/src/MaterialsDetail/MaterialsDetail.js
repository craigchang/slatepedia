import React, { Component } from 'react';
import IconContainer from '../CommonComponents/IconContainer/IconContainer';
import DataDetailTableView from '../CommonComponents/DataDetailTableView/DataDetailTableView';
import '../Armor/ArmorSprites.css';
import '../Materials/MaterialsSprites.css';
import '../Food/FoodSprites.css';
import '../Recipes/RecipesSprites.css';
import './MaterialsDetail.css';

class MaterialsDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      json: null,
      fetching: true
    };
  }

  componentDidMount() {
    fetch('/api' + this.props.location.pathname)
      .then(response => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        this.setState({
          json: json,
          fetching: false
        });
      }).catch(e => {
        this.setState({
          json: null,
          fetching: false
        });
      });
  }

  showMaterialDetailView(material) {
    return (
      <div className="material-detail">
        <DataDetailTableView>
          <tbody>
            <tr>
              <td>Icon</td>
              <td><IconContainer propertyName={material.name} folderName={material.cssClassName ? "food" : "materials"} cssClassName={material.cssClassName} spriteSheet={material.cssClassName ? "materials" : null} /></td>
            </tr>
            <tr>
              <td>Description</td>
              <td><i className="fa fa-book"></i> {material.description}</td>
            </tr>
            <tr>
              <td>Type</td>
              <td><i className="fa fa-tag"></i> {material.type}</td>
            </tr>
            <tr>
              <td>Sell Price</td>
              <td><i className="fa fa-diamond" aria-hidden="true"></i> {material.sellPrice} Rupees</td>
            </tr>
            <tr>
              <td title="1 HP recovery = 1/4 heart recovery">HP Recovery</td>
              <td>
                <i className="fa fa-heart" aria-hidden="true"></i> {material.hpRecovery} HP
              </td>
            </tr>
            {/* <tr>
              <td>Health Bar Recovery</td>
              <td><HealthBar health={material.hpRecovery} /></td>
            </tr> */}
            <tr>
              <td>Category</td>
              <td><i className="fa fa-tags"></i> {material.category == null ? 'None' : material.category.name}</td>
            </tr>
            <tr>
              <td>Potency Grade</td>
              <td><i className="fa fa-thermometer-full" aria-hidden="true"></i> {material.potencyGrade === '' ? 'None': material.potencyGrade}</td>
            </tr>
            <tr>
              <td>Duration Factor</td>
              <td><i className="fa fa-clock-o" aria-hidden="true"></i> {material.durationFactor} seconds</td>
            </tr>
            <tr>
              <td>Availabilities</td>
              <td>
                { material.availabilities && material.availabilities.map((availability, index) => (
                  <p key={index}><i className="fa fa-map-marker" aria-hidden="true"></i> {availability}</p>
                ))}
              </td>
            </tr>
          </tbody>
        </DataDetailTableView>

        { !material.recipes  ? '' : (
          <div>
            <h2 className="page-header">Recipes</h2>
            <DataDetailTableView>
              <thead>
                <tr>
                  <td><b>Icon</b></td>
                  <td><b>Name</b></td>
                </tr>
              </thead>
              <tbody>
                {material.recipes.map((recipe, index) => (
                  <tr key={index}>
                    <td>
                      <IconContainer propertyName={recipe.name} folderName={"food"} cssClassName={recipe.cssClassName} spriteSheet={"food"} small/>
                    </td>
                    <td style={{'vertical-align': 'middle'}}>
                      <i className="fa fa-cutlery" aria-hidden="true"></i> <a href={"/recipes/" + recipe.id}>{recipe.name}</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataDetailTableView>
          </div>
        )}

        { !material.armorList ? '' : (
          <div>
            <h2 className="page-header">Armor</h2>
            <DataDetailTableView>
              <thead>
                <tr>
                  <td><b>Icon</b></td>
                  <td><b>Name</b></td>
                </tr>
              </thead>
              <tbody>
                {material.armorList.map((armor, index) => (
                  <tr key={index}>
                    <td>
                      <IconContainer propertyName={armor.name} folderName={"armor"} cssClassName={armor.cssClassName} spriteSheet="bodyarmor" />
                    </td>
                    <td>
                      <i className="fa fa-male" aria-hidden="true"></i> <a href={"/armor/" + armor.id}>{armor.name}</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataDetailTableView>
          </div>
        )}

        { !material.monsterList ? '' : (
          <div>
            <h2 className="page-header">Dropped by Monsters</h2>
            <DataDetailTableView>
              <thead>
                <tr>
                  <td><b>Icon</b></td>
                  <td><b>Name</b></td>
                </tr>
              </thead>
              <tbody>
                {material.monsterList.map((monster, index) => (
                  <tr key={index}>
                    <td>
                      <IconContainer propertyName={monster.name} folderName={"monsters"} />
                    </td>
                    <td>
                      <i className="fa fa-optin-monster" aria-hidden="true"></i> <a href={"/monsters/" + monster.id}>{monster.name}</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataDetailTableView>
          </div>
        )}
      </div>
    )
  }

  render() {
    let view = null;

    if (this.state.fetching)
      view = '';
    else {
      if (this.state.json == null)
        view = (
          <h1 className="page-header">Material Not Found :(</h1>
        );
      else
        view = (
          <div>
            <h1 className="page-header">{this.state.json.name}</h1>
            {this.showMaterialDetailView(this.state.json)}
          </div>
        );
    }

    return (
      <div className="container">
        {view}
      </div>
    )
  }
}

export default MaterialsDetail;