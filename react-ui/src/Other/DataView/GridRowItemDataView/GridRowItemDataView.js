import React from 'react';
import GridItemImageView from './GridItemImageView/GridItemImageView';
import GridItemStringView from './GridItemStringView/GridItemStringView';
import GridItemIntegerView from './GridItemIntegerView/GridItemIntegerView';
import GridItemArrayView from './GridItemArrayView/GridItemArrayView';
import GridItemArrayObjectView from './GridItemArrayObjectView/GridItemArrayObjectView';
import GridItemBooleanView from './GridItemBooleanView/GridItemBooleanView';

const GridRowItemDataView = ({obj, filterSettings}) => {
  let array = [];
  
  for(let i = 0; i < filterSettings.length; i++) {
    switch(filterSettings[i].dataType) {
      case 'image':
        array.push(<GridItemImageView 
                      key={`${filterSettings[i].dataName}-image`}
                      imageFolder={filterSettings[i].imageFolder} 
                      fileType={filterSettings[i].fileType}
                      name={obj.name} />)
        break;
      case 'string':
        array.push(<GridItemStringView 
                      key={`${filterSettings[i].dataName}-string`} 
                      obj={obj} 
                      dataName={filterSettings[i].dataName} 
                      nestedDataName={filterSettings[i].nested}
                      detailLink={filterSettings[i].detailLink} />)    
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
      case 'arrayObject':
        array.push(<GridItemArrayObjectView 
                      key={`${filterSettings[i].dataName}-arrayObject`}
                      inputArray={obj[filterSettings[i].dataName]}/>)
        break;
      case 'boolean':
        array.push(<GridItemBooleanView 
                      key={`${filterSettings[i].dataName}-boolean`}
                      dataValue={obj[filterSettings[i].dataName]}/>)
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