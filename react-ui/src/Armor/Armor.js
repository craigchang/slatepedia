import React, { Component } from 'react';
import DataView from '../CommonComponents/DataView/DataView';
import Loading from '../CommonComponents/Loading/Loading';

import './Armor.css';
import './ArmorSprites.css';

/** Must match server `server/rest/armor/index.js` NONE_TOKEN for empty effect strings. */
const EFFECT_NONE_TOKEN = '__none__';

function computeArmorFilterBounds(rows) {
  const list = rows && rows.length ? rows : [];
  if (!list.length) {
    return {
      defense: { min: 0, max: 99 },
      sellPrice: { min: 0, max: 99999 }
    };
  }
  let dMin = Infinity;
  let dMax = -Infinity;
  let sMin = Infinity;
  let sMax = -Infinity;
  list.forEach((a) => {
    const d = Number(a.defense);
    const s = Number(a.sellPrice);
    if (Number.isFinite(d)) {
      dMin = Math.min(dMin, d);
      dMax = Math.max(dMax, d);
    }
    if (Number.isFinite(s)) {
      sMin = Math.min(sMin, s);
      sMax = Math.max(sMax, s);
    }
  });
  if (!Number.isFinite(dMin) || !Number.isFinite(dMax)) {
    dMin = 0;
    dMax = 99;
  }
  if (!Number.isFinite(sMin) || !Number.isFinite(sMax)) {
    sMin = 0;
    sMax = 99999;
  }
  return {
    defense: { min: dMin, max: dMax },
    sellPrice: { min: sMin, max: sMax }
  };
}

function defaultApiFilterState(bounds) {
  return {
    defenseMin: bounds.defense.min,
    defenseMax: bounds.defense.max,
    sellPriceMin: bounds.sellPrice.min,
    sellPriceMax: bounds.sellPrice.max,
    bodyPart: [],
    addedEffect: [],
    setBonus: [],
    availability: []
  };
}

class Armor extends Component {
  constructor(props) {
    super(props);
    const emptyBounds = computeArmorFilterBounds([]);
    this.state = {
      json: null,
      jsonOriginal: null,
      allDataForFilterOptions: null,
      filterBounds: null,
      fetching: true,
      apiFilterState: defaultApiFilterState(emptyBounds)
    };
    this.fetchArmor = this.fetchArmor.bind(this);
    this.handleApiFilterChange = this.handleApiFilterChange.bind(this);
  }

  /**
   * @param {Record<string, unknown>} queryParams
   * @param {{ defense: {min:number,max:number}; sellPrice: {min:number,max:number} } | null} boundsOverride bounds from parent (full dataset), not filtered results
   */
  fetchArmor(queryParams = {}, boundsOverride = null) {
    const params = new URLSearchParams();
    const bounds = boundsOverride || this.state.filterBounds;

    Object.keys(queryParams).forEach((key) => {
      const v = queryParams[key];
      if (v == null) return;
      if (Array.isArray(v)) {
        const trimmed = v.map((x) => String(x).trim()).filter((x) => x !== '');
        if (trimmed.length > 0) params.set(key, trimmed.join(','));
      } else if (Number.isFinite(Number(v))) {
        const n = Number(v);
        if (
          bounds &&
          ((key === 'defenseMin' && n <= bounds.defense.min) ||
            (key === 'defenseMax' && n >= bounds.defense.max) ||
            (key === 'sellPriceMin' && n <= bounds.sellPrice.min) ||
            (key === 'sellPriceMax' && n >= bounds.sellPrice.max))
        ) {
          return;
        }
        params.set(key, String(n));
      } else if (String(v).trim() !== '') {
        params.set(key, String(v).trim());
      }
    });

    const url = params.toString() ? `/api/armor?${params.toString()}` : '/api/armor';
    return fetch(url).then((response) => {
      if (!response.ok) throw new Error(`status ${response.status}`);
      return response.json();
    });
  }

