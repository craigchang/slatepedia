import React, { Component } from 'react';
import DataView from '../CommonComponents/DataView/DataView';
import Loading from '../CommonComponents/Loading/Loading';

import './Bows.css';
import './BowSprites.css';

function computeBowFilterBounds(rows) {
  const list = rows && rows.length ? rows : [];
  if (!list.length) {
    return {
      attackPower: { min: 0, max: 999 },
      durability: { min: 0, max: 999 },
      range: { min: 0, max: 99999 },
      multipleArrows: { min: 0, max: 10 }
    };
  }

  const init = { min: Infinity, max: -Infinity };
  const bounds = {
    attackPower: { ...init },
    durability: { ...init },
    range: { ...init },
    multipleArrows: { ...init }
  };

  list.forEach((b) => {
    const ap = Number(b.attackPower);
    const d = Number(b.durability);
    const r = Number(b.range);
    const ma = Number(b.multipleArrows);
    if (Number.isFinite(ap)) {
      bounds.attackPower.min = Math.min(bounds.attackPower.min, ap);
      bounds.attackPower.max = Math.max(bounds.attackPower.max, ap);
    }
    if (Number.isFinite(d)) {
      bounds.durability.min = Math.min(bounds.durability.min, d);
      bounds.durability.max = Math.max(bounds.durability.max, d);
    }
    if (Number.isFinite(r)) {
      bounds.range.min = Math.min(bounds.range.min, r);
      bounds.range.max = Math.max(bounds.range.max, r);
    }
    if (Number.isFinite(ma)) {
      bounds.multipleArrows.min = Math.min(bounds.multipleArrows.min, ma);
      bounds.multipleArrows.max = Math.max(bounds.multipleArrows.max, ma);
    }
  });

  const fallback = (k, min, max) => {
    if (!Number.isFinite(bounds[k].min) || !Number.isFinite(bounds[k].max)) {
      bounds[k].min = min;
      bounds[k].max = max;
    }
  };
  fallback('attackPower', 0, 999);
  fallback('durability', 0, 999);
  fallback('range', 0, 99999);
  fallback('multipleArrows', 0, 10);
  return bounds;
}

function defaultApiFilterState(bounds) {
  return {
    attackPowerMin: bounds.attackPower.min,
    attackPowerMax: bounds.attackPower.max,
    durabilityMin: bounds.durability.min,
    durabilityMax: bounds.durability.max,
    rangeMin: bounds.range.min,
    rangeMax: bounds.range.max,
    multipleArrowsMin: bounds.multipleArrows.min,
    multipleArrowsMax: bounds.multipleArrows.max,
    quickShot: '',
    availability: []
  };
}

class Bows extends Component {
  constructor(props) {
    super(props);
    const emptyBounds = computeBowFilterBounds([]);
    this.state = {
      json: null,
      jsonOriginal: null,
      allDataForFilterOptions: null,
      filterBounds: null,
      fetching: true,
      apiFilterState: defaultApiFilterState(emptyBounds)
    };
    this.fetchBows = this.fetchBows.bind(this);
    this.handleApiFilterChange = this.handleApiFilterChange.bind(this);
  }

  fetchBows(queryParams = {}, boundsOverride = null) {
    const params = new URLSearchParams();
    const bounds = boundsOverride || this.state.filterBounds;

    Object.keys(queryParams).forEach((key) => {
      const v = queryParams[key];
      if (v == null) return;
      if (typeof v === 'string' && v.trim() === '') return;
      if (Array.isArray(v)) {
        const trimmed = v.map((x) => String(x).trim()).filter((x) => x !== '');
        if (trimmed.length > 0) params.set(key, trimmed.join(','));
      } else if (typeof v === 'boolean') {
        params.set(key, v ? 'true' : 'false');
      } else if (Number.isFinite(Number(v))) {
        const n = Number(v);
        if (
          bounds &&
          ((key === 'attackPowerMin' && n <= bounds.attackPower.min) ||
            (key === 'attackPowerMax' && n >= bounds.attackPower.max) ||
            (key === 'durabilityMin' && n <= bounds.durability.min) ||
            (key === 'durabilityMax' && n >= bounds.durability.max) ||
            (key === 'rangeMin' && n <= bounds.range.min) ||
            (key === 'rangeMax' && n >= bounds.range.max) ||
            (key === 'multipleArrowsMin' && n <= bounds.multipleArrows.min) ||
            (key === 'multipleArrowsMax' && n >= bounds.multipleArrows.max))
        ) {
          return;
        }
        params.set(key, String(n));
      } else if (String(v).trim() !== '') {
        params.set(key, String(v).trim());
      }
    });

    const url = params.toString() ? `/api/bows?${params.toString()}` : '/api/bows';
    return fetch(url).then((response) => {
      if (!response.ok) throw new Error(`status ${response.status}`);
      return response.json();
    });
  }

