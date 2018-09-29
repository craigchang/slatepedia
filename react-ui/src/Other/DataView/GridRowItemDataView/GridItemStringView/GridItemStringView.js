import React from 'react';
import { Link } from 'react-router-dom';

const GridItemStringView = ({obj, dataName, nestedDataName}) => {
  let dataNameArray = dataName.split(".");

  if (dataNameArray.length === 2) {
    if(obj[dataNameArray[0]] == null)
      return <td>-</td>;
    else      
      return (
        <td>
          <span title={`${obj[dataNameArray[0]].name} - ${obj[dataNameArray[0]][nestedDataName]} `}>{obj[dataNameArray[0]].name}</span>
        </td>
      );
  } else {
    if (dataName === "name")
      return (
        <td>
          <p className="mb-0">{obj.name}</p>
          <small className="small"><Link to={`/materials/${obj.id}`}>Details &#187;</Link></small>
        </td>
      );
    else
      return (
        <td>{obj[dataName] === "" ? '-': obj[dataName]}</td>
      ) 
  }
}

export default GridItemStringView;