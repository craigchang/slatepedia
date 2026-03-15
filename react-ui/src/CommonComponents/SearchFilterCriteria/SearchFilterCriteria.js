import React from 'react';

import './SearchFilterCriteria.css';

/**
 * Common search and filter criteria for resource list/grid views.
 * Currently provides "Search by Name"; more filter inputs can be added later.
 */
function SearchFilterCriteria({ searchName, onSearchNameChange, placeholder = 'Search by Name', children }) {
  return (
    <div className="search-filter-criteria">
      <div className="input-group input-group-sm flex-nowrap">
        <span className="input-group-text rounded-start flex-shrink-0" id="search-addon">
          <i className="fa fa-search" aria-hidden="true"></i>
        </span>
        <input
          type="text"
          className="form-control rounded-end"
          placeholder={placeholder}
          value={searchName}
          onChange={(e) => onSearchNameChange(e.target.value)}
          name="searchName"
          aria-label={placeholder}
          aria-describedby="search-addon"
        />
      </div>
      {children}
    </div>
  );
}

export default SearchFilterCriteria;
