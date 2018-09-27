import React, { Component } from 'react';
import GridItemDataView from './GridItemDataView/GridItemDataView';
import ListItemDataView from './ListItemDataView/ListItemDataView';
import _ from 'lodash';

import './DataView.css';

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
      dataView: 'list'
    };

    this.nameInput = React.createRef();
    this.sortSelect = React.createRef();
    this.sortOrderButton = React.createRef();

    this.changeToGridView = this.changeToGridView.bind(this);
    this.changeToListView = this.changeToListView.bind(this);
    this.clickFilterOptionsButton = this.clickFilterOptionsButton.bind(this);
    this.clickClearFilterButton = this.clickClearFilterButton.bind(this);
    this.filterSearch = this.filterSearch.bind(this);

    this.onClickSortButton = this.onClickSortButton.bind(this);
    this.onChangeSortSelect = this.onChangeSortSelect.bind(this);
  }

  componentDidMount() {
  }

  changeToGridView(event) {
    this.setState({dataView: 'grid'});
  }

  changeToListView(event) {
    this.setState({ dataView: 'list'});
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
    if (this.state.sortBy === dataName) {
      if (this.state.sortOrder === "" || this.state.sortOrder === 'desc') {
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

  onChangeSortSelect(event) {
    let dataName = this.sortSelect.current.value;
    if (dataName === '') return false;

    let results = this.state.json.slice();
    
    results = _.orderBy(results, dataName, this.state.sortOrder);

    this.setState({
      json: results,
      sortBy: dataName
    })
  }

  onClickSortButton(event) {
    let dataName = this.sortSelect.current.value;
    let sortOrderIcon = this.sortOrderButton.current.getElementsByTagName("i")[0];
    let sortOrder = sortOrderIcon.classList.contains('fa-sort-alpha-asc') ? 'desc' : 'asc'; //toggle
    let results = this.state.json.slice();

    results = _.orderBy(results, dataName, sortOrder);

    this.setState({
      json: results,
      sortOrder: sortOrder
    })
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
        return this.renderGridView(json);
      case "list":
        return this.renderListView(json);
      default:
        return this.renderGridView(json);
    }
  }

  renderListView() {
    return ( 
      <div className="list-group mt-0">
        {this.state.fetching ? 
          'Fetching message from API' : 
          this.state.json.map((material, index) => (<ListItemDataView key={index} material={material} filterSettings={this.props.filterSettings} />))}
      </div>
    )
  }

  renderListSortSelectView() {
    if (this.state.dataView !== 'list') return '';

    let options = [];

    for(let i = 0; i < this.props.filterSettings.length; i++) {
      if (this.props.filterSettings[i].isSortable)
        options.push(<option key={`${this.props.filterSettings[i].dataName}-option`} value={this.props.filterSettings[i].dataName} defaultValue={this.state.sortBy === this.props.filterSettings[i].dataName ? 'selected' : ''} >{this.props.filterSettings[i].headerName}</option>)
    }

    return (
      <div className="col-md-6">
        <div className="form-group">
          <div className="input-group mb-2">
            <div className="input-group-prepend">
              <button className="input-group-text" ref={this.sortOrderButton} style={{"cursor": "pointer"}} onClick={this.onClickSortButton}>
                <i className={this.state.sortOrder === 'desc' ? 'fa fa-sort-alpha-desc': 'fa fa-sort-alpha-asc'} aria-hidden="true"></i>
              </button>
            </div>
            <select className="form-control" name="sortSelect" ref={this.sortSelect} onChange={this.onChangeSortSelect}>
              <option value="" >Sort By...</option>
              {options}
            </select>
          </div>
        </div>
      </div>
    )
  }

  renderGridHeaderView() {
    let tableHeaderColsArray = [];
    for(let i = 0; i < this.props.filterSettings.length; i++) {
      if (this.props.filterSettings[i].isSortable)
        tableHeaderColsArray.push( 
          <th 
            className={`sortable ${this.state.sortBy === this.props.filterSettings[i].dataName ? this.state.sortOrder : ''}`}
            key={`${i}-${this.props.filterSettings[i].headerName}`} 
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
              this.state.json.map((obj, index) => (<GridItemDataView key={index} obj={obj} filterSettings={this.props.filterSettings} />))}
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
            {this.renderListSortSelectView()}
          </div>
          <p>
            <a href="#formCollapse" className="mr-1" data-toggle="collapse" role="button" aria-expanded="false" aria-controls="formCollapse" onClick={this.clickFilterOptionsButton}>{this.state.filterButtonCollapsed ? "More Filters" : "Close Filters" }</a>&nbsp;
            <a href="#clearFilters" role="button" onClick={this.clickClearFilterButton}>Clear Filters</a>
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

export default DataView;