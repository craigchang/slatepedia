import React from 'react';

const ListItemArrayView = ({obj, dataName, classIcon}) => {
  return obj[dataName] && obj[dataName].map((item, index) => {
    return <span key={`${obj.name}-${item}`}><i className={classIcon} aria-hidden="true"></i> {item}{index < obj[dataName].length - 1 ? " ": ""}</span>
  });
}

export default ListItemArrayView;