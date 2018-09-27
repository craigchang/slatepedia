import React from 'react';

const ListItemIntegerView = ({dataValue, classIcon, labelName}) => {
  return <span><i className={classIcon} aria-hidden="true"></i> <b>{dataValue}</b> {labelName}</span>; 
}

export default ListItemIntegerView;