  handleApiFilterChange(nextFilterState) {
    const fb =
      this.state.filterBounds ||
      computeArmorFilterBounds(this.state.allDataForFilterOptions || []);
    const empty = defaultApiFilterState(fb);
    const next = nextFilterState || empty;
    const bounds = this.state.filterBounds || fb;

    this.setState({ apiFilterState: next });
    this.fetchArmor(next, bounds)
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

  getBodyPartOptions() {
    const list = this.state.allDataForFilterOptions || [];
    const set = new Set();
    list.forEach((a) => {
      if (a.bodyPart && String(a.bodyPart).trim()) set.add(String(a.bodyPart).trim());
    });
    return Array.from(set).sort();
  }

  getEffectOptions(field) {
    const list = this.state.allDataForFilterOptions || [];
    const set = new Set();
    list.forEach((a) => {
      const raw = a[field];
      if (raw == null || String(raw).trim() === '') set.add(EFFECT_NONE_TOKEN);
      else set.add(String(raw).trim());
    });
    return Array.from(set).sort((a, b) => {
      if (a === EFFECT_NONE_TOKEN) return -1;
      if (b === EFFECT_NONE_TOKEN) return 1;
      return a.localeCompare(b);
    });
  }

  getAvailabilityOptions() {
    const list = this.state.allDataForFilterOptions || [];
    const set = new Set();
    list.forEach((a) => {
      if (a.availability && String(a.availability).trim()) set.add(String(a.availability).trim());
    });
    return Array.from(set).sort();
  }

  componentDidMount() {
    this.fetchArmor({})
      .then((json) => {
        const bounds = computeArmorFilterBounds(json);
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
      computeArmorFilterBounds(this.state.allDataForFilterOptions || []);

    const formatNone = (opt) => (opt === EFFECT_NONE_TOKEN ? '(None)' : opt);

    const apiFilterConfig = [
      {
        filterType: 'range',
        label: 'Defense',
        minParam: 'defenseMin',
        maxParam: 'defenseMax',
        minBound: bounds.defense.min,
        maxBound: bounds.defense.max,
        rangeStep: 1
      },
      {
        filterType: 'range',
        label: 'Sell Price',
        minParam: 'sellPriceMin',
        maxParam: 'sellPriceMax',
        minBound: bounds.sellPrice.min,
        maxBound: bounds.sellPrice.max,
        rangeStep: 1,
        rangeValueSuffix: ' Rupees'
      },
      {
        paramKey: 'bodyPart',
        label: 'Body Part',
        options: this.getBodyPartOptions(),
        multiSelect: true
      },
      {
        paramKey: 'addedEffect',
        label: 'Added Effect',
        options: this.getEffectOptions('addedEffect'),
        multiSelect: true,
        formatOptionLabel: formatNone
      },
      {
        paramKey: 'setBonus',
        label: 'Set Bonus',
        options: this.getEffectOptions('setBonus'),
        multiSelect: true,
        formatOptionLabel: formatNone
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
        <div className="container-nonresponsive container-results page-armor">
          <h1 className="page-header">Armor</h1>
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
                  imageFolder: '/images/armor',
                  imageCssDataName: 'cssClassName',
                  spriteSheet: 'bodyarmor',
                  isSortable: false,
                  isFilterable: false
                },
                {
                  dataName: 'name',
                  headerName: 'Name',
                  dataType: 'string',
                  detailLink: '/armor',
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
                  dataName: 'defense',
                  headerName: 'Defense',
                  dataType: 'string',
                  classIcon: 'fa fa-shield',
                  isSortable: true,
                  isFilterable: true
                },
                {
                  dataName: 'sellPrice',
                  headerName: 'Sell Price',
                  classIcon: 'fa fa-diamond',
                  labelName: 'Rupees',
                  dataType: 'integer',
                  isSortable: true,
                  isFilterable: true
                },
                {
                  dataName: 'bodyPart',
                  headerName: 'Body Part',
                  classIcon: 'fa fa-user',
                  dataType: 'string',
                  isSortable: true,
                  isFilterable: true
                },
                {
                  dataName: 'addedEffect',
                  headerName: 'Added Effect',
                  classIcon: 'fa fa-plus',
                  dataType: 'bonusEffect',
                  isSortable: true,
                  isFilterable: true
                },
                {
                  dataName: 'setBonus',
                  headerName: 'Set Bonus',
                  classIcon: 'fa fa-long-arrow-up',
                  dataType: 'bonusEffect',
                  isSortable: true,
                  isFilterable: true
                },
                {
                  dataName: 'availability',
                  headerName: 'Availability',
                  classIcon: 'fa fa-map-marker',
                  dataType: 'string',
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

export default Armor;
