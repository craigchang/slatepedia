import React, { Component } from 'react';
import DataView from '../CommonComponents/DataView/DataView';
import Loading from '../CommonComponents/Loading/Loading';

import './Weapons.css';
import './WeaponSprites.css';

function computeWeaponFilterBounds(rows) {
  const list = rows && rows.length ? rows : [];
  if (!list.length) {
    return {
      attackPowerBase: { min: 0, max: 999 },
      durabilityBase: { min: 0, max: 999 },
      throwDistanceBase: { min: 0, max: 999 }
    };
  }
  let apMin = Infinity;
  let apMax = -Infinity;
  let dMin = Infinity;
  let dMax = -Infinity;
  let tdMin = Infinity;
  let tdMax = -Infinity;
  list.forEach((w) => {
    const ap = Number(w.attackPowerBase);
    const d = Number(w.durabilityBase);
    const td = Number(w.throwDistanceBase);
    if (Number.isFinite(ap)) {
      apMin = Math.min(apMin, ap);
      apMax = Math.max(apMax, ap);
    }
    if (Number.isFinite(d)) {
      dMin = Math.min(dMin, d);
      dMax = Math.max(dMax, d);
    }
    if (Number.isFinite(td)) {
      tdMin = Math.min(tdMin, td);
      tdMax = Math.max(tdMax, td);
    }
  });
  if (!Number.isFinite(apMin) || !Number.isFinite(apMax)) {
    apMin = 0;
    apMax = 999;
  }
  if (!Number.isFinite(dMin) || !Number.isFinite(dMax)) {
    dMin = 0;
    dMax = 999;
  }
  if (!Number.isFinite(tdMin) || !Number.isFinite(tdMax)) {
    tdMin = 0;
    tdMax = 999;
  }
  return {
    attackPowerBase: { min: apMin, max: apMax },
    durabilityBase: { min: dMin, max: dMax },
    throwDistanceBase: { min: tdMin, max: tdMax }
  };
}

function defaultApiFilterState(bounds) {
  return {
    attackPowerBaseMin: bounds.attackPowerBase.min,
    attackPowerBaseMax: bounds.attackPowerBase.max,
    durabilityBaseMin: bounds.durabilityBase.min,
    durabilityBaseMax: bounds.durabilityBase.max,
    throwDistanceBaseMin: bounds.throwDistanceBase.min,
    throwDistanceBaseMax: bounds.throwDistanceBase.max,
    availability: []
  };
}

class Weapons extends Component {
  constructor(props) {
    super(props);
    const emptyBounds = computeWeaponFilterBounds([]);
    this.state = {
      json: null,
      jsonOriginal: null,
      allDataForFilterOptions: null,
      filterBounds: null,
      fetching: true,
      apiFilterState: defaultApiFilterState(emptyBounds)
    };
    this.fetchWeapons = this.fetchWeapons.bind(this);
    this.handleApiFilterChange = this.handleApiFilterChange.bind(this);
  }

  fetchWeapons(queryParams = {}, boundsOverride = null) {
    const params = new URLSearchParams();
    const bounds = boundsOverride || this.state.filterBounds;

    Object.keys(queryParams).forEach((key) => {
      const v = queryParams[key];
      if (v == null) return;
      if (typeof v === 'string' && v.trim() === '') return;
      if (Array.isArray(v)) {
        const trimmed = v.map((x) => String(x).trim()).filter((x) => x !== '');
        if (trimmed.length > 0) params.set(key, trimmed.join(','));
      } else if (Number.isFinite(Number(v))) {
        const n = Number(v);
        if (
          bounds &&
          ((key === 'attackPowerBaseMin' && n <= bounds.attackPowerBase.min) ||
            (key === 'attackPowerBaseMax' && n >= bounds.attackPowerBase.max) ||
            (key === 'durabilityBaseMin' && n <= bounds.durabilityBase.min) ||
            (key === 'durabilityBaseMax' && n >= bounds.durabilityBase.max) ||
            (key === 'throwDistanceBaseMin' && n <= bounds.throwDistanceBase.min) ||
            (key === 'throwDistanceBaseMax' && n >= bounds.throwDistanceBase.max))
        ) {
          return;
        }
        params.set(key, String(n));
      } else if (String(v).trim() !== '') {
        params.set(key, String(v).trim());
      }
    });

    const url = params.toString() ? `/api/weapons?${params.toString()}` : '/api/weapons';
    return fetch(url).then((response) => {
      if (!response.ok) throw new Error(`status ${response.status}`);
      return response.json();
    });
  }

