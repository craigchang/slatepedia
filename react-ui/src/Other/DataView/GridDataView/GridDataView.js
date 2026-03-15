import React from 'react';
import GridRowItemDataView from '../GridRowItemDataView/GridRowItemDataView';

const GridDataView = ({ json, fetching, filterSettings, sortBy, sortOrder, onColumnHeaderClick }) => {
  if (json == null || json.length === 0) return null;

  const headerCells = filterSettings.map((setting, i) => {
    const titleAttr = setting.tooltip ? { title: setting.tooltip } : {};
    if (setting.isSortable) {
      return (
        <th
          {...titleAttr}
          className={`sticky-top sortable ${sortBy === setting.dataName ? sortOrder : ''}`}
          key={`${i}-${setting.headerName}`}
          onClick={(event) => onColumnHeaderClick(event, setting.dataName)}
        >
          {setting.headerName}
        </th>
      );
    }
    return (
      <th
        {...titleAttr}
        className="sticky-top"
        style={{ cursor: 'default' }}
        key={`${i}-${setting.headerName}`}
      >
        {setting.headerName}
      </th>
    );
  });

  return (
    <div className="table-responsive table-responsive-sticky">
      <table className="table table-striped sortable">
        <thead>
          <tr>
            {fetching ? null : headerCells}
          </tr>
        </thead>
        <tbody>
          {fetching
            ? null
            : json.map((obj, index) => (
                <GridRowItemDataView key={index} obj={obj} filterSettings={filterSettings} />
              ))}
        </tbody>
      </table>
    </div>
  );
};

export default GridDataView;
