import React, { Component } from 'react';
import DataView from '../CommonComponents/DataView/DataView';
import Loading from '../CommonComponents/Loading/Loading';

import './Materials.css';
import './MaterialsSprites.css';

/** Must match server `server/rest/materials/index.js` NONE_TOKEN. */
const NONE_TOKEN = '__none__';

function computeMaterialFilterBounds(rows) {
  const list = rows && rows.length ? rows : [];
  if (!list.length) {
    return {
      sellPrice: { min: 0, max: 9999 },
      hpRecovery: { min: 0, max: 999 },
      durationFactor: { min: 0, max: 99999 }
    };
  }
  let spMin = Infinity;
  let spMax = -Infinity;
  let hpMin = Infinity;
  let hpMax = -Infinity;
  let dfMin = Infinity;
  let dfMax = -Infinity;
  list.forEach((m) => {
    const sp = Number(m.sellPrice);
    const hp = Number(m.hpRecovery);
    const df = Number(m.durationFactor);
    if (Number.isFinite(sp)) {
      spMin = Math.min(spMin, sp);
      spMax = Math.max(spMax, sp);
    }
    if (Number.isFinite(hp)) {
      hpMin = Math.min(hpMin, hp);
      hpMax = Math.max(hpMax, hp);
    }
    if (Number.isFinite(df)) {
      dfMin = Math.min(dfMin, df);
      dfMax = Math.max(dfMax, df);
    }
  });
  if (!Number.isFinite(spMin) || !Number.isFinite(spMax)) {
    spMin = 0;
    spMax = 9999;
  }
  if (!Number.isFinite(hpMin) || !Number.isFinite(hpMax)) {
    hpMin = 0;
    hpMax = 999;
  }
  if (!Number.isFinite(dfMin) || !Number.isFinite(dfMax)) {
    dfMin = 0;
    dfMax = 99999;
  }
  return {
    sellPrice: { min: spMin, max: spMax },
    hpRecovery: { min: hpMin, max: hpMax },
    durationFactor: { min: dfMin, max: dfMax }
  };
}

function defaultApiFilterState(bounds) {
  return {
    type: [],
    sellPriceMin: bounds.sellPrice.min,
    sellPriceMax: bounds.sellPrice.max,
    hpRecoveryMin: bounds.hpRecovery.min,
    hpRecoveryMax: bounds.hpRecovery.max,
    category: [],
    bonusEffect: [],
    potencyGrade: [],
    durationFactorMin: bounds.durationFactor.min,
    durationFactorMax: bounds.durationFactor.max,
    availability: []
  };
}

class Materials extends Component {
  constructor(props) {
    super(props);
    const emptyBounds = computeMaterialFilterBounds([]);
    this.state = {
      json: null,
      jsonOriginal: null,
      allDataForFilterOptions: null,
      filterBounds: null,
      fetching: true,
      apiFilterState: defaultApiFilterState(emptyBounds)
    };
    this.fetchMaterials = this.fetchMaterials.bind(this);
    this.handleApiFilterChange = this.handleApiFilterChange.bind(this);
  }

