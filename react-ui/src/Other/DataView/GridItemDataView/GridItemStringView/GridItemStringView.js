import React from 'react';
import { Link } from 'react-router-dom';

const GridItemStringView = ({obj, dataName, nestedDataName}) => {
  let dataNameArray = dataName.split(".");

  if (dataNameArray.length === 2) {
    if(obj[dataNameArray[0]] == null)
      return '-';
    else      
      return (
        <span title={`${obj[dataNameArray[0]].name} - ${obj[dataNameArray[0]][nestedDataName]} `}>{obj[dataNameArray[0]].name}</span>
      );
  } else {
    if (dataName === "name")
      return (
        <React.Fragment>
          <p className="mb-0">{obj.name}</p>
          <small className="small"><Link to={`/materials/${obj.id}`}>Details &#187;</Link></small>
        </React.Fragment>
      );
    else
      return <React.Fragment>{obj[dataName] === "" ? '-': obj[dataName]}</React.Fragment> 
  }
}

export default GridItemStringView;