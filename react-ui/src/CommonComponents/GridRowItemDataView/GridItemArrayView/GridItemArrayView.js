import React from 'react';

const GridItemArrayView = ({inputArray}) => {
  return (
    <td>
      {
        inputArray && inputArray.length > 0 ? inputArray.map((item, index) => {
          return <React.Fragment key={`${item}`}>{item}{index < inputArray.length - 1 ? ", ": ""}</React.Fragment>
        }) : '-'
      }
    </td>
  )
}

export default GridItemArrayView; 