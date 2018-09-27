import React from 'react';
import ListItemImageView from './ListItemImageView/ListItemImageView';
import ListItemBodyView from './ListItemBodyView/ListItemBodyView';
import ListItemStringView from './ListItemStringView/ListItemStringView';

const ListItemDataView = ({material, filterSettings}) => {
  return (
    <div className="list-group-item list-view-item">
      <div className="media">
        <div className="media-left media-middle mr-2">
          <ListItemImageView name={material.name}/>
        </div>
        <div className="media-body">
          <p className="mb-0">
            <ListItemStringView obj={material} dataName="name" />
          </p>
          <ListItemBodyView obj={material} filterSettings={filterSettings}/>
        </div>
      </div>
    </div>
  )
}

export default ListItemDataView;