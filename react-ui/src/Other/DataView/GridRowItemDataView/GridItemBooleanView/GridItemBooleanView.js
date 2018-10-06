import React from 'react';

const ListItemBooleanView = ({dataValue}) => {
  if (dataValue)
    return <td>Yes</td>
  else
    return <td>No</td>
}

export default ListItemBooleanView;