  fetchMaterials(queryParams = {}, boundsOverride = null) {
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
          ((key === 'sellPriceMin' && n <= bounds.sellPrice.min) ||
            (key === 'sellPriceMax' && n >= bounds.sellPrice.max) ||
            (key === 'hpRecoveryMin' && n <= bounds.hpRecovery.min) ||
            (key === 'hpRecoveryMax' && n >= bounds.hpRecovery.max) ||
            (key === 'durationFactorMin' && n <= bounds.durationFactor.min) ||
            (key === 'durationFactorMax' && n >= bounds.durationFactor.max))
        ) {
          return;
        }
        params.set(key, String(n));
      } else if (String(v).trim() !== '') {
        params.set(key, String(v).trim());
      }
    });

    const url = params.toString() ? `/api/materials?${params.toString()}` : '/api/materials';
    return fetch(url).then((response) => {
      if (!response.ok) throw new Error(`status ${response.status}`);
      return response.json();
    });
  }

  handleApiFilterChange(nextFilterState) {
    const fb =
      this.state.filterBounds ||
      computeMaterialFilterBounds(this.state.allDataForFilterOptions || []);
    const empty = defaultApiFilterState(fb);
    const next = nextFilterState || empty;
    const bounds = this.state.filterBounds || fb;

    this.setState({ apiFilterState: next });
    this.fetchMaterials(next, bounds)
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

  getTypeOptions() {
    const list = this.state.allDataForFilterOptions || [];
    const set = new Set();
    list.forEach((m) => {
      if (m.type && String(m.type).trim()) set.add(String(m.type).trim());
    });
    return Array.from(set).sort();
  }

  getCategoryOptions() {
    const list = this.state.allDataForFilterOptions || [];
    const set = new Set();
    let hasNullCategory = false;
    list.forEach((m) => {
      if (!m.category) hasNullCategory = true;
      else if (m.category.name && String(m.category.name).trim()) {
        set.add(String(m.category.name).trim());
      }
    });
    const opts = Array.from(set).sort();
    if (hasNullCategory) opts.unshift(NONE_TOKEN);
    return opts;
  }

  getBonusEffectOptions() {
    const list = this.state.allDataForFilterOptions || [];
    const set = new Set();
    let needsNone = false;
    list.forEach((m) => {
      if (!m.category || !m.category.addedEffect || String(m.category.addedEffect).trim() === '') {
        needsNone = true;
      } else {
        set.add(String(m.category.addedEffect).trim());
      }
    });
    const opts = Array.from(set).sort();
    if (needsNone) opts.unshift(NONE_TOKEN);
    return opts;
  }

  getPotencyGradeOptions() {
    const list = this.state.allDataForFilterOptions || [];
    const set = new Set();
    let needsNone = false;
    list.forEach((m) => {
      if (!m.potencyGrade || String(m.potencyGrade).trim() === '') needsNone = true;
      else set.add(String(m.potencyGrade).trim());
    });
    const opts = Array.from(set).sort();
    if (needsNone) opts.unshift(NONE_TOKEN);
    return opts;
  }

  getAvailabilityOptions() {
    const list = this.state.allDataForFilterOptions || [];
    const set = new Set();
    list.forEach((m) => {
      if (Array.isArray(m.availabilities)) {
        m.availabilities.forEach((a) => {
          if (a && String(a).trim()) set.add(String(a).trim());
        });
      }
    });
    return Array.from(set).sort();
  }

  componentDidMount() {
    this.fetchMaterials({})
      .then((json) => {
        const bounds = computeMaterialFilterBounds(json);
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
      computeMaterialFilterBounds(this.state.allDataForFilterOptions || []);

    const formatNone = (opt) => (opt === NONE_TOKEN ? '(None)' : opt);

    const apiFilterConfig = [
      {
        paramKey: 'type',
        label: 'Type',
        options: this.getTypeOptions(),
        multiSelect: true
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
        filterType: 'range',
        label: 'HP Recovery',
        minParam: 'hpRecoveryMin',
        maxParam: 'hpRecoveryMax',
        minBound: bounds.hpRecovery.min,
        maxBound: bounds.hpRecovery.max,
        rangeStep: 1
      },
      {
        paramKey: 'category',
        label: 'Category',
        options: this.getCategoryOptions(),
        multiSelect: true,
        formatOptionLabel: formatNone
      },
      {
        paramKey: 'bonusEffect',
        label: 'Bonus Effect',
        options: this.getBonusEffectOptions(),
        multiSelect: true,
        formatOptionLabel: formatNone
      },
      {
        paramKey: 'potencyGrade',
        label: 'Potency Grade',
        options: this.getPotencyGradeOptions(),
        multiSelect: true,
        formatOptionLabel: formatNone
      },
      {
        filterType: 'range',
        label: 'Duration Factor',
        minParam: 'durationFactorMin',
        maxParam: 'durationFactorMax',
        minBound: bounds.durationFactor.min,
        maxBound: bounds.durationFactor.max,
        rangeStep: 1,
        rangeValueSuffix: ' s'
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
        <div className="container-nonresponsive container-results page-materials">
          <h1 className="page-header">Materials</h1>
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
                  imageFolder: '/images/materials',
                  imageCssDataName: 'cssClassName',
                  spriteSheet: 'materials',
                  isSortable: false,
                  isFilterable: false
                },
                {
                  dataName: 'name',
                  headerName: 'Name',
                  dataType: 'string',
                  detailLink: '/materials',
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
                  dataName: 'type',
                  headerName: 'Type',
                  dataType: 'string',
                  classIcon: 'fa fa-tag',
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
                  dataName: 'hpRecovery',
                  headerName: 'HP Recovery',
                  classIcon: 'fa fa-heart',
                  dataType: 'integer',
                  isSortable: true,
                  isFilterable: true,
                  tooltip: '1 HP recovery = 1/4 heart recovery'
                },
                {
                  dataName: 'category.name',
                  nested: 'addedEffect',
                  headerName: 'Category',
                  classIcon: 'fa fa-tags',
                  dataType: 'string',
                  isSortable: true,
                  isFilterable: true
                },
                {
                  dataName: 'category.addedEffect',
                  headerName: 'Bonus Effect',
                  classIcon: 'fa fa-plus',
                  dataType: 'bonusEffect',
                  isSortable: true,
                  isFilterable: true
                },
                {
                  dataName: 'potencyGrade',
                  headerName: 'Potency Grade',
                  classIcon: 'fa fa-thermometer-full',
                  dataType: 'string',
                  isSortable: true,
                  isFilterable: true
                },
                {
                  dataName: 'durationFactor',
                  headerName: 'Duration Factor',
                  classIcon: 'fa fa-clock-o',
                  labelName: 'seconds',
                  dataType: 'integer',
                  isSortable: true,
                  isFilterable: true
                },
                {
                  dataName: 'availabilities',
                  headerName: 'Availabilities',
                  classIcon: 'fa fa-map-marker',
                  dataType: 'array',
                  isSortable: false,
                  isFilterable: false
                }
              ]}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Materials;
