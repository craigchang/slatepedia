import React, { Component } from 'react';
import HeartContainer from '../Other/HeartContainer/HeartContainer';
import { Link } from 'react-router-dom'
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
      view: 'grid'
    };
    
    this.renderGridView = this.renderGridView.bind(this);
    this.renderListView = this.renderListView.bind(this);
    this.searchFilterButton = this.searchFilterButton.bind(this);
    this.clearFilterButton = this.clearFilterButton.bind(this);
    this.filterSearch = this.filterSearch.bind(this);
    this.clickTableColumnHeader = this.clickTableColumnHeader.bind(this);
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

  outputJson(json) {
    if (json && json.length > 0) {
      return json.map((material, index) => (
        <Material key={index} material={material} />
      ));
    }
  }
  
  outputListView(json) {
    if (json && json.length > 0) {
      return json.map((material, index) => (
        <MaterialListView key={index} material={material} />
      ));
    }
  }

  renderListView(event) {
    // clear sorting
    let allTableHeaderCols = document.getElementsByTagName('th');
    for(let i = 0; i < allTableHeaderCols.length; i++) {
      allTableHeaderCols[i].className = "";
    }
    let results = this.state.json.slice();
    results = _.orderBy(results, "id", "asc");

    this.setState({
      json: results,
      view: 'list',
      sortBy: '',
      sortOrder: ''
    });
  }

  showListView() {
    if (this.state.fetching)
      return (<div></div>)
    else
      return ( 
        <div className="list-group">
          {this.state.fetching ? 'Fetching message from API' : this.outputListView(this.state.json)}
        </div>
      )
  }

  renderGridView() {
    this.setState({view: 'grid'});
  }

  showGridView() {
    let tableHeaderColsArray = [];
    let columnsArray = [
      {"dataValue": null, "headerName": "Icon", "isSortable": false},
      {"dataValue": "name", "headerName": "Name", "isSortable": true}, 
      {"dataValue": "type", "headerName": "Type", "isSortable": true}, 
      {"dataValue": "sellPrice", "headerName": "Sell Price", "isSortable": true}, 
      {"dataValue": "hpRecovery", "headerName": "HP Recovery", "isSortable": true},
      {"dataValue": "category.name", "headerName": "Category", "isSortable": true}, 
      {"dataValue": "potencyGrade", "headerName": "Potency Grade", "isSortable": true}, 
      {"dataValue": "durationFactor", "headerName": "Duration Factor", "isSortable": true},
      {"dataValue": null, "headerName": "Availabilities", "isSortable": false},
    ];
    for(let i = 0; i < columnsArray.length; i++) {
      if (columnsArray[i].isSortable)
        tableHeaderColsArray.push( <th key={`${i}-${columnsArray[i].headerName}`} data-value={columnsArray[i].dataValue} onClick={this.clickTableColumnHeader}>{columnsArray[i].headerName}</th> )
      else
        tableHeaderColsArray.push( <th style={{cursor: 'default'}} key={`${i}-${columnsArray[i].dataValue}`}>{columnsArray[i].headerName}</th> )
    }

    if (this.state.fetching)
      return (<div></div>)
    else
      return (
        <div className="table-responsive">
          <table className="table table-striped sortable">
            <thead>
              <tr>
                {tableHeaderColsArray}
              </tr>
            </thead>
            <tbody>
              {this.state.fetching ? 'Fetching message from API' : this.outputJson(this.state.json)}
            </tbody>
          </table>
        </div>
      )
  }

  clickTableColumnHeader(event) {
    event.preventDefault();

    let tableHeaderColumn = event.target;
    let sortOrder = 'asc';
    let results = this.state.json.slice();
    let columnName = tableHeaderColumn.getAttribute("data-value");
    let allTableHeaderCols = tableHeaderColumn.parentElement.children;

    console.log(event.target.textContent);

    if (!columnName) return false;

    if (tableHeaderColumn.className == '' || tableHeaderColumn.className == 'desc') {
      for(let i = 0; i < allTableHeaderCols.length; i++) {
        allTableHeaderCols[i].className = "";
      }
      tableHeaderColumn.className = sortOrder = 'asc'
    } else {
      for(let i = 0; i < allTableHeaderCols.length; i++) {
        allTableHeaderCols[i].className = "";
      }
      tableHeaderColumn.className = sortOrder = 'desc'
    }

    results = _.orderBy(results, columnName, sortOrder);

    // Name Input
    // if (this.nameInput.value !== '') {
    //   results = _.filter(results, (obj) => {
    //     return obj.name.toLowerCase().indexOf(this.nameInput.value.toLowerCase()) !== -1;
    //   });
    // }

    this.setState({
      json: results,
      sortBy: columnName,
      sortOrder: sortOrder
    });

    //this.filterSearch(results, event);
  }

  filterSearch(event) {
    event.preventDefault();

    let results = this.state.jsonOriginal.slice();

    let form = document.getElementsByTagName('form');
    let inputs = form[0].getElementsByTagName('input');

    for(let i = 0; i < this.props.filterSettings.length; i++) {
      if (this.props.filterSettings[i].isFilterable) {
        let dataName = this.props.filterSettings[i].dataName;

        if (this.props.filterSettings[i].dataType == "string") {
          let inputField = document.querySelector(`input[name="${dataName}"]`);

          if (inputField && inputField.value !== '') {
            let dataNameArray = dataName.split(".");

            if (dataNameArray.length === 1)
              results = _.filter(results, (obj) => {
                return obj[dataNameArray[0]].toLowerCase().indexOf(inputField.value.toLowerCase()) !== -1;
              });

            if (dataNameArray.length === 2)
              results = _.filter(results, (obj) => {
                if (obj[dataNameArray[0]] != null)
                  return obj[dataNameArray[0]][dataNameArray[1]].toLowerCase().indexOf(inputField.value.toLowerCase()) !== -1;
              });
          }
        } else if (this.props.filterSettings[i].dataType == "integer"){
          let minInputField = document.querySelector(`input[name="${dataName}-min"]`);
          let maxInputField = document.querySelector(`input[name="${dataName}-max"]`);

          let minVal = parseInt(minInputField.value) ? parseInt(minInputField.value) : 0;
          let maxVal = parseInt(maxInputField.value) ? parseInt(maxInputField.value) : 0;

          if (minVal === 0 && maxVal === 0) continue;
          //if (minVal > maxVal) continue;
          //if (minVal === 0 && maxVal !== 0) 
          if (minVal !== 0 && maxVal === 0) {
            maxVal = Infinity;
          }

          if (minVal !== 0 || maxVal !== 0)
            results = _.filter(results, (obj) => {
              console.log(`${obj.name} ${obj.sellPrice}`)
              return minVal <= obj[dataName] && obj[dataName] <= maxVal;
            });
        }

      }
    }


    // for(let i = 0; i < inputs.length; i++) {
    //   if (inputs[i].value !== '') {

    //     let dataNameArray = inputs[i].name.split(".");

    //     if (dataNameArray.length === 1)
    //       results = _.filter(results, (obj) => {
    //         return obj[inputs[i].name].toLowerCase().indexOf(inputs[i].value.toLowerCase()) !== -1;
    //       });

    //     if (dataNameArray.length === 2)
    //       results = _.filter(results, (obj) => {
    //         if (obj[dataNameArray[0]] != null)
    //           return obj[dataNameArray[0]][dataNameArray[1]].toLowerCase().indexOf(inputs[i].value.toLowerCase()) !== -1;
    //       });
    //   }
    // }

    // clear sorting
    // let allTableHeaderCols = document.getElementsByTagName('th');
    // for(let i = 0; i < allTableHeaderCols.length; i++) {
    //   allTableHeaderCols[i].className = "";
    // }

    // Name Input
    // if (this.nameInput.value !== '') {
    //   results = _.filter(results, (obj) => {
    //     return obj.name.toLowerCase().indexOf(this.nameInput.value.toLowerCase()) !== -1;
    //   });
    // }

    // Sorting
    if (this.state.sortBy && this.state.sortOrder)
      results = _.orderBy(results, this.state.sortBy, this.state.sortOrder);

    this.setState({
      json: results,
      sortBy: "",
      sortOrder: ""
    });
  }

  searchFilterButton(event) {
    if(event.target.classList.contains("collapsed"))
      this.setState({filterButtonCollapsed: true})
    else
      this.setState({filterButtonCollapsed: false})
  }

  clearFilterButton(event) {
    let results = this.state.jsonOriginal.slice();

    let form = document.getElementsByTagName('form');
    let inputs = form[0].getElementsByTagName('input');

    for(let i = 0; i < inputs.length; i++) {
      inputs[i].value = ''
    }

    this.filterSearch(event);
  }

  render() {
    let inputFieldsArray = [];
    let inputFieldsArray2 = []; 

    for(let i = 0; i < this.props.filterSettings.length; i++) {
      let j = i % 2;

      switch(this.props.filterSettings[i].dataType) {
        case "string": 
          inputFieldsArray.push( 
            <InputField
              headerName={this.props.filterSettings[i].headerName}
              dataName={this.props.filterSettings[i].dataName}
              filterSearch={this.filterSearch}/>
         ); break;
        case "integer": 
          inputFieldsArray.push(
            <InputNumberFields
              headerName={this.props.filterSettings[i].headerName}
              dataName={this.props.filterSettings[i].dataName}
              filterSearch={this.filterSearch}/>
          );
          break;
        default: break;
      }
    }

    let view = '';

    switch(this.state.view) {
      case 'grid': view = this.showGridView(); break;
      case 'list': view =  this.showListView(); break;
      default: view = this.showListView(); break; 
    }
    
    let formRowsArray = [];
    for(let i = 0; i < inputFieldsArray.length; i += 2){
      formRowsArray.push(
        <div className="form-row">
          {inputFieldsArray[i]}
          {i > inputFieldsArray.length ? '' : inputFieldsArray[i + 1]}
        </div>
      )
    }

    return (
      <div>
        <div className="container-nonresponsive container-results">
          <h1 className="page-header">Materials</h1>
          <p>
            <button type="button" className={(this.state.view === 'grid' ? 'btn btn-primary' : 'btn btn-secondary') + ' mr-1'} onClick={this.renderGridView}>Grid View</button>
            <button type="button" className={this.state.view === 'list' ? 'btn btn-primary' : 'btn btn-secondary'} onClick={this.renderListView}>List View</button>
          </p>
          <p>
            <a href="#formCollapse" className="mr-1" data-toggle="collapse" role="button" aria-expanded="false" aria-controls="formCollapse" onClick={this.searchFilterButton}>{this.state.filterButtonCollapsed ? "Open Filters" : "Close Filters" }</a>&nbsp;
            <a href="#" role="button" onClick={this.clearFilterButton}>Clear Filters</a>
          </p>
          <div className="filter-form collapse" id="formCollapse">
            <form onSubmit={this.filterSearch}>
              
              {formRowsArray}

            </form>
          </div>
          <p className="mb-0">
            {this.state.fetching ? '' : `${this.state.json.length} Items`} 
          </p>
          {view}
        </div>
      </div>
    );
  }
}

