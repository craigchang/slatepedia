import React from 'react';

const GridItemArrayView = ({obj, dataName}) => {
  return obj[dataName] && obj[dataName].map((item, index) => {
    return <React.Fragment key={`${obj.name}-${item}`}>{item}{index < obj[dataName].length - 1 ? ", ": ""}</React.Fragment>
  });
}

export default GridItemArrayView; 