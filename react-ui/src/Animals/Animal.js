import React, { Component } from 'react';
import DataView from '../Other/DataView/DataView';
import Loading from '../Other/Loading/Loading';

import './Animal.css';
import './AnimalSprites.css';

class Animal extends Component {
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
    fetch('/api/animals')
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
          <h1 className="page-header">Animals</h1>
          { this.state.fetching ? <Loading /> :
            <DataView
              json={this.state.json}
              jsonOriginal={this.state.jsonOriginal}
              fetching={false}
              filterSettings={[
                {
                  "dataName": null,
                  "headerName": "Icon",
                  "dataType": "image",
                  "imageFolder": "/img/animals",
                  "imageCssDataName": "cssClassName",
                  "spriteSheet": "animals",
                  "isSortable": false,
                  "isFilterable": false
                },
                {
                  "dataName": "name",
                  "headerName": "Name",
                  "dataType": "string",
                  "detailLink": "/animals",
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
                  "dataName": "uniqueCookingEffects",
                  "headerName": "Unique Cooking Effects",
                  "dataType": "string",
                  "classIcon": "fa fa-cutlery",
                  "isSortable": true,
                  "isFilterable": true
                },
                {
                  "dataName": "commonLocations",
                  "headerName": "Common Locations",
                  "dataType": "array",
                  "classIcon": "fa fa-map-marker",
                  "isSortable": false,
                  "isFilterable": true
                },
                {
                  "dataName": "recoverableMaterials",
                  "headerName": "Recoverable Materials",
                  "dataType": "arrayObject",
                  "classIcon": "fa fa-cube",
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

export default Animal;
