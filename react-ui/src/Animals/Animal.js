import React, { Component } from 'react';
import DataView from '../CommonComponents/DataView/DataView';
import Loading from '../CommonComponents/Loading/Loading';

import './Animal.css';
import './AnimalSprites.css';

class Animal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      json: null,
      jsonOriginal: null,
      allDataForFilterOptions: null,
      fetching: true,
      apiFilterState: {
        uniqueCookingEffect: [],
        commonLocation: [],
        recoverableMaterial: []
      }
    };
    this.fetchAnimals = this.fetchAnimals.bind(this);
    this.handleApiFilterChange = this.handleApiFilterChange.bind(this);
  }

  fetchAnimals(queryParams = {}) {
    const params = new URLSearchParams();
    Object.keys(queryParams).forEach((key) => {
      const v = queryParams[key];
      if (v == null) return;
      if (Array.isArray(v)) {
        const trimmed = v.map((x) => String(x).trim()).filter(Boolean);
        if (trimmed.length > 0) params.set(key, trimmed.join(','));
      } else if (String(v).trim() !== '') {
        params.set(key, String(v).trim());
      }
    });
    const url = params.toString() ? `/api/animals?${params.toString()}` : '/api/animals';
    return fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`status ${response.status}`);
        return response.json();
      });
  }

  handleApiFilterChange(nextFilterState) {
    const emptyState = {
      uniqueCookingEffect: [],
      commonLocation: [],
      recoverableMaterial: []
    };
    this.setState({ apiFilterState: nextFilterState || emptyState });
    this.fetchAnimals(nextFilterState || emptyState)
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

  getUniqueCookingEffectOptions() {
    const list = this.state.allDataForFilterOptions || [];
    const set = new Set();
    list.forEach((a) => {
      if (a.uniqueCookingEffects && String(a.uniqueCookingEffects).trim()) {
        set.add(a.uniqueCookingEffects.trim());
      }
    });
    return Array.from(set).sort();
  }

  getCommonLocationOptions() {
    const list = this.state.allDataForFilterOptions || [];
    const set = new Set();
    list.forEach((a) => {
      if (Array.isArray(a.commonLocations)) {
        a.commonLocations.forEach((loc) => {
          if (loc && String(loc).trim()) set.add(loc.trim());
        });
      }
    });
    return Array.from(set).sort();
  }

  getRecoverableMaterialOptions() {
    const list = this.state.allDataForFilterOptions || [];
    const set = new Set();
    list.forEach((a) => {
      if (Array.isArray(a.recoverableMaterials)) {
        a.recoverableMaterials.forEach((m) => {
          if (m && m.name && String(m.name).trim()) set.add(m.name.trim());
        });
      }
    });
    return Array.from(set).sort();
  }

  componentDidMount() {
    this.fetchAnimals()
      .then((json) => {
        this.setState({
          json,
          jsonOriginal: json,
          allDataForFilterOptions: json,
          fetching: false
        });
      })
      .catch(() => {
        this.setState({
          json: null,
          jsonOriginal: null,
          allDataForFilterOptions: null,
          fetching: false
        });
      });
  }

  render() {
    const apiFilterConfig = [
      {
        paramKey: 'uniqueCookingEffect',
        label: 'Unique Cooking Effect',
        options: this.getUniqueCookingEffectOptions(),
        multiSelect: true
      },
      {
        paramKey: 'commonLocation',
        label: 'Common Locations',
        options: this.getCommonLocationOptions(),
        multiSelect: true
      },
      {
        paramKey: 'recoverableMaterial',
        label: 'Recoverable Materials',
        options: this.getRecoverableMaterialOptions(),
        multiSelect: true
      }
    ];

    return (
      <div>
        <div className="container-nonresponsive container-results">
          <h1 className="page-header">Animals</h1>
          { this.state.fetching && !this.state.json ? <Loading /> :
            <DataView
              json={this.state.json}
              jsonOriginal={this.state.jsonOriginal}
              fetching={this.state.fetching}
              apiFilterConfig={apiFilterConfig}
              apiFilterState={this.state.apiFilterState}
              onApiFilterChange={this.handleApiFilterChange}
              filterSettings={[
                {
                  "dataName": null,
                  "headerName": "Icon",
                  "dataType": "image",
                  "imageFolder": "/images/animals",
                  "imageCssDataName": "cssClassName",
                  "spriteSheet": "animals",
                  "isSortable": false,
                  "isFilterable": false
                },
                {
                  "dataName": "name",
                  "headerName": "Name",
                  "dataType": "string",
                  "detailLink": "/animals",
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
                  "dataName": "uniqueCookingEffects",
                  "headerName": "Unique Cooking Effects",
                  "dataType": "bonusEffect",
                  "isSortable": true,
                  "isFilterable": true
                },
                {
                  "dataName": "commonLocations",
                  "headerName": "Common Locations",
                  "dataType": "array",
                  "classIcon": "fa fa-map-marker",
                  "isSortable": false,
                  "isFilterable": true
                },
                {
                  "dataName": "recoverableMaterials",
                  "headerName": "Recoverable Materials",
                  "dataType": "arrayObject",
                  "classIcon": "fa fa-cog",
                  "isSortable": false,
                  "isFilterable": false
                }
              ]}
            />
          }
        </div>
      </div>
    );
  }
}


export default Animal;
