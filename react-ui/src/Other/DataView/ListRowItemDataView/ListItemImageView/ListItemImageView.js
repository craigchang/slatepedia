import React from 'react';

const ListItemImageView = ({imageFolder, name}) => {
  let imageName = name.replace(/ /g, "-").replace(/'/g,"").toLowerCase();

  return (
    <img alt={imageName} className="resource-icon-list-view" src={`${imageFolder}/${imageName}.png`}/>
  )
}

export default ListItemImageView;