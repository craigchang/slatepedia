import React from 'react';
import { Link } from 'react-router-dom';

const ListItemStringView = ({obj, dataName, nestedDataName, classIcon}) => {
  let dataNameArray = dataName.split(".");

  if (dataNameArray.length === 2) {
    if(obj[dataNameArray[0]] == null)
      return <span><i className={classIcon} aria-hidden="true"></i> <b>None</b></span>;
    else
      return (
        <span title={`${obj[dataNameArray[0]].name} - ${obj[dataNameArray[0]][nestedDataName]} `}><i className={classIcon} aria-hidden="true"></i> <b>{obj[dataNameArray[0]].name}</b></span>
      );
  } else {
    if (dataName === "name")
      return (
        <React.Fragment>
          <span className="media-heading">{obj.name}</span>&nbsp;
          <small className="small"><Link to={`/materials/${obj.id}`}>Details &#187;</Link></small>
        </React.Fragment>
      );
    else
      return <span><i className={classIcon} aria-hidden="true"></i> <b>{obj[dataName] === "" ? 'None': obj[dataName]}</b></span> 
  }
}

export default ListItemStringView;