import React from 'react';

const GridItemArrayObjectView = ({inputArray}) => {
  return (
    <td>
      {
        inputArray && inputArray.length > 0 ? inputArray.map((obj, index) => {
          return <React.Fragment key={`${obj.name}-${index}`}>{obj.name}{index < inputArray.length - 1 ? ", ": ""}</React.Fragment>
        }) : '-'
      }
    </td>
  )
}

export default GridItemArrayObjectView; 