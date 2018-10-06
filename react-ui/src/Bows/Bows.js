import React, { Component } from 'react';
import DataView from '../Other/DataView/DataView';

import './Bows.css';

class Bows extends Component {
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
    fetch('/api/bows')
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
          <h1 className="page-header">Bows</h1>
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
                  "detailLink": "/bows",
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
                  "dataName": "attackPower",
                  "headerName": "Attack Power",
                  "labelName": "Attack Power",
                  "dataType": "integer",
                  "classIcon": "fa fa-superpowers",
                  "isSortable": true,
                  "isFilterable": true
                },
                {
                  "dataName": "durability",
                  "headerName": "Durability",
                  "labelName": "Durability",
                  "classIcon": "fa fa-shield",
                  "dataType": "integer",
                  "isSortable": true,
                  "isFilterable": true
                },
                {
                  "dataName": "range",
                  "headerName": "Range",
                  "labelName": "Range",
                  "classIcon": "fa fa-bullseye",
                  "dataType": "integer",
                  "isSortable": true,
                  "isFilterable": true
                },
                {
                  "dataName": "multipleArrows",
                  "headerName": "Multiple Arrows",
                  "labelName": "Multiple Arrows",
                  "classIcon": "fa fa-arrows",
                  "dataType": "integer",
                  "isSortable": true,
                  "isFilterable": true
                },
                {
                  "dataName": "quickShot",
                  "headerName": "Quick Shot",
                  "classIcon": "fa fa-arrow-right",
                  "labelName": "Quick Shot",
                  "dataType": "boolean",
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

export default Bows;
