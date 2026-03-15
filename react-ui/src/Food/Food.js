import React, { Component } from 'react';
import DataView from '../Other/DataView/DataView';
import Loading from '../Other/Loading/Loading';

import './Food.css';
import './FoodSprites.css';

class Food extends Component {
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
    fetch('/api/food')
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
          <h1 className="page-header">Food</h1>
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
                  "imageFolder": "/images/food",
                  "imageCssDataName": "cssClassName",
                  "spriteSheet": "food",
                  "isSortable": false, 
                  "isFilterable": false
                },
                {
                  "dataName": "name",
                  "headerName": "Name",
                  "dataType": "string",
                  "detailLink": "/food",
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
                  "dataName": "ingredients",
                  "headerName": "Ingredient (any of)",
                  "classIcon": "fa fa-cutlery",
                  "dataType": "arrayObject",
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

export default Food;
