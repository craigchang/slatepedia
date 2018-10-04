import React, { Component } from 'react';
import DataView from '../Other/DataView/DataView';

import './Armor.css';

class Armor extends Component {
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
    fetch('/api/armor')
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
          <h1 className="page-header">Armor</h1>
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
                  "imageFolder": "/img/armor",
                  "isSortable": false, 
                  "isFilterable": false
                },
                {
                  "dataName": "name",
                  "headerName": "Name",
                  "dataType": "string",
                  "detailLink": "/armor",
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
                  "dataName": "defense",
                  "headerName": "Defense",
                  "dataType": "string",
                  "classIcon": "fa fa-shield",
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
                  "dataName": "bodyPart",
                  "headerName": "Body Part",
                  "classIcon": "fa fa-user",
                  "dataType": "string",
                  "isSortable": true,
                  "isFilterable": true
                },
                {
                  "dataName": "addedEffect",
                  "headerName": "Added Effect",
                  "classIcon": "fa fa-plus",
                  "dataType": "string",
                  "isSortable": true,
                  "isFilterable": true
                },
                {
                  "dataName": "setBonus",
                  "headerName": "Set Bonus",
                  "classIcon": "fa fa-long-arrow-up",
                  "dataType": "string",
                  "isSortable": true,
                  "isFilterable": true
                },
                {
                  "dataName": "availability",
                  "headerName": "Availability",
                  "classIcon": "fa fa-map-marker",
                  "dataType": "string",
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

export default Armor;
