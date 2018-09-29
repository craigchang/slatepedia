import React from 'react';
import GridItemImageView from './GridItemImageView/GridItemImageView';
import GridItemStringView from './GridItemStringView/GridItemStringView';
import GridItemIntegerView from './GridItemIntegerView/GridItemIntegerView';
import GridItemArrayView from './GridItemArrayView/GridItemArrayView';

const GridRowItemDataView = ({obj, filterSettings}) => {
  let array = [];
  
  for(let i = 0; i < filterSettings.length; i++) {
    switch(filterSettings[i].dataType) {
      case 'image':
        array.push(<GridItemImageView 
                      key={`${filterSettings[i].dataName}-image`} 
                      name={obj.name}/>)
        break;
      case 'string':
        array.push(<GridItemStringView 
                      key={`${filterSettings[i].dataName}-string`} 
                      obj={obj} 
                      dataName={filterSettings[i].dataName} 
                      nestedDataName={filterSettings[i].nested}/>)    
        break;
      case 'integer':
        array.push(<GridItemIntegerView 
                      key={`${filterSettings[i].dataName}-integer`} 
                      dataValue={obj[filterSettings[i].dataName]} />)
        break;
      case 'array':
        array.push(<GridItemArrayView 
                      key={`${filterSettings[i].dataName}-array`}
                      inputArray={obj[filterSettings[i].dataName]}/>)
        break;
      default:
        break;
    }
  }
  
  return (
    <tr>
      {array}
    </tr>
  );

}

export default GridRowItemDataView;