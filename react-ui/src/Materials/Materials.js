import React, { Component } from 'react';
import HeartContainer from '../Other/HeartContainer/HeartContainer';
import { Link } from 'react-router-dom';
import DataView from './DataView';
//import ListViewGrid from '../components/list-view-grid/ListViewGrid';
//import ScrollToTop from 'react-scroll-up';
import _ from 'lodash';

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
                {"dataName": null, "headerName": "Icon", "isSortable": false, "isFilterable": false},
                {"dataName": "id", "headerName": "Id", "isSortable": true, "isFilterable": true},
                {"dataName": "name", "headerName": "Name", "dataType": "string", "isSortable": true, "isFilterable": true}, 
                {"dataName": "type", "headerName": "Type", "dataType": "string", "isSortable": true, "isFilterable": true}, 
                {"dataName": "sellPrice", "headerName": "Sell Price", "dataType": "integer", "isSortable": true, "isFilterable": true}, 
                {"dataName": "hpRecovery", "headerName": "HP Recovery", "dataType": "integer", "isSortable": true, "isFilterable": true},
                {"dataName": "category.name", "headerName": "Category", "dataType": "string", "isSortable": true, "isFilterable": true}, 
                {"dataName": "potencyGrade", "headerName": "Potency Grade", "dataType": "string", "isSortable": true, "isFilterable": true}, 
                {"dataName": "durationFactor", "headerName": "Duration Factor", "dataType": "integer", "isSortable": true, "isFilterable": true},
                {"dataName": null, "headerName": "Availabilities", "isSortable": false, "isFilterable": false}
              ]} 
            />
          }
        </div>
      </div>
    );
  }
}

export default Materials;
