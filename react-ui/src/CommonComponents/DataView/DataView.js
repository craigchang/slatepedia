import React, { Component } from 'react';
import GridDataView from '../GridDataView/GridDataView';
import ListDataView from '../ListDataView/ListDataView';
import SearchFilterCriteria from '../SearchFilterCriteria/SearchFilterCriteria';
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
      dataView: 'grid',
      searchName: ''
    };
    this.sortSelect = React.createRef();
    this.sortOrderButton = React.createRef();

    this.changeToGridView = this.changeToGridView.bind(this);
    this.changeToListView = this.changeToListView.bind(this);
    this.clickFilterOptionsButton = this.clickFilterOptionsButton.bind(this);
    this.clickClearFilterButton = this.clickClearFilterButton.bind(this);
    this.submitFilterSearch = this.submitFilterSearch.bind(this);
    this.handleSearchNameChange = this.handleSearchNameChange.bind(this);
    this.clickTableColumnHeader = this.clickTableColumnHeader.bind(this);

    this.onClickSortButton = this.onClickSortButton.bind(this);
    this.onChangeSortSelect = this.onChangeSortSelect.bind(this);
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {
    if (prevProps.jsonOriginal !== this.props.jsonOriginal || prevProps.json !== this.props.json) {
      let json = this.props.json;
      let jsonOriginal = this.props.jsonOriginal;
      if (this.state.searchName && jsonOriginal && jsonOriginal.length) {
        const term = this.state.searchName.toLowerCase();
        json = jsonOriginal.filter(
          (obj) => obj.name && obj.name.toLowerCase().indexOf(term) !== -1
        );
        if (this.state.sortBy && this.state.sortOrder) {
          json = _.orderBy(json, this.state.sortBy, this.state.sortOrder);
        }
      }
      this.setState({ json: json || [], jsonOriginal: jsonOriginal || [] });
    }
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

    let results = (this.state.jsonOriginal || []).slice();
    this.clearSorting();

    this.setState({
      json: results,
      sortBy: '',
      sortOrder: '',
      searchName: ''
    });
  }

  clickTableColumnHeader(event, dataName) {
    event.preventDefault();

    let tableHeaderColumn = event.target;
    let sortOrder = 'asc';
    let results = this.state.json.slice();

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

    const sortOrder = this.state.sortOrder || 'asc';
    let results = this.state.json.slice();
    results = _.orderBy(results, dataName, sortOrder);

    this.setState({
      json: results,
      sortBy: dataName,
      sortOrder: sortOrder
    });
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

  handleSearchNameChange(value) {
    let results = (this.state.jsonOriginal || []).slice();
    if (value !== '') {
      results = _.filter(results, (obj) =>
        obj.name && obj.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    }
    if (this.state.sortBy && this.state.sortOrder) {
      results = _.orderBy(results, this.state.sortBy, this.state.sortOrder);
    }
    this.setState({ searchName: value, json: results });
  }

  submitFilterSearch(event) {
    event.preventDefault();

    let results = (this.state.jsonOriginal || []).slice();

    if (this.state.searchName !== '') {
      results = _.filter(results, (obj) =>
        obj.name && obj.name.toLowerCase().indexOf(this.state.searchName.toLowerCase()) !== -1
      );
    }
    if (this.state.sortBy && this.state.sortOrder) {
      results = _.orderBy(results, this.state.sortBy, this.state.sortOrder);
    }
    this.setState({ json: results });
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

  renderApiFilters() {
    const { apiFilterConfig, apiFilterState, onApiFilterChange } = this.props;
    if (!apiFilterConfig || !Array.isArray(apiFilterConfig) || apiFilterConfig.length === 0) return null;
    if (typeof onApiFilterChange !== 'function') return null;

    const getEmptyFilterState = () => {
      const empty = {};
      apiFilterConfig.forEach((f) => {
        empty[f.paramKey] = f.multiSelect ? [] : '';
      });
      return empty;
    };

    const hasActiveFilters = () => {
      if (!apiFilterState) return false;
      return apiFilterConfig.some((f) => {
        const v = apiFilterState[f.paramKey];
        if (f.multiSelect) return Array.isArray(v) && v.length > 0;
        return v != null && String(v).trim() !== '';
      });
    };

    return (
      <div className="dataview-api-filters">
        <div className="input-group input-group-sm flex-wrap">
          {apiFilterConfig.map((filter) => (
            <div key={filter.paramKey} className="dataview-api-filters__item">
              {filter.multiSelect ? this.renderMultiSelectFilter(filter, apiFilterState, onApiFilterChange) : this.renderSingleSelectFilter(filter, apiFilterState, onApiFilterChange)}
            </div>
          ))}
          <button
            type="button"
            className={`btn btn-outline-secondary dataview-api-filters__clear ${!hasActiveFilters() ? 'dataview-api-filters__clear--hidden' : ''}`}
            onClick={() => onApiFilterChange(getEmptyFilterState())}
            aria-label="Clear all filters"
            aria-hidden={!hasActiveFilters()}
          >
            Clear filters
          </button>
        </div>
      </div>
    );
  }

  renderSingleSelectFilter(filter, apiFilterState, onApiFilterChange) {
    const value = apiFilterState && apiFilterState[filter.paramKey] != null ? apiFilterState[filter.paramKey] : '';
    return (
      <div className="input-group input-group-sm d-inline-flex flex-nowrap me-1 mb-1 mb-md-0">
        <label className="input-group-text mb-0 rounded-start" htmlFor={`dataview-filter-${filter.paramKey}`}>{filter.label}</label>
        <select
          id={`dataview-filter-${filter.paramKey}`}
          className="form-select form-select-sm rounded-end"
          value={value}
          onChange={(e) => {
            const next = { ...(apiFilterState || {}), [filter.paramKey]: e.target.value };
            onApiFilterChange(next);
          }}
          aria-label={`Filter by ${filter.label}`}
        >
          <option value="">All</option>
          {(filter.options || []).map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    );
  }

  renderMultiSelectFilter(filter, apiFilterState, onApiFilterChange) {
    const selected = Array.isArray(apiFilterState && apiFilterState[filter.paramKey]) ? apiFilterState[filter.paramKey] : [];
    const options = filter.options || [];
    const toggleValue = (opt) => {
      const nextSelected = selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt];
      const next = { ...(apiFilterState || {}), [filter.paramKey]: nextSelected };
      onApiFilterChange(next);
    };

    const buttonLabel = selected.length === 0 ? `${filter.label}: All` : `${filter.label}: ${selected.length} selected`;

    return (
      <div className="dropdown dataview-api-filters__dropdown">
        <button
          type="button"
          className="btn btn-outline-secondary dropdown-toggle dataview-api-filters__dropdown-btn"
          id={`dataview-multi-${filter.paramKey}`}
          data-bs-toggle="dropdown"
          data-bs-auto-close="outside"
          aria-expanded="false"
          aria-label={`Filter by ${filter.label}`}
        >
          {buttonLabel}
        </button>
        <div className="dropdown-menu dropdown-menu-start dataview-api-filters__dropdown-menu" aria-labelledby={`dataview-multi-${filter.paramKey}`}>
          {options.map((opt) => (
            <label
              key={opt}
              className="dropdown-item mb-0 d-flex align-items-center"
              style={{ cursor: 'pointer' }}
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                className="me-2"
                checked={selected.includes(opt)}
                onChange={() => toggleValue(opt)}
                onClick={(e) => e.stopPropagation()}
                aria-label={opt}
              />
              {opt}
            </label>
          ))}
          {options.length === 0 && (
            <span className="dropdown-item text-body-secondary">No options</span>
          )}
        </div>
      </div>
    );
  }

  renderDataView(json) {
    if (json == null || json.length === 0) return null;

    if (this.state.dataView === 'list') {
      return (
        <ListDataView
          json={json}
          fetching={this.state.fetching}
          filterSettings={this.props.filterSettings}
        />
      );
    }
    return (
      <GridDataView
        json={json}
        fetching={this.state.fetching}
        filterSettings={this.props.filterSettings}
        sortBy={this.state.sortBy}
        sortOrder={this.state.sortOrder}
        onColumnHeaderClick={this.clickTableColumnHeader}
      />
    );
  }

  renderListSortSelectView() {
    if (this.state.dataView !== 'list') return '';

    let options = [];

    for(let i = 0; i < this.props.filterSettings.length; i++) {
      if (this.props.filterSettings[i].isSortable)
        options.push(<option key={`${this.props.filterSettings[i].dataName}-option`} value={this.props.filterSettings[i].dataName}>{this.props.filterSettings[i].headerName}</option>)
    }

    return (
      <div className="col-12 col-md">
        <div className="input-group input-group-sm">
          <button type="button" className="input-group-text rounded-start flex-shrink-0" ref={this.sortOrderButton} style={{ cursor: 'pointer' }} onClick={this.onClickSortButton} aria-label="Sort order">
            <i className={this.state.sortOrder === 'desc' ? 'fa fa-sort-alpha-desc' : 'fa fa-sort-alpha-asc'} aria-hidden="true"></i>
          </button>
          <select className="form-select form-select-sm rounded-end" name="sortSelect" ref={this.sortSelect} value={this.state.sortBy || ''} onChange={this.onChangeSortSelect} aria-label="Sort by">
            <option value="">Sort by...</option>
            {options}
          </select>
        </div>
      </div>
    )
  }

  render() {
    return (
      <React.Fragment>
        <div className="card mb-3">
          <div className="card-body">
            <form onSubmit={this.submitFilterSearch} className="dataview-search-form">
              <div className="row mb-3 dataview-view-toggle-row">
                <div className="col-12">
                  <div className="btn-group btn-group-sm dataview-view-toggle" role="group" aria-label="View toggle">
                    <button type="button" className={`btn ${this.state.dataView === 'grid' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={this.changeToGridView}>Grid</button>
                    <button type="button" className={`btn ${this.state.dataView === 'list' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={this.changeToListView}>List</button>
                  </div>
                </div>
              </div>
              <div className="row align-items-center g-2 mb-3">
                <div className="col-12 col-md">
                  <SearchFilterCriteria
                    searchName={this.state.searchName}
                    onSearchNameChange={this.handleSearchNameChange}
                    placeholder="Search by Name"
                  />
                </div>
                {this.renderListSortSelectView()}
              </div>
              {this.renderApiFilters()}
            </form>
          </div>
        </div>
        <p className="mb-0">
          {this.state.fetching ? '' : `${this.state.json.length} Items`}
        </p>
        {this.state.fetching ? '' : this.renderDataView(this.state.json)}
      </React.Fragment>
    );
  }
}

export default DataView;