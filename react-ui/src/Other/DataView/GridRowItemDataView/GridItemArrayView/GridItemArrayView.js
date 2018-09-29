import React from 'react';

const GridItemArrayView = ({inputArray}) => {
  let ret = inputArray && inputArray.map((item, index) => {
    return <React.Fragment key={`${item}`}>{item}{index < inputArray.length - 1 ? ", ": ""}</React.Fragment>
  });

  return (
    <td>
      {ret}
    </td>
  )
}

export default GridItemArrayView; 