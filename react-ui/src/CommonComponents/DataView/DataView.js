import React, { Component } from 'react';
import GridDataView from '../GridDataView/GridDataView';
import ListDataView from '../ListDataView/ListDataView';
import SearchFilterCriteria from '../SearchFilterCriteria/SearchFilterCriteria';
import _ from 'lodash';

import './DataView.css';

class DataView extends Component {
  constructor(props) {
    super(props);
    const narrow =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(max-width: 767.98px)').matches;
    this.state = {
      json: this.props.json,
      jsonOriginal: this.props.jsonOriginal,
      fetching: this.props.fetching,
      sortBy: "",
      sortOrder: "",
      filterButtonCollapsed: true,
      dataView: narrow ? 'list' : 'grid',
      searchName: '',
      apiSidebarOpen: false,
      useSidebarNativeMultiSelect: narrow,
      isMobileViewport: narrow
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
    this.toggleApiSidebar = this.toggleApiSidebar.bind(this);
    this.closeApiSidebar = this.closeApiSidebar.bind(this);
  }

  componentDidMount() {
    this._onDocKeyDown = (e) => {
      if (e.key !== 'Escape') return;
      if (!this.isApiFilterSidebarMode()) return;
      if (!this.state.apiSidebarOpen) return;
      this.closeApiSidebar();
    };
    document.addEventListener('keydown', this._onDocKeyDown);

    if (typeof window !== 'undefined' && window.matchMedia) {
      this._sidebarNativeMultiMql = window.matchMedia('(max-width: 767.98px)');
      this._onSidebarNativeMultiMql = () => {
        const narrow = this._sidebarNativeMultiMql.matches;
        this.setState((prev) => {
          const next = {
            useSidebarNativeMultiSelect: narrow,
            isMobileViewport: narrow
          };
          if (narrow && prev.dataView === 'grid') {
            next.dataView = 'list';
          }
          return next;
        });
      };
      if (this._sidebarNativeMultiMql.addEventListener) {
        this._sidebarNativeMultiMql.addEventListener('change', this._onSidebarNativeMultiMql);
      } else {
        this._sidebarNativeMultiMql.addListener(this._onSidebarNativeMultiMql);
      }
    }
  }

  componentWillUnmount() {
    if (this._onDocKeyDown) document.removeEventListener('keydown', this._onDocKeyDown);
    if (this._sidebarNativeMultiMql && this._onSidebarNativeMultiMql) {
      if (this._sidebarNativeMultiMql.removeEventListener) {
        this._sidebarNativeMultiMql.removeEventListener('change', this._onSidebarNativeMultiMql);
      } else {
        this._sidebarNativeMultiMql.removeListener(this._onSidebarNativeMultiMql);
      }
    }
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
    if (this.state.isMobileViewport) return;
    this.setState({ dataView: 'grid' });
  }

  changeToListView(event) {
    this.setState({ dataView: 'list' });
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

  formatFilterOptionLabel(filter, opt) {
    return typeof filter.formatOptionLabel === 'function'
      ? filter.formatOptionLabel(opt)
      : opt;
  }

  rangeFilterStableKey(filter) {
    return `${filter.minParam}-${filter.maxParam}`;
  }

  isApiFilterSidebarMode() {
    const { apiFilterLayout, apiFilterConfig, onApiFilterChange } = this.props;
    return (
      apiFilterLayout === 'sidebar' &&
      apiFilterConfig &&
      Array.isArray(apiFilterConfig) &&
      apiFilterConfig.length > 0 &&
      typeof onApiFilterChange === 'function'
    );
  }

  getEmptyApiFilterState() {
    const { apiFilterConfig } = this.props;
    const empty = {};
    (apiFilterConfig || []).forEach((f) => {
      if (f.filterType === 'range') {
        empty[f.minParam] = f.minBound;
        empty[f.maxParam] = f.maxBound;
      } else if (f.paramKey != null) {
        empty[f.paramKey] = f.multiSelect ? [] : '';
      }
    });
    return empty;
  }

  hasActiveApiFilters() {
    const { apiFilterConfig, apiFilterState } = this.props;
    if (!apiFilterConfig || !apiFilterState) return false;
    return apiFilterConfig.some((f) => {
      if (f.filterType === 'range') {
        const minV = Number(apiFilterState[f.minParam]);
        const maxV = Number(apiFilterState[f.maxParam]);
        const lo = Number(f.minBound);
        const hi = Number(f.maxBound);
        if (Number.isNaN(minV) || Number.isNaN(maxV)) return false;
        return minV > lo || maxV < hi;
      }
      const v = apiFilterState[f.paramKey];
      if (f.multiSelect) return Array.isArray(v) && v.length > 0;
      return v != null && String(v).trim() !== '';
    });
  }

  toggleApiSidebar() {
    this.setState((s) => ({ apiSidebarOpen: !s.apiSidebarOpen }));
  }

  closeApiSidebar() {
    this.setState({ apiSidebarOpen: false });
  }

  // RENDER FUNCTIONS

  renderApiFilters() {
    const { apiFilterConfig, apiFilterState, onApiFilterChange } = this.props;
    if (!apiFilterConfig || !Array.isArray(apiFilterConfig) || apiFilterConfig.length === 0) return null;
    if (typeof onApiFilterChange !== 'function') return null;
    if (this.isApiFilterSidebarMode()) return null;

    const getEmptyFilterState = () => this.getEmptyApiFilterState();
    const hasActiveFilters = () => this.hasActiveApiFilters();

    return (
      <div className="dataview-api-filters">
        <div className="input-group input-group-sm flex-wrap">
          {apiFilterConfig.map((filter) => (
            <div
              key={filter.filterType === 'range' ? this.rangeFilterStableKey(filter) : filter.paramKey}
              className="dataview-api-filters__item"
            >
              {filter.filterType === 'range'
                ? this.renderInlineRangeFilter(filter, apiFilterState, onApiFilterChange)
                : filter.multiSelect
                  ? this.renderMultiSelectFilter(filter, apiFilterState, onApiFilterChange)
                  : this.renderSingleSelectFilter(filter, apiFilterState, onApiFilterChange)}
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

  renderApiFiltersSidebarPanel() {
    const { apiFilterConfig, apiFilterState, onApiFilterChange } = this.props;
    if (!apiFilterConfig || !Array.isArray(apiFilterConfig) || apiFilterConfig.length === 0) return null;
    if (typeof onApiFilterChange !== 'function') return null;

    const hasActive = this.hasActiveApiFilters();

    return (
      <div className="dataview-sidebar__scroll">
        <div className="dataview-sidebar__inner">
          <div className="dataview-sidebar__header">
            <h2 className="dataview-sidebar__title h6 mb-0" id="dataview-api-sidebar-title">
              Filters
            </h2>
            <div className="dataview-sidebar__header-actions">
              <button
                type="button"
                className="btn btn-sm btn-link text-decoration-none p-0 d-none d-md-inline-block"
                onClick={this.closeApiSidebar}
              >
                Hide
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary rounded-pill dataview-sidebar__close d-md-none"
                onClick={this.closeApiSidebar}
                aria-label="Close filters"
              >
                <i className="fa fa-times" aria-hidden="true" />
              </button>
            </div>
          </div>
          <p className="dataview-sidebar__hint small text-body-secondary mb-3 d-none d-md-block">
            Narrow the list by selecting one or more values per field.
          </p>
          <div className="dataview-sidebar__fields">
            {apiFilterConfig.map((filter) => (
              <div
                key={filter.filterType === 'range' ? this.rangeFilterStableKey(filter) : filter.paramKey}
                className="dataview-sidebar__field"
              >
                {filter.filterType === 'range'
                  ? this.renderSidebarRangeFilter(filter, apiFilterState, onApiFilterChange)
                  : filter.multiSelect
                    ? this.renderSidebarMultiSelectFilter(filter, apiFilterState, onApiFilterChange)
                    : this.renderSidebarSingleSelectFilter(filter, apiFilterState, onApiFilterChange)}
              </div>
            ))}
          </div>
          <div className="dataview-sidebar__footer">
            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              disabled={!hasActive}
              onClick={() => onApiFilterChange(this.getEmptyApiFilterState())}
            >
              Clear all filters
            </button>
          </div>
        </div>
      </div>
    );
  }

  renderSidebarMultiSelectFilter(filter, apiFilterState, onApiFilterChange) {
    const selected = Array.isArray(apiFilterState && apiFilterState[filter.paramKey]) ? apiFilterState[filter.paramKey] : [];
    const options = filter.options || [];
    const toggleValue = (opt) => {
      const nextSelected = selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt];
      const next = { ...(apiFilterState || {}), [filter.paramKey]: nextSelected };
      onApiFilterChange(next);
    };

    const nativeId = `dataview-sidebar-native-multi-${filter.paramKey}`;
    const listboxSize = Math.min(Math.max(options.length, 3), 5);

    if (this.state.useSidebarNativeMultiSelect) {
      return (
        <div>
          <label className="form-label fw-semibold mb-1" htmlFor={nativeId}>
            {filter.label}
          </label>
          <select
            id={nativeId}
            className="form-select form-select-sm dataview-sidebar-filter__native-multi"
            multiple
            size={options.length === 0 ? 2 : listboxSize}
            value={selected}
            disabled={options.length === 0}
            onChange={(e) => {
              const nextVals = Array.from(e.target.selectedOptions, (o) => o.value);
              const next = { ...(apiFilterState || {}), [filter.paramKey]: nextVals };
              onApiFilterChange(next);
            }}
            aria-label={`Filter by ${filter.label}`}
          >
            {options.length === 0 ? (
              <option value="" disabled>
                No options
              </option>
            ) : (
              options.map((opt) => (
                <option key={opt} value={opt}>
                  {this.formatFilterOptionLabel(filter, opt)}
                </option>
              ))
            )}
          </select>
        </div>
      );
    }

    const buttonLabel = selected.length === 0 ? `${filter.label}: All` : `${filter.label}: ${selected.length} selected`;

    return (
      <div>
        <label className="form-label fw-semibold mb-1" id={`dataview-sidebar-multi-label-${filter.paramKey}`}>
          {filter.label}
        </label>
        <div className="dropdown w-100 dataview-sidebar-filter__dropdown">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm dropdown-toggle w-100 text-start dataview-sidebar-filter__dropdown-btn"
            id={`dataview-sidebar-multi-${filter.paramKey}`}
            data-bs-toggle="dropdown"
            data-bs-auto-close="outside"
            aria-expanded="false"
            aria-labelledby={`dataview-sidebar-multi-label-${filter.paramKey}`}
            aria-label={`Filter by ${filter.label}`}
          >
            <span className="dataview-sidebar-filter__dropdown-label text-truncate">{buttonLabel}</span>
          </button>
          <div
            className="dropdown-menu w-100 dataview-sidebar-filter__dropdown-menu"
            aria-labelledby={`dataview-sidebar-multi-${filter.paramKey}`}
          >
            {options.map((opt) => (
              <label
                key={opt}
                className="dropdown-item mb-0 d-flex align-items-center text-wrap text-break"
                style={{ cursor: 'pointer' }}
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  className="form-check-input flex-shrink-0 me-2"
                  checked={selected.includes(opt)}
                  onChange={() => toggleValue(opt)}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={this.formatFilterOptionLabel(filter, opt)}
                />
                <span className="small">{this.formatFilterOptionLabel(filter, opt)}</span>
              </label>
            ))}
            {options.length === 0 && (
              <span className="dropdown-item text-body-secondary">No options</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  renderSidebarSingleSelectFilter(filter, apiFilterState, onApiFilterChange) {
    const value = apiFilterState && apiFilterState[filter.paramKey] != null ? apiFilterState[filter.paramKey] : '';
    return (
      <div>
        <label className="form-label fw-semibold mb-2" htmlFor={`dataview-sidebar-ss-${filter.paramKey}`}>
          {filter.label}
        </label>
        <select
          id={`dataview-sidebar-ss-${filter.paramKey}`}
          className="form-select form-select-sm"
          value={value}
          onChange={(e) => {
            const next = { ...(apiFilterState || {}), [filter.paramKey]: e.target.value };
            onApiFilterChange(next);
          }}
          aria-label={`Filter by ${filter.label}`}
        >
          <option value="">All</option>
          {(filter.options || []).map((opt) => (
            <option key={opt} value={opt}>{this.formatFilterOptionLabel(filter, opt)}</option>
          ))}
        </select>
      </div>
    );
  }

  renderApiFilterToolbarToggle() {
    if (!this.isApiFilterSidebarMode()) return null;
    const open = this.state.apiSidebarOpen;
    const dirty = this.hasActiveApiFilters();

    return (
      <button
        type="button"
        className={`btn btn-sm dataview-sidebar-toggle d-inline-flex align-items-center ${open ? 'btn-secondary' : 'btn-outline-secondary'} ${dirty && !open ? 'dataview-sidebar-toggle--dirty' : ''}`}
        onClick={this.toggleApiSidebar}
        aria-expanded={open}
        aria-controls="dataview-api-sidebar"
        title="Show or hide filters"
      >
        <i className="fa fa-filter me-md-1" aria-hidden="true" />
        <span className="d-none d-md-inline">Filters</span>
        {dirty ? <span className="visually-hidden"> (filters active)</span> : null}
      </button>
    );
  }

  renderApiFilterSidebarLayout(mainColumn) {
    const open = this.state.apiSidebarOpen;
    const sidebarCollapsedClass = open ? '' : ' dataview-sidebar--collapsed';

    return (
      <div
        className={`dataview-layout dataview-layout--with-sidebar${open ? '' : ' dataview-layout--sidebar-retracted'}`}
      >
        <div
          className={`dataview-sidebar-backdrop${open ? ' is-visible' : ''}`}
          onClick={this.closeApiSidebar}
          role="presentation"
          aria-hidden="true"
        />
        <aside
          id="dataview-api-sidebar"
          className={`dataview-sidebar dataview-sidebar--sticky${sidebarCollapsedClass}`}
          aria-labelledby="dataview-api-sidebar-title"
        >
          {this.renderApiFiltersSidebarPanel()}
        </aside>
        <div className="dataview-main flex-grow-1">
          {mainColumn}
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
            <option key={opt} value={opt}>{this.formatFilterOptionLabel(filter, opt)}</option>
          ))}
        </select>
      </div>
    );
  }

  renderSidebarRangeFilter(filter, apiFilterState, onApiFilterChange) {
    const minBound = Number(filter.minBound);
    const maxBound = Number(filter.maxBound);
    let minVal = Number(apiFilterState?.[filter.minParam]);
    let maxVal = Number(apiFilterState?.[filter.maxParam]);
    if (Number.isNaN(minVal)) minVal = minBound;
    if (Number.isNaN(maxVal)) maxVal = maxBound;
    minVal = Math.min(maxBound, Math.max(minBound, minVal));
    maxVal = Math.min(maxBound, Math.max(minBound, maxVal));
    if (minVal > maxVal) maxVal = minVal;

    const suffix = filter.rangeValueSuffix != null ? String(filter.rangeValueSuffix) : '';
    const k = this.rangeFilterStableKey(filter);

    const bumpMin = (raw) => {
      let curMax = Number(apiFilterState?.[filter.maxParam]);
      if (Number.isNaN(curMax)) curMax = maxBound;
      curMax = Math.min(maxBound, Math.max(minBound, curMax));
      let nextMin = Math.min(maxBound, Math.max(minBound, Number(raw)));
      nextMin = Math.min(nextMin, curMax);
      onApiFilterChange({ ...(apiFilterState || {}), [filter.minParam]: nextMin });
    };

    const bumpMax = (raw) => {
      let curMin = Number(apiFilterState?.[filter.minParam]);
      if (Number.isNaN(curMin)) curMin = minBound;
      curMin = Math.min(maxBound, Math.max(minBound, curMin));
      let nextMax = Math.min(maxBound, Math.max(minBound, Number(raw)));
      nextMax = Math.max(nextMax, curMin);
      onApiFilterChange({ ...(apiFilterState || {}), [filter.maxParam]: nextMax });
    };

    return (
      <div className="dataview-sidebar__range">
        <div className="fw-semibold mb-2">{filter.label}</div>
        <div className="mb-3">
          <label className="form-label small mb-1" htmlFor={`dataview-sidebar-range-min-${k}`}>
            Min
          </label>
          <input
            type="range"
            className="form-range"
            id={`dataview-sidebar-range-min-${k}`}
            min={minBound}
            max={maxBound}
            step={filter.rangeStep != null ? Number(filter.rangeStep) : 1}
            value={minVal}
            onChange={(e) => bumpMin(e.target.value)}
            aria-valuemin={minBound}
            aria-valuemax={maxBound}
            aria-valuenow={minVal}
            aria-label={`${filter.label} minimum`}
          />
          <output className="small text-body-secondary">{minVal}{suffix}</output>
        </div>
        <div>
          <label className="form-label small mb-1" htmlFor={`dataview-sidebar-range-max-${k}`}>
            Max
          </label>
          <input
            type="range"
            className="form-range"
            id={`dataview-sidebar-range-max-${k}`}
            min={minBound}
            max={maxBound}
            step={filter.rangeStep != null ? Number(filter.rangeStep) : 1}
            value={maxVal}
            onChange={(e) => bumpMax(e.target.value)}
            aria-valuemin={minBound}
            aria-valuemax={maxBound}
            aria-valuenow={maxVal}
            aria-label={`${filter.label} maximum`}
          />
          <output className="small text-body-secondary">{maxVal}{suffix}</output>
        </div>
      </div>
    );
  }

  renderInlineRangeFilter(filter, apiFilterState, onApiFilterChange) {
    const minBound = Number(filter.minBound);
    const maxBound = Number(filter.maxBound);
    let minVal = Number(apiFilterState?.[filter.minParam]);
    let maxVal = Number(apiFilterState?.[filter.maxParam]);
    if (Number.isNaN(minVal)) minVal = minBound;
    if (Number.isNaN(maxVal)) maxVal = maxBound;
    minVal = Math.min(maxBound, Math.max(minBound, minVal));
    maxVal = Math.min(maxBound, Math.max(minBound, maxVal));
    if (minVal > maxVal) maxVal = minVal;

    const suffix = filter.rangeValueSuffix != null ? String(filter.rangeValueSuffix) : '';
    const k = this.rangeFilterStableKey(filter);

    const bumpMin = (raw) => {
      let curMax = Number(apiFilterState?.[filter.maxParam]);
      if (Number.isNaN(curMax)) curMax = maxBound;
      curMax = Math.min(maxBound, Math.max(minBound, curMax));
      let nextMin = Math.min(maxBound, Math.max(minBound, Number(raw)));
      nextMin = Math.min(nextMin, curMax);
      onApiFilterChange({ ...(apiFilterState || {}), [filter.minParam]: nextMin });
    };

    const bumpMax = (raw) => {
      let curMin = Number(apiFilterState?.[filter.minParam]);
      if (Number.isNaN(curMin)) curMin = minBound;
      curMin = Math.min(maxBound, Math.max(minBound, curMin));
      let nextMax = Math.min(maxBound, Math.max(minBound, Number(raw)));
      nextMax = Math.max(nextMax, curMin);
      onApiFilterChange({ ...(apiFilterState || {}), [filter.maxParam]: nextMax });
    };

    const step = filter.rangeStep != null ? Number(filter.rangeStep) : 1;

    return (
      <div className="dataview-api-filters__range input-group input-group-sm d-inline-flex flex-column align-items-stretch flex-shrink-0 me-1 mb-1 border rounded px-2 py-2">
        <span className="fw-semibold small mb-2">{filter.label}</span>
        <div className="d-flex flex-wrap align-items-center gap-1 mb-1">
          <label className="small mb-0 me-1" htmlFor={`dataview-inline-range-min-${k}`}>
            Min
          </label>
          <input
            type="range"
            className="form-range flex-grow-1"
            style={{ minWidth: '6rem' }}
            id={`dataview-inline-range-min-${k}`}
            min={minBound}
            max={maxBound}
            step={step}
            value={minVal}
            onChange={(e) => bumpMin(e.target.value)}
            aria-label={`${filter.label} minimum`}
          />
          <span className="small text-body-secondary text-nowrap">
            {minVal}
            {suffix}
          </span>
        </div>
        <div className="d-flex flex-wrap align-items-center gap-1 mb-0">
          <label className="small mb-0 me-1" htmlFor={`dataview-inline-range-max-${k}`}>
            Max
          </label>
          <input
            type="range"
            className="form-range flex-grow-1"
            style={{ minWidth: '6rem' }}
            id={`dataview-inline-range-max-${k}`}
            min={minBound}
            max={maxBound}
            step={step}
            value={maxVal}
            onChange={(e) => bumpMax(e.target.value)}
            aria-label={`${filter.label} maximum`}
          />
          <span className="small text-body-secondary text-nowrap">
            {maxVal}
            {suffix}
          </span>
        </div>
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
                aria-label={this.formatFilterOptionLabel(filter, opt)}
              />
              {this.formatFilterOptionLabel(filter, opt)}
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

    const effectiveView = this.state.isMobileViewport ? 'list' : this.state.dataView;
    if (effectiveView === 'list') {
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
    const effectiveView = this.state.isMobileViewport ? 'list' : this.state.dataView;
    if (effectiveView !== 'list') return '';

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
    const sidebarMode = this.isApiFilterSidebarMode();

    const cardInner = (
      <div className="card mb-3">
        <div className="card-body">
          <form onSubmit={this.submitFilterSearch} className="dataview-search-form">
            {(sidebarMode || !this.state.isMobileViewport) && (
              <div className="row mb-3 dataview-view-toggle-row align-items-center g-2">
                {sidebarMode ? <div className="col-auto">{this.renderApiFilterToolbarToggle()}</div> : null}
                {!this.state.isMobileViewport ? (
                  <div className={sidebarMode ? 'col-12 col-md-auto' : 'col-12'}>
                    <div className="btn-group btn-group-sm dataview-view-toggle w-100 w-md-auto" role="group" aria-label="View toggle">
                      <button type="button" className={`btn ${this.state.dataView === 'grid' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={this.changeToGridView}>Grid</button>
                      <button type="button" className={`btn ${this.state.dataView === 'list' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={this.changeToListView}>List</button>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
            <div className="row align-items-center g-2 mb-3">
              <div className="col-12 col-md-6">
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
    );

    const mainColumn = (
      <React.Fragment>
        {cardInner}
        <p className="mb-0">
          {this.state.fetching ? '' : `${this.state.json.length} Items`}
        </p>
        {this.state.fetching ? '' : this.renderDataView(this.state.json)}
      </React.Fragment>
    );

    return (
      <React.Fragment>
        {sidebarMode ? this.renderApiFilterSidebarLayout(mainColumn) : mainColumn}
      </React.Fragment>
    );
  }
}

export default DataView;