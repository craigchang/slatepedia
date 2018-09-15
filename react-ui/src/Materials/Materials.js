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

    this.nameInput = React.createRef();
    this.renderGridView = this.renderGridView.bind(this);
    this.renderListView = this.renderListView.bind(this);
    this.searchFilterButton = this.searchFilterButton.bind(this);
    this.clearFilterButton = this.clearFilterButton.bind(this);
    this.filterSearch = this.filterSearch.bind(this);
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

  outputGridView(json) {
    if (json && json.length > 0) {
      return json.map((material, index) => (
        <MaterialGridView key={index} material={material} />
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
    let results = this.state.json.slice();
    let allTableHeaderCols = document.getElementsByTagName('th');

    for(let i = 0; i < allTableHeaderCols.length; i++) {
      allTableHeaderCols[i].className = "";
    }
    
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
        <div className="list-group mt-0">
          {this.state.fetching ? 'Fetching message from API' : this.outputListView(this.state.json)}
        </div>
      )
  }

  renderGridView() {
    this.setState({view: 'grid'});
  }

  showGridView() {
    let tableHeaderColsArray = [];
    for(let i = 0; i < this.props.filterSettings.length; i++) {
      if (this.props.filterSettings[i].isSortable)
        tableHeaderColsArray.push( 
          <th 
            className="sortable"
            key={`${i}-${this.props.filterSettings[i].headerName}`} 
            data-value={this.props.filterSettings[i].dataValue} 
            onClick={(event) => this.clickTableColumnHeader(event, this.props.filterSettings[i].dataName)}>{this.props.filterSettings[i].headerName}</th> 
        )
      else
        tableHeaderColsArray.push( <th style={{cursor: 'default'}} key={`${i}-${this.props.filterSettings[i].dataValue}`}>{this.props.filterSettings[i].headerName}</th> )
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
              {this.state.fetching ? 'Fetching message from API' : this.outputGridView(this.state.json)}
            </tbody>
          </table>
        </div>
      )
  }

  clickTableColumnHeader(event, dataName) {
    event.preventDefault();

    let tableHeaderColumn = event.target;
    let sortOrder = 'asc';
    let results = this.state.json.slice();
    let allTableHeaderCols = tableHeaderColumn.parentElement.children;

    console.log(event.target.textContent);

    for(let i = 0; i < allTableHeaderCols.length; i++) {
      allTableHeaderCols[i].classList.remove('asc')
      allTableHeaderCols[i].classList.remove('desc');
    }

    if (this.state.sortBy == dataName) {
      if (this.state.sortOrder == "" || this.state.sortOrder == 'desc') {
        tableHeaderColumn.classList.add('asc'); 
        sortOrder = 'asc';
      } else {
        tableHeaderColumn.classList.add('desc');
        sortOrder = 'desc';
      }
    } else {
      tableHeaderColumn.classList.add('asc'); 
      sortOrder = 'asc';
    }

    results = _.orderBy(results, dataName, sortOrder);

    this.setState({
      json: results,
      sortBy: dataName,
      sortOrder: sortOrder
    });
  }

  filterSearch(event) {
    event.preventDefault();

    let results = this.state.jsonOriginal.slice();

    // Name Input
    if (this.nameInput.current.value !== '') {
      results = _.filter(results, (obj) => {
        return obj.name.toLowerCase().indexOf(this.nameInput.current.value.toLowerCase()) !== -1;
      });
    }

    // Sorting
    if (this.state.sortBy && this.state.sortOrder)
      results = _.orderBy(results, this.state.sortBy, this.state.sortOrder);

    this.setState({
      json: results
    });
  }

  searchFilterButton(event) {
    if(event.target.classList.contains("collapsed"))
      this.setState({filterButtonCollapsed: true})
    else
      this.setState({filterButtonCollapsed: false})
  }

  clearFilterButton(event) {
    event.preventDefault();

    let results = this.state.jsonOriginal.slice();

    //clear sorting
    let allTableHeaderCols = document.getElementsByTagName('th');
    for(let i = 0; i < allTableHeaderCols.length; i++) {
      allTableHeaderCols[i].classList.remove('asc');
      allTableHeaderCols[i].classList.remove('desc');
    }

    this.setState({
      json: results,
      sortBy: '',
      sortOrder: ''
    })

  }

  render() {
    let dataView = '';

    switch(this.state.view) {
      case 'grid': dataView = this.showGridView(); break;
      case 'list': dataView =  this.showListView(); break;
      default: dataView = this.showListView(); break; 
    }

    return (
      <div>
        <div className="container-nonresponsive container-results">
          <h1 className="page-header">Materials</h1>
          <p>
            <button type="button" className={(this.state.view === 'grid' ? 'btn btn-primary' : 'btn btn-secondary') + ' mr-1'} onClick={this.renderGridView}>Grid View</button>
            <button type="button" className={this.state.view === 'list' ? 'btn btn-primary' : 'btn btn-secondary'} onClick={this.renderListView}>List View</button>
          </p> 
          <form onSubmit={this.filterSearch}>
            <div className="form-row">
              <div className="col-md-6">
                <div className="form-group">
                  <div class="input-group mb-2">
                    <div class="input-group-prepend">
                      <div class="input-group-text"><i className="fa fa-search" aria-hidden="true"></i></div>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      ref={this.nameInput} 
                      placeholder={`Search by Name`} 
                      name="name"
                      onChange={this.filterSearch}/>
                  </div>
                </div>
              </div>
            </div>
            <p>
              <a href="#formCollapse" className="mr-1" data-toggle="collapse" role="button" aria-expanded="false" aria-controls="formCollapse" onClick={this.searchFilterButton}>{this.state.filterButtonCollapsed ? "More Filters" : "Close Filters" }</a>&nbsp;
              <a href="#" role="button" onClick={this.clearFilterButton}>Clear Filters</a>
            </p>
            <div className="filter-form collapse" id="formCollapse">
              Test
            </div>
          </form>
          <p className="mb-0">
            {this.state.fetching ? '' : `${this.state.json.length} Items`} 
          </p>
          {dataView}
        </div>
      </div>
    );
  }
}

const MaterialGridView = ({material}) => {

  let imageName = material.name.replace(/ /g, "-").replace(/'/g,"").toLowerCase();

  return (
    <tr>
      {/* <td style={{'verticalAlign': 'middle'}}><div className={'sprite ' + material.cssClassName}></div></td> */}
      <td><img alt={imageName} className="resource-icon" src={`/img/materials/${imageName}.png`}/></td>
      <td data-value={material.id}>{material.id}</td>
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
        {
          material.availabilities.map((availability, index) => {
            return <React.Fragment>{availability}{index < material.availabilities.length - 1 ? ", ": ""}</React.Fragment>
          })
        }
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
            {
              material.availabilities.map((availability, index) => (
                <span key={index}><i className="fa fa-map-marker" aria-hidden="true"></i> {availability}</span>
              ))
            }
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
