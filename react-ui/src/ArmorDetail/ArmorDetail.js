import React, { Component } from 'react';
import IconContainer from '..//Other/IconContainer/IconContainer';
import DataDetailTableView from '../Other/DataDetailTableView/DataDetailTableView';

import './ArmorDetail.css';

class ArmorDetail extends Component {
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

  showArmorDetailView(armor) {
    return (
      <div>
        <DataDetailTableView>
          <tbody>
            <tr>
              <td>Icon</td>
              <td>
                <IconContainer propertyName={armor.name} folderName={"armor"} />
              </td>
            </tr>
            <tr>
              <td>Description</td>
              <td><i className="fa fa-book" aria-hidden="true"></i> {armor.description}</td>
            </tr>
            <tr>
              <td>Defense</td>
              <td><i className="fa fa-shield" aria-hidden="true"></i> {armor.defense}</td>
            </tr>
            <tr>
              <td>Sell Price</td>
              <td><i className="fa fa-diamond" aria-hidden="true"></i> {armor.sellPrice === 0 ? '-' : armor.sellPrice + ' Rupees'} </td>
            </tr>
            <tr>
              <td>Body Part</td>
              <td><i className="fa fa-user" aria-hidden="true"></i> {armor.bodyPart}</td>
            </tr>
            <tr>
              <td>Added Effect</td>
              <td><i className="fa fa-long-arrow-up"></i> {armor.addedEffect === '' ? '-' : armor.addedEffect}</td>
            </tr>
            <tr>
              <td>Set Bonus</td>
              <td><i className="fa fa-plus" aria-hidden="true"></i> {armor.setBonus === '' ? '-' : armor.setBonus}</td>
            </tr>
            <tr>
              <td>Availability</td>
              <td><i className="fa fa-map-marker" aria-hidden="true"></i> {armor.availability}</td>
            </tr>
          </tbody>
        </DataDetailTableView>

        { !armor.armorUpgrades ? '' : (
          <div>
            <h2 className="page-header">Armor Upgrades</h2>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <td><b>Level</b></td>
                    <td><b>Required Materials</b></td>
                    <td><b>Defense</b></td>
                  </tr>
                </thead>
                <tbody>
                  { armor.armorUpgrades.map((armorUpgrade, index) => (
                    <tr key={index}>
                      <td>{armorUpgrade.level}</td>
                      <td>
                        { armorUpgrade.armorMaterials.map((armorMaterial, index2) => (
                          <React.Fragment key={index2}>
                            { armorMaterial.material === null ? '' : (
                              <div key={index2}>
                                <div style={{'display': 'inline-block', 'verticalAlign': 'middle'}}>
                                  <IconContainer propertyName={armorMaterial.material && armorMaterial.material.name} folderName={"materials"} />
                                </div>
                                <span>
                                  <span><a href={"/materials/" + armorMaterial.material.id}>{armorMaterial.material.name} </a> x {armorMaterial.quantity}</span>
                                </span>
                              </div>
                            )}
                          </React.Fragment>
                        ))}
                      </td>
                      <td>{armorUpgrade.defense}</td>
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
          <h1 className="page-header">Armor Not Found :(</h1>
        );
      else
        view = (
          <div>
            <h1 className="page-header">{this.state.json.name}</h1>
            {this.showArmorDetailView(this.state.json)}
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

export default ArmorDetail;