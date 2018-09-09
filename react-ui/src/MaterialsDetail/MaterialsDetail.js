import React, { Component } from 'react';
import _ from 'lodash';
import classnames from 'classnames';

import '../Materials/Materials.css';

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
    let imageName = material.name.replace(/ /g, "-").replace(/'/g,"").toLowerCase();
    return (
      <div>
        <div className="table-responsive">
          <table className="table table-striped">
            <tbody>
              <tr>
                <td>Icon</td>
                <td><img alt={imageName} className="resource-icon" src={`/img/materials/${imageName}.png`}/></td>
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
                <td>HP Recovery</td>
                <td><i className="fa fa-heart" aria-hidden="true"></i> {material.hpRecovery} HP</td>
              </tr>
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
                  {material.availabilities != null && material.availabilities.map((availability, index) => (
                    <p key={index}><i className="fa fa-map-marker" aria-hidden="true"></i> {availability.name}</p>
                  ))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        { !material.recipes  ? '' : (
          <div>
            <h2 className="page-header">Recipes</h2>
            <div className="table-responsive">
              <table className="table table-striped">
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
                        <div className={classnames('sprite', recipe.cssClassName)}></div>
                      </td>
                      <td>
                        <i className="fa fa-cutlery" aria-hidden="true"></i> <a href={"/recipes/" + recipe.id}>{recipe.name}</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        { !material.armorList ? '' : (
          <div>
            <h2 className="page-header">Armor</h2>
            <div className="table-responsive">
              <table className="table table-striped">
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
                        <div className={classnames('sprite', armor.cssClassName)}></div>
                      </td>
                      <td>
                        <i className="fa fa-male" aria-hidden="true"></i> <a href={"/armor/" + armor.id}>{armor.name}</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        { !material.monsterList ? '' : (
          <div>
            <h2 className="page-header">Dropped by Monsters</h2>
            <div className="table-responsive">
              <table className="table table-striped">
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
                        <img src={"/img/monsters/" + monster.cssClassName + ".jpg"} width="48" height="48"/>
                      </td>
                      <td>
                        <i className="fa fa-optin-monster" aria-hidden="true"></i> <a href={"/monsters/" + monster.id}>{monster.name}</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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