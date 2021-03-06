import React from 'react';
import _ from 'lodash';
import ListItemImageView from './ListItemImageView/ListItemImageView';
import ListItemBodyView from './ListItemBodyView/ListItemBodyView';
import ListItemStringView from './ListItemStringView/ListItemStringView';

const ListRowItemDataView = ({obj, filterSettings}) => {
  let imageFilterSettings = _.filter(filterSettings, (obj) => {
    return obj.dataType === 'image' && obj.dataName == null;
  });

  let detailLinkFilterSettings = _.filter(filterSettings, (obj) => {
    return obj.dataName == "name";
  });

  return (
    <div className="list-group-item list-view-item">
      <div className="media">
        <div className="media-left media-middle mr-2">
          <ListItemImageView imageFolder={imageFilterSettings[0].imageFolder} name={obj.name} fileType={imageFilterSettings[0].fileType}/>
        </div>
        <div className="media-body">
          <p className="mb-0">
            <ListItemStringView obj={obj} dataName="name" detailLink={detailLinkFilterSettings[0].detailLink} />
          </p>
          <ListItemBodyView obj={obj} filterSettings={filterSettings}/>
        </div>
      </div>
    </div>
  )
}

export default ListRowItemDataView;