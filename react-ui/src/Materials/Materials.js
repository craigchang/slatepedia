import React, { Component } from 'react';
import DataView from '../Other/DataView/DataView';

import './Materials.css';

class Materials extends Component {
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
    fetch('/api/materials')
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
          <h1 className="page-header">Materials</h1>
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
                  "isSortable": false, 
                  "isFilterable": false
                },
                {
                  "dataName": "name",
                  "headerName": "Name",
                  "dataType": "string",
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
                  "dataName": "type",
                  "headerName": "Type",
                  "dataType": "string",
                  "classIcon": "fa fa-tag",
                  "isSortable": true,
                  "isFilterable": true
                },
                {
                  "dataName": "sellPrice",
                  "headerName": "Sell Price",
                  "classIcon": "fa fa-diamond",
                  "labelName": "Rupees",
                  "dataType": "integer",
                  "isSortable": true,
                  "isFilterable": true
                },
                {
                  "dataName": "hpRecovery",
                  "headerName": "HP Recovery",
                  "classIcon": "fa fa-heart",
                  "dataType": "integer",
                  "isSortable": true,
                  "isFilterable": true
                },
                {
                  "dataName": "category.name",
                  "nested": 'addedEffect',
                  "headerName": "Category",
                  "classIcon": "fa fa-tags",
                  "dataType": "string",
                  "isSortable": true,
                  "isFilterable": true
                },
                {
                  "dataName": "potencyGrade",
                  "headerName": "Potency Grade",
                  "classIcon": "fa fa-thermometer-full",
                  "dataType": "string",
                  "isSortable": true,
                  "isFilterable": true
                },
                {
                  "dataName": "durationFactor",
                  "headerName": "Duration Factor",
                  "classIcon": "fa fa-clock-o",
                  "labelName": "seconds",
                  "dataType": "integer",
                  "isSortable": true,
                  "isFilterable": true
                },
                {
                  "dataName": "availabilities",
                  "headerName": "Availabilities",
                  "classIcon": "fa fa-map-marker",
                  "dataType": "array",
                  "isSortable": false,
                  "isFilterable": false
                }
              ]} 
            />
          }
        </div>
      </div>
    );
  }
}

export default Materials;
