import React, { Component } from 'react';
import _ from 'lodash';
import DataDetailTableView from '../Other/DataDetailTableView/DataDetailTableView';
import IconContainer from '../Other/IconContainer/IconContainer';

import './WeaponsDetail.css';

class WeaponsDetail extends Component {
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

  showDetailView(weapon) {
    return (
      <div>
        <DataDetailTableView>
          <tbody>
            <tr>
              <td>Icon</td>
              <td>
                <IconContainer propertyName={weapon.name} folderName={"weapons"} />
              </td>
            </tr>
            <tr>
              <td>Attack Power Base</td>
              <td>{weapon.durabilityBase}</td>
            </tr>
            <tr>
              <td>Attack Power Bonus 1</td>
              <td>{weapon.attackPowerBonusMin} <i className="fa fa-arrow-right" aria-hidden="true"></i> {weapon.attackPowerBonusMax}</td>
            </tr>
            <tr>
              <td>Attack Power Bonus 2</td>
              <td>{weapon.attackPowerBonus2Min} <i className="fa fa-arrow-right" aria-hidden="true"></i> {weapon.attackPowerBonus2Max}</td>
            </tr>
            <tr>
              <td>Durability Base</td>
              <td>{weapon.durabilityBase}</td>
            </tr>
            <tr>
              <td>Durability Bonus 1</td>
              <td>{weapon.durabilityBonusMin} <i className="fa fa-arrow-right" aria-hidden="true"></i> {weapon.durabilityBonusMax}</td>
            </tr>
            <tr>
              <td>Durability Bonus 2</td>
              <td>{weapon.durabilityBonus2Min} <i className="fa fa-arrow-right" aria-hidden="true"></i> {weapon.durabilityBonus2Max}</td>
            </tr>
            <tr>
              <td>Throw Distance Effect</td>
              <td>{weapon.throwDistanceEffect}</td>
            </tr>
            <tr>
              <td>Throw Distance Base</td>
              <td>{weapon.throwDistanceBase}</td>
            </tr>
            <tr>
              <td>Throw Distance Bonus</td>
              <td>{weapon.throwDistanceMin} <i className="fa fa-arrow-right" aria-hidden="true"></i> {weapon.throwDistanceMax}</td>
            </tr>
            <tr>
              <td>Availabilities</td>
              <td>
                {weapon.availabilities != null && weapon.availabilities.map((availability, index) => (
                  <p key={index}>{availability}</p>
                ))}
              </td>
            </tr>
          </tbody>
        </DataDetailTableView>
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
          <h1 className="page-header">Weapon Not Found :(</h1>
        );
      else
        view = (
          <div>
            <h1 className="page-header">{this.state.json.name}</h1>
            {this.showDetailView(this.state.json)}
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

export default WeaponsDetail;