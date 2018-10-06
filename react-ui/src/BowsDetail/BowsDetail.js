import React, { Component } from 'react';
import DataDetailTableView from '../Other/DataDetailTableView/DataDetailTableView';
import IconContainer from '../Other/IconContainer/IconContainer';

import './BowsDetail.css';

class BowsDetail extends Component {
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

  showDetailView(bow) {
    return (
      <div>
        <DataDetailTableView>
          <tbody>
            <tr>
              <td>Icon</td>
              <td>
                <IconContainer propertyName={bow.name} folderName={"weapons"} />
              </td>
            </tr>
            <tr>
              <td>Attack Power</td>
              <td><i className="fa fa-superpowers" aria-hidden="true"></i> {bow.attackPower}</td>
            </tr>
            <tr>
              <td>Durability</td>
              <td><i className="fa fa-shield" aria-hidden="true"></i> {bow.durability}</td>
            </tr>
            <tr>
              <td>Range</td>
              <td><i className="fa fa-bullseye" aria-hidden="true"></i> {bow.range}</td>
            </tr>
            <tr>
              <td>Multiple Arrows</td>
              <td><i className="fa fa-arrows" aria-hidden="true"></i> {bow.multipleArrows}</td>
            </tr>

            <tr>
              <td>Quick Shot</td>
              <td>
                <i className="fa fa-times" aria-hidden="true"></i> {bow.quickShot ? "Yes" : "No"}
              </td>
            </tr>
            
            <tr>
              <td>Availabilities</td>
              <td>
                {bow.availabilities != null && bow.availabilities.map((availability, index) => (
                  <p key={index}><i className="fa fa-map-marker" aria-hidden="true"></i> {availability}</p>
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
          <h1 className="page-header">Bow Not Found :(</h1>
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

export default BowsDetail;