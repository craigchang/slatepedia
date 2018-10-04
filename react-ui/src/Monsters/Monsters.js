import React, { Component } from 'react';
import DataView from '../Other/DataView/DataView';

import './Monsters.css';

class Monsters extends Component {
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
    fetch('/api/monsters')
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
          <h1 className="page-header">Monsters</h1>
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
                  "imageFolder": "/img/monsters",
                  "fileType": "jpg",
                  "isSortable": false, 
                  "isFilterable": false
                },
                {
                  "dataName": "name",
                  "headerName": "Name",
                  "dataType": "string",
                  "detailLink": "/monsters",
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
                  "dataName": "size",
                  "headerName": "Size",
                  "dataType": "string",
                  "classIcon": "fa fa-user-plus",
                  "isSortable": true,
                  "isFilterable": true
                },
                {
                  "dataName": "hp",
                  "headerName": "HP",
                  "dataType": "integer",
                  "classIcon": "fa fa-heart",
                  "isSortable": true,
                  "isFilterable": true
                },
                {
                  "dataName": "rank",
                  "headerName": "Rank",
                  "dataType": "integer",
                  "classIcon": "fa fa-star",
                  "isSortable": true,
                  "isFilterable": true
                },
                {
                  "dataName": "commonLocations",
                  "headerName": "Common Locations",
                  "dataType": "array",
                  "classIcon": "fa fa-map-marker",
                  "isSortable": true,
                  "isFilterable": true
                },
                {
                  "dataName": "itemDrops",
                  "headerName": "Item Drops",
                  "dataType": "arrayObject",
                  "classIcon": "fa fa-cog",
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

export default Monsters;
