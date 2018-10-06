import React, { Component } from 'react';
import DataView from '../Other/DataView/DataView';

import './Weapons.css';

class Weapons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      json: null,
      jsonOriginal: null,
      fetching: true,
      sortBy: "",
      sortOrder: "",
      filterButtonCollapsed: true,
      dataView: 'grid'
    };
  }

  componentDidMount() {
    fetch('/api/weapons')
      .then(response => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        this.setState({
          json: json,
          jsonOriginal: json,
          fetching: false
        });
      }).catch(e => {
        this.setState({
          json: null,
          jsonOriginal: null,
          fetching: false
        });
      });
  }

  render() {
    return (
      <div>
        <div className="container-nonresponsive container-results">
          <h1 className="page-header">Weapons</h1>
          { this.state.fetching ? '' : 
            <DataView
              json={this.state.json}
              jsonOriginal={this.state.jsonOriginal}
              fetching={false}
              filterSettings={[
                {
                  "dataName": null, 
                  "headerName": "Icon",
                  "dataType": "image", 
                  "imageFolder": "/img/weapons",
                  "isSortable": false, 
                  "isFilterable": false
                },
                {
                  "dataName": "name",
                  "headerName": "Name",
                  "dataType": "string",
                  "detailLink": "/weapons",
                  "isSortable": true,
                  "isFilterable": true
                },
                {
                  "dataName": "id",
                  "headerName": "Id",
                  "dataType": "integer",
                  "isSortable": true,
                  "isFilterable": true
                },
                {
                  "dataName": "attackPowerBase",
                  "headerName": "Attack Power Base",
                  "labelName": "Attack Power",
                  "dataType": "integer",
                  "classIcon": "fa fa-superpowers",
                  "isSortable": true,
                  "isFilterable": true
                },
                {
                  "dataName": "durabilityBase",
                  "headerName": "Durability Base",
                  "labelName": "Durability",
                  "dataType": "integer",
                  "classIcon": "fa fa-shield",
                  "isSortable": true,
                  "isFilterable": true
                },
                {
                  "dataName": "throwDistanceBase",
                  "headerName": "Throw Distance",
                  "labelName": "Throw Distance",
                  "dataType": "integer",
                  "classIcon": "fa fa-bullseye",
                  "isSortable": true,
                  "isFilterable": true
                },
                {
                  "dataName": "availabilities",
                  "headerName": "Availabilities",
                  "labelName": "Availabilities",
                  "dataType": "array",
                  "classIcon": "fa fa-map-marker",
                  "isSortable": true,
                  "isFilterable": true
                }
              ]} 
            />
          }
        </div>
      </div>
    );
  }
}

export default Weapons;
