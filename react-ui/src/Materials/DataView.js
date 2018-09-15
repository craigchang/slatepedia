import React, { Component } from 'react';
import HeartContainer from '../Other/HeartContainer/HeartContainer';
import { Link } from 'react-router-dom'
//import ListViewGrid from '../components/list-view-grid/ListViewGrid';
//import ScrollToTop from 'react-scroll-up';
import _ from 'lodash';

import './Materials.css';

class DataView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      json: this.props.json,
      jsonOriginal: this.props.jsonOriginal,
      fetching: this.props.fetching,
      sortBy: "",
      sortOrder: "",
      filterButtonCollapsed: true,
      dataView: 'grid'
    };

    this.nameInput = React.createRef();
    this.changeToGridView = this.changeToGridView.bind(this);
    this.changeToListView = this.changeToListView.bind(this);
    this.clickFilterOptionsButton = this.clickFilterOptionsButton.bind(this);
    this.clickClearFilterButton = this.clickClearFilterButton.bind(this);
    this.filterSearch = this.filterSearch.bind(this);
  }

  componentDidMount() {
    
    // this.setState({
    //     json: json,
    //     jsonOriginal: json,
    //     fetching: false
    // });

  }

  changeToGridView() {
    this.setState({dataView: 'grid'});
  }

  changeToListView(event) {
    let results = this.state.json.slice();

    this.clearSorting();

    results = _.orderBy(results, "id", "asc");

    this.setState({
      json: results,
      dataView: 'list',
      sortBy: '',
      sortOrder: ''
    });
  }

  clickFilterOptionsButton(event) {
    if(event.target.classList.contains("collapsed"))
      this.setState({filterButtonCollapsed: true})
    else
      this.setState({filterButtonCollapsed: false})
  }

  clickClearFilterButton(event) {
    event.preventDefault();

    let results = this.state.jsonOriginal.slice();

    this.clearSorting();

    this.setState({
      json: results,
      sortBy: '',
      sortOrder: ''
    })
  }

  clickTableColumnHeader(event, dataName) {
    event.preventDefault();

    let tableHeaderColumn = event.target;
    let sortOrder = 'asc';
    let results = this.state.json.slice();
    
    console.log(event.target.textContent);

    this.clearSorting();

    // assign new sorting
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

    // update data results
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

    // Sort existing
    if (this.state.sortBy && this.state.sortOrder)
      results = _.orderBy(results, this.state.sortBy, this.state.sortOrder);

    this.setState({
      json: results
    });
  }

  // HELPER FUNCTIONS

  clearSorting() {
    let allTableHeaderCols = document.getElementsByTagName('th');
    for(let i = 0; i < allTableHeaderCols.length; i++) {
      allTableHeaderCols[i].classList.remove('asc');
      allTableHeaderCols[i].classList.remove('desc');
    }
  }

  // RENDER FUNCTIONS

  renderDataView(json) {
    if (json == null || json.length === 0) return false;

    switch(this.state.dataView) {
      case "grid":
        return this.renderGridView(json); break;
      case "list":
        return this.renderListView(json); break;
      default:
        return this.renderGridView(json); break;
    }
  }

  renderListView() {
    return ( 
      <div className="list-group mt-0">
        {this.state.fetching ? 
          'Fetching message from API' : 
          this.state.json.map((material, index) => (<MaterialListViewItem key={index} material={material} />))}
      </div>
    )
  }

  renderGridHeaderView() {
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
        tableHeaderColsArray.push( 
          <th 
            style={{cursor: 'default'}} 
            key={`${i}-${this.props.filterSettings[i].dataValue}`}>{this.props.filterSettings[i].headerName}</th> 
        )
    }

    return tableHeaderColsArray;
  }

  renderGridView() {
    return (
      <div className="table-responsive">
        <table className="table table-striped sortable">
          <thead>
            <tr>
              {this.state.fetching ? '' : this.renderGridHeaderView()}
            </tr>
          </thead>
          <tbody>
            {this.state.fetching ? 
              'Fetching message from API' : 
              this.state.json.map((material, index) => (<MaterialGridViewItem key={index} material={material} />))}
          </tbody>
        </table>
      </div>
    )
  }

  render() {
    return (
      <React.Fragment>
        <p>
          <button type="button" className={(this.state.dataView === 'grid' ? 'btn btn-primary' : 'btn btn-secondary') + ' mr-1'} onClick={this.changeToGridView}>Grid View</button>
          <button type="button" className={this.state.dataView === 'list' ? 'btn btn-primary' : 'btn btn-secondary'} onClick={this.changeToListView}>List View</button>
        </p> 
        <form onSubmit={this.filterSearch}>
          <div className="form-row">
            <div className="col-md-6">
              <div className="form-group">
                <div className="input-group mb-2">
                  <div className="input-group-prepend">
                    <div className="input-group-text"><i className="fa fa-search" aria-hidden="true"></i></div>
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
            <a href="#formCollapse" className="mr-1" data-toggle="collapse" role="button" aria-expanded="false" aria-controls="formCollapse" onClick={this.clickFilterOptionsButton}>{this.state.filterButtonCollapsed ? "More Filters" : "Close Filters" }</a>&nbsp;
            <a href="#" role="button" onClick={this.clearFilterButton}>Clear Filters</a>
          </p>
          <div className="filter-form collapse" id="formCollapse">
            Test
          </div>
        </form>
        <p className="mb-0">
          {this.state.fetching ? '' : `${this.state.json.length} Items`} 
        </p>
        {this.state.fetching ? '' : this.renderDataView(this.state.json)}
      </React.Fragment>
    );
  }
}

const MaterialGridViewItem = ({material}) => {

  let imageName = material.name.replace(/ /g, "-").replace(/'/g,"").toLowerCase();

  return (
    <tr>
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
          material.availabilities && material.availabilities.map((availability, index) => {
            return <React.Fragment key={`${material.name}-${availability}`}>{availability}{index < material.availabilities.length - 1 ? ", ": ""}</React.Fragment>
          })
        }
      </td>
    </tr>
  )
}

const MaterialListViewItem = ({material}) => {

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
              material.availabilities && material.availabilities.map((availability, index) => (
                <span key={index}><i className="fa fa-map-marker" aria-hidden="true"></i> {availability}</span>
              ))
            }
          </span>
        </div>
      </div>
    </div>
  )
}


export default DataView;