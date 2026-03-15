import React, { Component } from 'react';
import DataView from '../CommonComponents/DataView/DataView';
import Loading from '../CommonComponents/Loading/Loading';

import './OtherItems.css';
import './OtherItemsSprites.css';

class OtherItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      json: null,
      jsonOriginal: null,
      fetching: true,
      sortBy: '',
      sortOrder: '',
      filterButtonCollapsed: true,
      dataView: 'grid'
    };
  }

  componentDidMount() {
    fetch('/api/other')
      .then(response => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        this.setState({
          json: json,
          jsonOriginal: json,
          fetching: false
        });
      }).catch(e => {
        this.setState({
          json: null,
          jsonOriginal: null,
          fetching: false
        });
      });
  }

  render() {
    return (
      <div>
        <div className="container-nonresponsive container-results">
          <h1 className="page-header">Other Items</h1>
          { this.state.fetching ? <Loading /> :
            <DataView
              json={this.state.json}
              jsonOriginal={this.state.jsonOriginal}
              fetching={false}
              filterSettings={[
                {
                  dataName: null,
                  headerName: 'Icon',
                  dataType: 'image',
                  imageFolder: '/images',
                  imageCssDataName: 'cssClassName',
                  spriteSheet: 'other',
                  isSortable: false,
                  isFilterable: false
                },
                {
                  dataName: 'id',
                  headerName: 'Id',
                  dataType: 'integer',
                  isSortable: true,
                  isFilterable: true
                },
                {
                  dataName: 'name',
                  headerName: 'Name',
                  dataType: 'string',
                  detailLink: '/other',
                  isSortable: true,
                  isFilterable: true
                }
              ]}
            />
          }
        </div>
      </div>
    );
  }
}

export default OtherItems;
