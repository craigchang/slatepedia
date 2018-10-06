import React from 'react';

const ListItemBooleanView = ({classIcon, dataValue, labelName}) => {
  if (!dataValue) return '';

  return <span><i className={classIcon} aria-hidden="true"></i>{dataValue} {labelName}</span>
}

export default ListItemBooleanView;