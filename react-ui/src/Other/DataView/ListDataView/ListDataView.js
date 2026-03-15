import React from 'react';
import ListRowItemDataView from '../ListRowItemDataView/ListRowItemDataView';

const ListDataView = ({ json, fetching, filterSettings }) => {
  if (json == null || json.length === 0) return null;

  return (
    <div className="list-group mt-0">
      {fetching
        ? null
        : json.map((obj, index) => (
            <ListRowItemDataView key={index} obj={obj} filterSettings={filterSettings} />
          ))}
    </div>
  );
};

export default ListDataView;
