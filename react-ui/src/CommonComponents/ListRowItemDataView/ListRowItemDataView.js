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
        <div className="media-left media-middle me-2">
          <ListItemImageView imageFolder={imageFilterSettings[0].imageFolder} name={obj.name} fileType={imageFilterSettings[0].fileType} cssClassName={imageFilterSettings[0].imageCssDataName ? obj[imageFilterSettings[0].imageCssDataName] : null} spriteSheet={imageFilterSettings[0].spriteSheet}/>
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