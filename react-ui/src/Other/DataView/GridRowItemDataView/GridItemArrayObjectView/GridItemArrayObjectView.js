import React from 'react';

const GridItemArrayObjectView = ({inputArray}) => {
  let ret = inputArray && inputArray.map((obj, index) => {
    return <React.Fragment key={`${obj.name}-${index}`}>{obj.name}{index < inputArray.length - 1 ? ", ": ""}</React.Fragment>
  });

  return (
    <td>
      {ret}
    </td>
  )
}

export default GridItemArrayObjectView; 