  handleApiFilterChange(nextFilterState) {
    const fb =
      this.state.filterBounds ||
      computeWeaponFilterBounds(this.state.allDataForFilterOptions || []);
    const empty = defaultApiFilterState(fb);
    const next = nextFilterState || empty;
    const bounds = this.state.filterBounds || fb;

    this.setState({ apiFilterState: next });
    this.fetchWeapons(next, bounds)
      .then((json) => {
        this.setState({
          json,
          jsonOriginal: json,
          fetching: false
        });
      })
      .catch(() => {
        this.setState({
          json: null,
          jsonOriginal: null,
          fetching: false
        });
      });
  }

  getAvailabilityOptions() {
    const list = this.state.allDataForFilterOptions || [];
    const set = new Set();
    list.forEach((w) => {
      if (Array.isArray(w.availabilities)) {
        w.availabilities.forEach((a) => {
          if (a && String(a).trim()) set.add(String(a).trim());
        });
      }
    });
    return Array.from(set).sort();
  }

  componentDidMount() {
    this.fetchWeapons({})
      .then((json) => {
        const bounds = computeWeaponFilterBounds(json);
        this.setState({
          json,
          jsonOriginal: json,
          allDataForFilterOptions: json,
          filterBounds: bounds,
          apiFilterState: defaultApiFilterState(bounds),
          fetching: false
        });
      })
      .catch(() => {
        this.setState({
          json: null,
          jsonOriginal: null,
          allDataForFilterOptions: null,
          filterBounds: null,
          fetching: false
        });
      });
  }

  render() {
    const bounds =
      this.state.filterBounds ||
      computeWeaponFilterBounds(this.state.allDataForFilterOptions || []);

    const apiFilterConfig = [
      {
        filterType: 'range',
        label: 'Attack Power Base',
        minParam: 'attackPowerBaseMin',
        maxParam: 'attackPowerBaseMax',
        minBound: bounds.attackPowerBase.min,
        maxBound: bounds.attackPowerBase.max,
        rangeStep: 1
      },
      {
        filterType: 'range',
        label: 'Durability Base',
        minParam: 'durabilityBaseMin',
        maxParam: 'durabilityBaseMax',
        minBound: bounds.durabilityBase.min,
        maxBound: bounds.durabilityBase.max,
        rangeStep: 1
      },
      {
        filterType: 'range',
        label: 'Throw Distance',
        minParam: 'throwDistanceBaseMin',
        maxParam: 'throwDistanceBaseMax',
        minBound: bounds.throwDistanceBase.min,
        maxBound: bounds.throwDistanceBase.max,
        rangeStep: 1
      },
      {
        paramKey: 'availability',
        label: 'Availabilities',
        options: this.getAvailabilityOptions(),
        multiSelect: true
      }
    ];

    return (
      <div>
        <div className="container-nonresponsive container-results page-weapons">
          <h1 className="page-header">Weapons</h1>
          {this.state.fetching && !this.state.json ? (
            <Loading />
          ) : (
            <DataView
              json={this.state.json}
              jsonOriginal={this.state.jsonOriginal}
              fetching={this.state.fetching}
              apiFilterLayout="sidebar"
              apiFilterConfig={apiFilterConfig}
              apiFilterState={this.state.apiFilterState}
              onApiFilterChange={this.handleApiFilterChange}
              filterSettings={[
                {
                  dataName: null,
                  headerName: 'Icon',
                  dataType: 'image',
                  imageFolder: '/images/weapons',
                  imageCssDataName: 'cssClassName',
                  spriteSheet: 'weapons',
                  isSortable: false,
                  isFilterable: false
                },
                {
                  dataName: 'name',
                  headerName: 'Name',
                  dataType: 'string',
                  detailLink: '/weapons',
                  isSortable: true,
                  isFilterable: true
                },
                {
                  dataName: 'id',
                  headerName: 'Id',
                  dataType: 'integer',
                  isSortable: true,
                  isFilterable: true
                },
                {
                  dataName: 'attackPowerBase',
                  headerName: 'Attack Power Base',
                  labelName: 'Attack Power',
                  dataType: 'integer',
                  classIcon: 'fa fa-superpowers',
                  isSortable: true,
                  isFilterable: true
                },
                {
                  dataName: 'durabilityBase',
                  headerName: 'Durability Base',
                  labelName: 'Durability',
                  dataType: 'integer',
                  classIcon: 'fa fa-shield',
                  isSortable: true,
                  isFilterable: true
                },
                {
                  dataName: 'throwDistanceBase',
                  headerName: 'Throw Distance',
                  labelName: 'Throw Distance',
                  dataType: 'integer',
                  classIcon: 'fa fa-bullseye',
                  isSortable: true,
                  isFilterable: true
                },
                {
                  dataName: 'availabilities',
                  headerName: 'Availabilities',
                  labelName: 'Availabilities',
                  dataType: 'array',
                  classIcon: 'fa fa-map-marker',
                  isSortable: true,
                  isFilterable: true
                }
              ]}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Weapons;
