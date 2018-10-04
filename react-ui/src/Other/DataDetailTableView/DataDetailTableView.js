import React from 'react';

import './DataDetailTableView.css';

const DataDetailTableView  = (props) => {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-detail">
        {props.children}
      </table>
    </div>
  )
}

export default DataDetailTableView;