import React from 'react';

const ListItemImageView = ({imageFolder, name, fileType}) => {
  let imageName = name.replace(/ /g, "-").replace(/'/g,"").toLowerCase();
  fileType = fileType || 'png';

  return (
    <img alt={imageName} className="resource-icon-list-view" src={`${imageFolder}/${imageName}.${fileType}`}/>
  )
}

export default ListItemImageView;