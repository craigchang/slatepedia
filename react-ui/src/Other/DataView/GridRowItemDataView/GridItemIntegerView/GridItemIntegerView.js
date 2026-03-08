import React from 'react';

const GridItemIntegerView = ({dataValue, tooltip}) => {
  return (
    <td title={tooltip || undefined}>{dataValue || '-'}</td>
  );
}

export default GridItemIntegerView;