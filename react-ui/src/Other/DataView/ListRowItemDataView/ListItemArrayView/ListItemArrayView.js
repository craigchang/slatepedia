import React from 'react';

const ListItemArrayView = ({inputArray, classIcon}) => {
  let ret = inputArray && inputArray.map((item, index) => {
    return <span key={`${item}`}><i className={classIcon} aria-hidden="true"></i> {item}{index < inputArray.length - 1 ? " ": ""}</span>
  });

  return (
    <td>
      {ret}
    </td>
  )
}

export default ListItemArrayView;