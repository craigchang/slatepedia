import React from 'react';

const ListItemArrayObjectView = ({inputArray, classIcon}) => {
  let ret = inputArray && inputArray.map((obj, index) => {
    return <span key={`${obj.name}-${index}`}><i className={classIcon} aria-hidden="true"></i> {obj.name}{index < inputArray.length - 1 ? " ": ""}</span>
  });

  return (
    <React.Fragment>
      {ret}
    </React.Fragment>
  )
}

export default ListItemArrayObjectView;