import React, { Component } from 'react';
import DataView from '../CommonComponents/DataView/DataView';
import Loading from '../CommonComponents/Loading/Loading';

import './Food.css';
import './FoodSprites.css';

function computeFoodFilterBounds(rows) {
  const list = rows && rows.length ? rows : [];
  if (!list.length) {
    return {
      sellPrice: { min: 0, max: 999 },
      hpRecovery: { min: 0, max: 999 }
    };
  }
  let spMin = Infinity;
  let spMax = -Infinity;
  let hpMin = Infinity;
  let hpMax = -Infinity;
  list.forEach((f) => {
    const sp = Number(f.sellPrice);
    const hp = Number(f.hpRecovery);
    if (Number.isFinite(sp)) {
      spMin = Math.min(spMin, sp);
      spMax = Math.max(spMax, sp);
    }
    if (Number.isFinite(hp)) {
      hpMin = Math.min(hpMin, hp);
      hpMax = Math.max(hpMax, hp);
    }
  });
  if (!Number.isFinite(spMin) || !Number.isFinite(spMax)) {
    spMin = 0;
    spMax = 999;
  }
  if (!Number.isFinite(hpMin) || !Number.isFinite(hpMax)) {
    hpMin = 0;
    hpMax = 999;
  }
  return {
    sellPrice: { min: spMin, max: spMax },
    hpRecovery: { min: hpMin, max: hpMax }
  };
}

function defaultApiFilterState(bounds) {
  return {
    sellPriceMin: bounds.sellPrice.min,
    sellPriceMax: bounds.sellPrice.max,
    hpRecoveryMin: bounds.hpRecovery.min,
    hpRecoveryMax: bounds.hpRecovery.max,
    ingredient: []
  };
}

class Food extends Component {
  constructor(props) {
    super(props);
    const emptyBounds = computeFoodFilterBounds([]);
    this.state = {
      json: null,
      jsonOriginal: null,
      allDataForFilterOptions: null,
      filterBounds: null,
      fetching: true,
      apiFilterState: defaultApiFilterState(emptyBounds)
    };
    this.fetchFood = this.fetchFood.bind(this);
    this.handleApiFilterChange = this.handleApiFilterChange.bind(this);
  }

  fetchFood(queryParams = {}, boundsOverride = null) {
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
            (key === 'hpRecoveryMax' && n >= bounds.hpRecovery.max))
        ) {
          return;
        }
        params.set(key, String(n));
      } else if (String(v).trim() !== '') {
        params.set(key, String(v).trim());
      }
    });

    const url = params.toString() ? `/api/food?${params.toString()}` : '/api/food';
    return fetch(url).then((response) => {
      if (!response.ok) throw new Error(`status ${response.status}`);
      return response.json();
    });
  }

  handleApiFilterChange(nextFilterState) {
    const fb =
      this.state.filterBounds || computeFoodFilterBounds(this.state.allDataForFilterOptions || []);
    const empty = defaultApiFilterState(fb);
    const next = nextFilterState || empty;
    const bounds = this.state.filterBounds || fb;

    this.setState({ apiFilterState: next });
    this.fetchFood(next, bounds)
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

  getIngredientOptions() {
    const list = this.state.allDataForFilterOptions || [];
    const set = new Set();
    list.forEach((f) => {
      if (Array.isArray(f.ingredients)) {
        f.ingredients.forEach((ing) => {
          if (ing && ing.name && String(ing.name).trim()) set.add(String(ing.name).trim());
        });
      }
    });
    return Array.from(set).sort();
  }

  componentDidMount() {
    this.fetchFood({})
      .then((json) => {
        const bounds = computeFoodFilterBounds(json);
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
      this.state.filterBounds || computeFoodFilterBounds(this.state.allDataForFilterOptions || []);

    const apiFilterConfig = [
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
        paramKey: 'ingredient',
        label: 'Ingredient',
        options: this.getIngredientOptions(),
        multiSelect: true
      }
    ];

    return (
      <div>
        <div className="container-nonresponsive container-results page-food">
          <h1 className="page-header">Food</h1>
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
                  imageFolder: '/images/food',
                  imageCssDataName: 'cssClassName',
                  spriteSheet: 'food',
                  isSortable: false,
                  isFilterable: false
                },
                {
                  dataName: 'name',
                  headerName: 'Name',
                  dataType: 'string',
                  detailLink: '/food',
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
                  isFilterable: true
                },
                {
                  dataName: 'ingredients',
                  headerName: 'Ingredient (any of)',
                  classIcon: 'fa fa-cutlery',
                  dataType: 'arrayObject',
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

export default Food;
