import React from 'react';
import ListItemStringView from '../ListItemStringView/ListItemStringView';
import ListItemIntegerView from '../ListItemIntegerView/ListItemIntegerView';
import ListItemArrayView from '../ListItemArrayView/ListItemArrayView';

const ListItemBodyView = ({obj, filterSettings}) => {
  let array = [];
  
  for(let i = 0; i < filterSettings.length; i++) {
    if (filterSettings[i].dataName == null || 
        filterSettings[i].dataName === "name" || 
        filterSettings[i].dataName === "id")
      continue;

    switch(filterSettings[i].dataType) {
      case 'string':
        array.push(<ListItemStringView
                      key={`${filterSettings[i].dataName}-string`} 
                      obj={obj} 
                      dataName={filterSettings[i].dataName} 
                      nestedDataName={filterSettings[i].nested} 
                      classIcon={filterSettings[i].classIcon}/>)    
        break;
      case 'integer':
        array.push(<ListItemIntegerView 
                      key={`${filterSettings[i].dataName}-integer`} 
                      dataValue={obj[filterSettings[i].dataName]}
                      labelName={filterSettings[i].labelName} 
                      classIcon={filterSettings[i].classIcon} />)
        break;
      case 'array':
        array.push(<ListItemArrayView 
                      key={`${filterSettings[i].dataName}-array`} 
                      obj={obj} 
                      dataName={filterSettings[i].dataName}
                      classIcon={filterSettings[i].classIcon}/>)
        break;
      default:
        break;
    }
  }
  
  return (
    <span>
      {array}
    </span>
  );
}

export default ListItemBodyView;