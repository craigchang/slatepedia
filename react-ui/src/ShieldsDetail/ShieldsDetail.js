import React, { Component } from 'react';
import DataDetailTableView from '../Other/DataDetailTableView/DataDetailTableView';
import IconContainer from '../Other/IconContainer/IconContainer';
import _ from 'lodash';

import './ShieldsDetail.css';

class ShieldsDetail extends Component {
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

  showDetailView(shield) {
    return (
      <div>
        <DataDetailTableView>
          <tbody>
            <tr>
              <td>Icon</td>
              <td>
                <IconContainer propertyName={shield.name} folderName={"shields"} />
              </td>
            </tr>
            <tr>
              <td>Description</td>
              <td><i className="fa fa-book"></i> {shield.description}</td>
            </tr>
            <tr>
              <td>Durability</td>
              <td><i className="fa fa-shield" aria-hidden="true"></i> {shield.durability}</td>
            </tr>
            <tr>
              <td>Parry Power</td>
              <td><i className="fa fa-superpowers" aria-hidden="true"></i> {shield.parryPower}</td>
            </tr>
            <tr>
              <td>Availabilities</td>
              <td>
                {shield.availabilities != null && shield.availabilities.map((availability, index) => (
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
          <h1 className="page-header">Shield Not Found :(</h1>
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

export default ShieldsDetail;