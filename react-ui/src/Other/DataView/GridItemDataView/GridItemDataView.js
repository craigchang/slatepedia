import React from 'react';
import GridItemImageView from './GridItemImageView/GridItemImageView';
import GridItemStringView from './GridItemStringView/GridItemStringView';
import GridItemIntegerView from './GridItemIntegerView/GridItemIntegerView';
import GridItemArrayView from './GridItemArrayView/GridItemArrayView';

const GridItemDataView = ({obj, filterSettings}) => {
  let array = [];
  
  for(let i = 0; i < filterSettings.length; i++) {
    switch(filterSettings[i].dataType) {
      case 'image':
        array.push(<td key={`${filterSettings[i].dataName}-image`}><GridItemImageView name={obj.name}/></td>)
        break;
      case 'string':
        array.push(<td key={`${filterSettings[i].dataName}-string`}><GridItemStringView obj={obj} dataName={filterSettings[i].dataName} nestedDataName={filterSettings[i].nested} /></td>)    
        break;
      case 'integer':
        array.push(<td key={`${filterSettings[i].dataName}-integer`}><GridItemIntegerView dataValue={obj[filterSettings[i].dataName]} /></td>)
        break;
      case 'array':
        array.push(<td key={`${filterSettings[i].dataName}-array`}><GridItemArrayView obj={obj} dataName={filterSettings[i].dataName}/></td>)
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

export default GridItemDataView;