import React, { Component } from 'react';
import DataView from '../CommonComponents/DataView/DataView';
import Loading from '../CommonComponents/Loading/Loading';

import './Monsters.css';
import './MonsterSprites.css';

function computeMonsterFilterBounds(rows) {
  const list = rows && rows.length ? rows : [];
  if (!list.length) {
    return {
      hp: { min: 0, max: 99999 },
      rank: { min: 0, max: 999 }
    };
  }
  let hpMin = Infinity;
  let hpMax = -Infinity;
  let rankMin = Infinity;
  let rankMax = -Infinity;
  list.forEach((m) => {
    const hp = Number(m.hp);
    const rank = Number(m.rank);
    if (Number.isFinite(hp)) {
      hpMin = Math.min(hpMin, hp);
      hpMax = Math.max(hpMax, hp);
    }
    if (Number.isFinite(rank)) {
      rankMin = Math.min(rankMin, rank);
      rankMax = Math.max(rankMax, rank);
    }
  });
  if (!Number.isFinite(hpMin) || !Number.isFinite(hpMax)) {
    hpMin = 0;
    hpMax = 99999;
  }
  if (!Number.isFinite(rankMin) || !Number.isFinite(rankMax)) {
    rankMin = 0;
    rankMax = 999;
  }
  return {
    hp: { min: hpMin, max: hpMax },
    rank: { min: rankMin, max: rankMax }
  };
}

function defaultApiFilterState(bounds) {
  return {
    size: [],
    hpMin: bounds.hp.min,
    hpMax: bounds.hp.max,
    rankMin: bounds.rank.min,
    rankMax: bounds.rank.max,
    commonLocation: [],
    itemDrop: []
  };
}

function capitalizeSize(size) {
  const s = String(size);
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

class Monsters extends Component {
  constructor(props) {
    super(props);
    const emptyBounds = computeMonsterFilterBounds([]);
    this.state = {
      json: null,
      jsonOriginal: null,
      allDataForFilterOptions: null,
      filterBounds: null,
      fetching: true,
      apiFilterState: defaultApiFilterState(emptyBounds)
    };
    this.fetchMonsters = this.fetchMonsters.bind(this);
    this.handleApiFilterChange = this.handleApiFilterChange.bind(this);
  }

  fetchMonsters(queryParams = {}, boundsOverride = null) {
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
          ((key === 'hpMin' && n <= bounds.hp.min) ||
            (key === 'hpMax' && n >= bounds.hp.max) ||
            (key === 'rankMin' && n <= bounds.rank.min) ||
            (key === 'rankMax' && n >= bounds.rank.max))
        ) {
          return;
        }
        params.set(key, String(n));
      } else if (String(v).trim() !== '') {
        params.set(key, String(v).trim());
      }
    });

    const url = params.toString() ? `/api/monsters?${params.toString()}` : '/api/monsters';
    return fetch(url).then((response) => {
      if (!response.ok) throw new Error(`status ${response.status}`);
      return response.json();
    });
  }

  handleApiFilterChange(nextFilterState) {
    const fb =
      this.state.filterBounds ||
      computeMonsterFilterBounds(this.state.allDataForFilterOptions || []);
    const empty = defaultApiFilterState(fb);
    const next = nextFilterState || empty;
    const bounds = this.state.filterBounds || fb;

    this.setState({ apiFilterState: next });
    this.fetchMonsters(next, bounds)
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

  getSizeOptions() {
    const list = this.state.allDataForFilterOptions || [];
    const set = new Set();
    list.forEach((m) => {
      if (m.size && String(m.size).trim()) set.add(String(m.size).trim());
    });
    return Array.from(set).sort();
  }

  getCommonLocationOptions() {
    const list = this.state.allDataForFilterOptions || [];
    const set = new Set();
    list.forEach((m) => {
      if (Array.isArray(m.commonLocations)) {
        m.commonLocations.forEach((loc) => {
          if (loc && String(loc).trim()) set.add(String(loc).trim());
        });
      }
    });
    return Array.from(set).sort();
  }

  getItemDropOptions() {
    const list = this.state.allDataForFilterOptions || [];
    const set = new Set();
    list.forEach((m) => {
      if (Array.isArray(m.itemDrops)) {
        m.itemDrops.forEach((drop) => {
          if (drop && drop.name && String(drop.name).trim()) set.add(String(drop.name).trim());
        });
      }
    });
    return Array.from(set).sort();
  }

  componentDidMount() {
    this.fetchMonsters({})
      .then((json) => {
        const bounds = computeMonsterFilterBounds(json);
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
      computeMonsterFilterBounds(this.state.allDataForFilterOptions || []);

    const apiFilterConfig = [
      {
        paramKey: 'size',
        label: 'Size',
        options: this.getSizeOptions(),
        multiSelect: true,
        formatOptionLabel: capitalizeSize
      },
      {
        filterType: 'range',
        label: 'HP',
        minParam: 'hpMin',
        maxParam: 'hpMax',
        minBound: bounds.hp.min,
        maxBound: bounds.hp.max,
        rangeStep: 1
      },
      {
        filterType: 'range',
        label: 'Rank',
        minParam: 'rankMin',
        maxParam: 'rankMax',
        minBound: bounds.rank.min,
        maxBound: bounds.rank.max,
        rangeStep: 1
      },
      {
        paramKey: 'commonLocation',
        label: 'Common Locations',
        options: this.getCommonLocationOptions(),
        multiSelect: true
      },
      {
        paramKey: 'itemDrop',
        label: 'Item Drops',
        options: this.getItemDropOptions(),
        multiSelect: true
      }
    ];

    return (
      <div>
        <div className="container-nonresponsive container-results page-monsters">
          <h1 className="page-header">Monsters</h1>
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
                  imageFolder: '/images/monsters',
                  imageCssDataName: 'cssClassName',
                  spriteSheet: 'monsters',
                  isSortable: false,
                  isFilterable: false
                },
                {
                  dataName: 'name',
                  headerName: 'Name',
                  dataType: 'string',
                  detailLink: '/monsters',
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
                  dataName: 'size',
                  headerName: 'Size',
                  dataType: 'string',
                  classIcon: 'fa fa-user-plus',
                  isSortable: true,
                  isFilterable: true
                },
                {
                  dataName: 'hp',
                  headerName: 'HP',
                  dataType: 'integer',
                  classIcon: 'fa fa-heart',
                  isSortable: true,
                  isFilterable: true
                },
                {
                  dataName: 'rank',
                  headerName: 'Rank',
                  dataType: 'integer',
                  classIcon: 'fa fa-star',
                  isSortable: true,
                  isFilterable: true
                },
                {
                  dataName: 'commonLocations',
                  headerName: 'Common Locations',
                  dataType: 'array',
                  classIcon: 'fa fa-map-marker',
                  isSortable: true,
                  isFilterable: true
                },
                {
                  dataName: 'itemDrops',
                  headerName: 'Item Drops',
                  dataType: 'arrayObject',
                  classIcon: 'fa fa-cog',
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

export default Monsters;
