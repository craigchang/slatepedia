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
      view: 'grid'
    };
    
    this.renderGridView = this.renderGridView.bind(this);
    this.renderListView = this.renderListView.bind(this);
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

  renderListView() {
    this.setState({view: 'list'});
  }

  showListView() {
    if (this.state.fetching)
      return (<div></div>)
    else
      return ( 
        <div class="list-group">
          {this.state.fetching ? 'Fetching message from API' : this.outputListView(this.state.json)}
        </div>
      )
  }

  renderGridView() {
    this.setState({view: 'grid'});
  }

  showGridView() {

    if (this.state.fetching)
      return (<div></div>)
    else
      return (
        <div className="table-responsive">
          <table className="table table-striped sortable">
            <thead>
              <tr>
                <th onClick={this.clickTableColumnHeader}>Icon</th>
                <th data-value="name" onClick={this.clickTableColumnHeader}>Name</th>
                <th data-value="type" onClick={this.clickTableColumnHeader}>Type</th>
                <th data-value="sellPrice" onClick={this.clickTableColumnHeader}>Sell Price</th>
                <th data-value="hpRecovery" onClick={this.clickTableColumnHeader}>HP Recovery</th>
                <th data-value="category[name]" onClick={this.clickTableColumnHeader}>Category</th>
                <th data-value="potencyGrade" onClick={this.clickTableColumnHeader}>Potency Grade</th>
                <th data-value="durationFactor" onClick={this.clickTableColumnHeader}>Duration Factor</th>
                <th onClick={this.clickTableColumnHeader}>Availabilities</th>
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
    if (this.nameInput.value !== '') {
      results = _.filter(results, (obj) => {
        return obj.name.toLowerCase().indexOf(this.nameInput.value.toLowerCase()) !== -1;
      });
    }

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

    // Name Input
    if (this.nameInput.value !== '') {
      results = _.filter(results, (obj) => {
        return obj.name.toLowerCase().indexOf(this.nameInput.value.toLowerCase()) !== -1;
      });
    }

    // Sorting
    if (this.state.sortBy && this.state.sortOrder)
      results = _.orderBy(results, this.state.sortBy, this.state.sortOrder);

    this.setState({json: results});
  }

  render() {

    let view = '';

    switch(this.state.view) {
      case 'grid': view = this.showGridView(); break;
      case 'list': view =  this.showListView(); break;
      default: view = this.showListView(); break; 
    }

    return (
      <div>
        <div className="container-nonresponsive container-results">
          <h1 className="page-header">Materials</h1>
          <div className="filter-form">
            <form onSubmit={this.filterSearch}>
            
              <p>
                <button type="button" className={this.state.view === 'grid' ? 'btn btn-primary' : 'btn btn-secondary'} onClick={this.renderGridView}>Grid View</button>
                <button type="button" className={this.state.view === 'list' ? 'btn btn-primary' : 'btn btn-secondary'} onClick={this.renderListView}>List View</button>
              </p>
              
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div className="input-group">
                    <span className="input-group-addon">
                      <span className="glyphicon glyphicon-search" aria-hidden="true"></span>
                    </span>
                    <input type="search" name="name" className="form-control" placeholder="Search by Name" ref={(input) => { this.nameInput = input; }} style={{'fontSize': '16px'}} onChange={this.filterSearch}/>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">

                </div>
              </div>
            </form>
          </div>
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

export default Materials;