  handleApiFilterChange(nextFilterState) {
    const fb = this.state.filterBounds || computeBowFilterBounds(this.state.allDataForFilterOptions || []);
    const empty = defaultApiFilterState(fb);
    const next = nextFilterState || empty;
    const bounds = this.state.filterBounds || fb;

    this.setState({ apiFilterState: next });
    this.fetchBows(next, bounds)
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
    list.forEach((b) => {
      if (Array.isArray(b.availabilities)) {
        b.availabilities.forEach((a) => {
          if (a && String(a).trim()) set.add(String(a).trim());
        });
      }
    });
    return Array.from(set).sort();
  }

  componentDidMount() {
    this.fetchBows({})
      .then((json) => {
        const bounds = computeBowFilterBounds(json);
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
    const bounds = this.state.filterBounds || computeBowFilterBounds(this.state.allDataForFilterOptions || []);

    const apiFilterConfig = [
      {
        filterType: 'range',
        label: 'Attack Power',
        minParam: 'attackPowerMin',
        maxParam: 'attackPowerMax',
        minBound: bounds.attackPower.min,
        maxBound: bounds.attackPower.max,
        rangeStep: 1
      },
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
        label: 'Range',
        minParam: 'rangeMin',
        maxParam: 'rangeMax',
        minBound: bounds.range.min,
        maxBound: bounds.range.max,
        rangeStep: 1
      },
      {
        filterType: 'range',
        label: 'Multiple Arrows',
        minParam: 'multipleArrowsMin',
        maxParam: 'multipleArrowsMax',
        minBound: bounds.multipleArrows.min,
        maxBound: bounds.multipleArrows.max,
        rangeStep: 1
      },
      {
        paramKey: 'quickShot',
        label: 'Quick Shot',
        options: ['true', 'false'],
        multiSelect: false,
        formatOptionLabel: (v) => (v === 'true' ? 'Yes' : 'No')
      },
      {
        paramKey: 'availability',
        label: 'Availability',
        options: this.getAvailabilityOptions(),
        multiSelect: true
      }
    ];

    return (
      <div>
        <div className="container-nonresponsive container-results page-bows">
          <h1 className="page-header">Bows</h1>
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
                  "dataName": null, 
                  "headerName": "Icon",
                  "dataType": "image",
                  "imageFolder": "/images/weapons",
                  "imageCssDataName": "cssClassName",
                  "spriteSheet": "bows",
                  "isSortable": false, 
                  "isFilterable": false
                },
                {
                  "dataName": "name",
                  "headerName": "Name",
                  "dataType": "string",
                  "detailLink": "/bows",
                  "isSortable": true,
                  "isFilterable": true
                },
                {
                  "dataName": "id",
                  "headerName": "Id",
                  "dataType": "integer",
                  "isSortable": true,
                  "isFilterable": true
                },
                {
                  "dataName": "attackPower",
                  "headerName": "Attack Power",
                  "labelName": "Attack Power",
                  "dataType": "integer",
                  "classIcon": "fa fa-superpowers",
                  "isSortable": true,
                  "isFilterable": true
                },
                {
                  "dataName": "durability",
                  "headerName": "Durability",
                  "labelName": "Durability",
                  "classIcon": "fa fa-shield",
                  "dataType": "integer",
                  "isSortable": true,
                  "isFilterable": true
                },
                {
                  "dataName": "range",
                  "headerName": "Range",
                  "labelName": "Range",
                  "classIcon": "fa fa-bullseye",
                  "dataType": "integer",
                  "isSortable": true,
                  "isFilterable": true
                },
                {
                  "dataName": "multipleArrows",
                  "headerName": "Multiple Arrows",
                  "labelName": "Multiple Arrows",
                  "classIcon": "fa fa-arrows",
                  "dataType": "integer",
                  "isSortable": true,
                  "isFilterable": true
                },
                {
                  "dataName": "quickShot",
                  "headerName": "Quick Shot",
                  "classIcon": "fa fa-arrow-right",
                  "labelName": "Quick Shot",
                  "dataType": "boolean",
                  "isSortable": true,
                  "isFilterable": true
                },
                {
                  "dataName": "availabilities",
                  "headerName": "Availabilities",
                  "classIcon": "fa fa-map-marker",
                  "dataType": "array",
                  "isSortable": false,
                  "isFilterable": false
                }
              ]} 
            />
          )}
        </div>
      </div>
    );
  }
}

export default Bows;
