import React from 'react';

const ListItemImageView = ({name}) => {
  let imageName = name.replace(/ /g, "-").replace(/'/g,"").toLowerCase();

  return (
    <img alt={imageName} className="resource-icon-list-view" src={`/img/materials/${imageName}.png`}/>
  )
}

export default ListItemImageView;