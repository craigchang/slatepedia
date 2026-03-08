import React from 'react';

const ListItemIntegerView = ({dataValue, classIcon, labelName, tooltip}) => {
  const content = <>
    <i className={classIcon} aria-hidden="true"></i> <b>{dataValue}</b>{labelName ? ` ${labelName}` : ''}
  </>;
  return tooltip ? <span title={tooltip}>{content}</span> : <span>{content}</span>;
}

export default ListItemIntegerView;