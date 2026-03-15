import React from 'react';

const ListItemArrayObjectView = ({inputArray, classIcon}) => {
  return (
    <>
    {
      inputArray && inputArray.length > 0 ? inputArray.map((obj, index) => {
        return <span key={`${obj.name}-${index}`}><i className={classIcon} aria-hidden="true"></i> {obj.name}{index < inputArray.length - 1 ? " ": ""}</span>
      }) : ''
    }
    </>
  )
}

export default ListItemArrayObjectView;