const Material = ({material}) => {

  let imageName = material.name.replace(/ /g, "-").replace(/'/g,"").toLowerCase();

  return (
    <tr>
      {/* <td data-value={material.id}>{material.id}</td> */}
      {/* <td style={{'verticalAlign': 'middle'}}><div className={'sprite ' + material.cssClassName}></div></td> */}
      <td><img alt={imageName} className="resource-icon" src={`/img/materials/${imageName}.png`}/></td>
      <td>
        <p className="mb-0">{material.name}</p>
        <small className="small"><Link to={`/materials/${material.id}`}>Details &#187;</Link></small>
      </td>
      <td>{material.type}</td>
      <td>{material.sellPrice}</td>
      <td><HeartContainer health={material.hpRecovery}/></td>
      {
        material.category == null ? 
          (<td>-</td>) : 
          (<td><span title={`${material.category.name} - ${material.category.addedEffect} `}>{material.category.name}</span></td>)
      }
      <td>{material.potencyGrade === "" ? '-': material.potencyGrade}</td>
      <td>{material.durationFactor}</td>
      <td>
      {/* {material.availabilities.map((availability, index) => (
        <span key={index}><i className="fa fa-map-marker" aria-hidden="true"></i> {availability.name}</span>
      ))} */}
      </td>
    </tr>
  )
}

const MaterialListView = ({material}) => {

  let imageName = material.name.replace(/ /g, "-").replace(/'/g,"").toLowerCase();

  return (
    <div className="list-group-item list-view-item">
      <div className="media">
        <div className="media-left media-middle mr-2">
          <img alt={imageName} className="resource-icon-list-view" src={`/img/materials/${imageName}.png`}/>
        </div>
        <div className="media-body">
          <p className="mb-0">
            <span className="media-heading">{material.name}</span>&nbsp;
            <small className="small"><Link to={`/materials/${material.id}`}>Details &#187;</Link></small>
          </p>
          <span>
            <span><i className="fa fa-tag" aria-hidden="true"></i> <b>{material.type}</b></span>
            <span><i className="fa fa-diamond" aria-hidden="true"></i> <b>{material.sellPrice}</b> Rupees</span>
            <span><i className="fa fa-heart" aria-hidden="true"></i> <b>{material.hpRecovery}</b></span>

            <span><i className="fa fa-tags" aria-hidden="true"></i> <b>{material.category == null ? 'None' : material.category.name}</b></span>
            <span><i className="fa fa-thermometer-full" aria-hidden="true"></i> <b>{material.potencyGrade === '' ? 'None': material.potencyGrade}</b></span>
            <span><i className="fa fa-clock-o" aria-hidden="true"></i> <b>{material.durationFactor}</b></span>
          </span>
          <br/>
          
        </div>
        <div className="media-right media-middle">
        </div>
      </div>
    </div>
  )
}

const InputField = ({headerName, dataName, filterSearch}) => {
  return (
    <div className="col-md-6">
      <div className="form-group"> 
        <label for="test">{headerName}</label>
        <input 
          type="search" 
          name={dataName} 
          className="form-control" 
          placeholder={`Search by ${headerName}`} 
          onChange={filterSearch}/>
      </div>
    </div>
  )
}

const InputNumberFields = ({headerName, dataName, filterSearch}) => {
  return (
    <React.Fragment>
      <div className="col-md-3">
        <div className="form-group"> 
          <label for="inputEmail4">{headerName} (Min)</label>
          <input 
            type="number" 
            name={`${dataName}-min`} 
            className="form-control" 
            //laceholder={`Min`} 
            //value={0}
            //ref={(input) => { this.nameInput = input; }} 
            //style={{'fontSize': '16px'}} 
            onChange={filterSearch}/>
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group">
          <label for="inputEmail4">{headerName} (Max)</label>
          <input 
            type="number" 
            name={`${dataName}-max`} 
            className="form-control" 
            //placeholder={`Max`} 
            //value={0}
            //ref={(input) => { this.nameInput = input; }} 
            //style={{'fontSize': '16px'}} 
            onChange={filterSearch}/>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Materials;
