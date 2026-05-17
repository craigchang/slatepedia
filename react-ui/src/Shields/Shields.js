import React, { Component } from 'react';
import DataView from '../CommonComponents/DataView/DataView';
import Loading from '../CommonComponents/Loading/Loading';

import './Shields.css';
import './ShieldSprites.css';

function computeShieldFilterBounds(rows) {
  const list = rows && rows.length ? rows : [];
  if (!list.length) {
    return {
      durability: { min: 0, max: 9999 },
      parryPower: { min: 0, max: 999 }
    };
  }
  let dMin = Infinity;
  let dMax = -Infinity;
  let pMin = Infinity;
  let pMax = -Infinity;
  list.forEach((s) => {
    const d = Number(s.durability);
    const p = Number(s.parryPower);
    if (Number.isFinite(d)) {
      dMin = Math.min(dMin, d);
      dMax = Math.max(dMax, d);
    }
    if (Number.isFinite(p)) {
      pMin = Math.min(pMin, p);
      pMax = Math.max(pMax, p);
    }
  });
  if (!Number.isFinite(dMin) || !Number.isFinite(dMax)) {
    dMin = 0;
    dMax = 9999;
  }
  if (!Number.isFinite(pMin) || !Number.isFinite(pMax)) {
    pMin = 0;
    pMax = 999;
  }
  return {
    durability: { min: dMin, max: dMax },
    parryPower: { min: pMin, max: pMax }
  };
}

function defaultApiFilterState(bounds) {
  return {
    durabilityMin: bounds.durability.min,
    durabilityMax: bounds.durability.max,
    parryPowerMin: bounds.parryPower.min,
    parryPowerMax: bounds.parryPower.max,
    availability: []
  };
}

class Shields extends Component {
  constructor(props) {
    super(props);
    const emptyBounds = computeShieldFilterBounds([]);
    this.state = {
      json: null,
      jsonOriginal: null,
      allDataForFilterOptions: null,
      filterBounds: null,
      fetching: true,
      apiFilterState: defaultApiFilterState(emptyBounds)
    };
    this.fetchShields = this.fetchShields.bind(this);
    this.handleApiFilterChange = this.handleApiFilterChange.bind(this);
  }

  fetchShields(queryParams = {}, boundsOverride = null) {
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
          ((key === 'durabilityMin' && n <= bounds.durability.min) ||
            (key === 'durabilityMax' && n >= bounds.durability.max) ||
            (key === 'parryPowerMin' && n <= bounds.parryPower.min) ||
            (key === 'parryPowerMax' && n >= bounds.parryPower.max))
        ) {
          return;
        }
        params.set(key, String(n));
      } else if (String(v).trim() !== '') {
        params.set(key, String(v).trim());
      }
    });

    const url = params.toString() ? `/api/shields?${params.toString()}` : '/api/shields';
    return fetch(url).then((response) => {
      if (!response.ok) throw new Error(`status ${response.status}`);
      return response.json();
    });
  }

  handleApiFilterChange(nextFilterState) {
    const fb =
      this.state.filterBounds ||
      computeShieldFilterBounds(this.state.allDataForFilterOptions || []);
    const empty = defaultApiFilterState(fb);
    const next = nextFilterState || empty;
    const bounds = this.state.filterBounds || fb;

    this.setState({ apiFilterState: next });
    this.fetchShields(next, bounds)
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
    list.forEach((s) => {
      if (Array.isArray(s.availabilities)) {
        s.availabilities.forEach((a) => {
          if (a && String(a).trim()) set.add(String(a).trim());
        });
      }
    });
    return Array.from(set).sort();
  }

  componentDidMount() {
    this.fetchShields({})
      .then((json) => {
        const bounds = computeShieldFilterBounds(json);
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
      computeShieldFilterBounds(this.state.allDataForFilterOptions || []);

    const apiFilterConfig = [
      {
        filterType: 'range',
        label: 'Durability',
        minParam: 'durabilityMin',
        maxParam: 'durabilityMax',
        minBound: bounds.durability.min,
        maxBound: bounds.durability.max,
        rangeStep: 1
      },
      {
        filterType: 'range',
        label: 'Parry Power',
        minParam: 'parryPowerMin',
        maxParam: 'parryPowerMax',
        minBound: bounds.parryPower.min,
        maxBound: bounds.parryPower.max,
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
        <div className="container-nonresponsive container-results page-shields">
          <h1 className="page-header">Shields</h1>
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
                  spriteSheet: 'shields',
                  isSortable: false,
                  isFilterable: false
                },
                {
                  dataName: 'name',
                  headerName: 'Name',
                  dataType: 'string',
                  detailLink: '/shields',
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
                  dataName: 'durability',
                  headerName: 'Durability',
                  dataType: 'integer',
                  classIcon: 'fa fa-shield',
                  isSortable: true,
                  isFilterable: true
                },
                {
                  dataName: 'parryPower',
                  headerName: 'Parry Power',
                  dataType: 'integer',
                  classIcon: 'fa fa-superpowers',
                  isSortable: true,
                  isFilterable: true
                },
                {
                  dataName: 'availabilities',
                  headerName: 'Availabilities',
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

export default Shields;
