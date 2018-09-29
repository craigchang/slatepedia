import React from 'react';
import ListItemImageView from './ListItemImageView/ListItemImageView';
import ListItemBodyView from './ListItemBodyView/ListItemBodyView';
import ListItemStringView from './ListItemStringView/ListItemStringView';

const ListRowItemDataView = ({obj, filterSettings}) => {
  return (
    <div className="list-group-item list-view-item">
      <div className="media">
        <div className="media-left media-middle mr-2">
          <ListItemImageView name={obj.name}/>
        </div>
        <div className="media-body">
          <p className="mb-0">
            <ListItemStringView obj={obj} dataName="name" />
          </p>
          <ListItemBodyView obj={obj} filterSettings={filterSettings}/>
        </div>
      </div>
    </div>
  )
}

export default ListRowItemDataView;