import React from 'react';

import './SearchFilterCriteria.css';

/**
 * Common search and filter criteria for resource list/grid views.
 * Currently provides "Search by Name"; more filter inputs can be added later.
 */
function SearchFilterCriteria({ searchName, onSearchNameChange, placeholder = 'Search by Name', children }) {
  return (
    <div className="search-filter-criteria">
      <div className="form-group">
        <div className="input-group mb-2">
          <div className="input-group-prepend">
            <div className="input-group-text"><i className="fa fa-search" aria-hidden="true"></i></div>
          </div>
          <input
            type="text"
            className="form-control"
            placeholder={placeholder}
            value={searchName}
            onChange={(e) => onSearchNameChange(e.target.value)}
            name="searchName"
            aria-label={placeholder}
          />
        </div>
      </div>
      {children}
    </div>
  );
}

export default SearchFilterCriteria;
