import React from 'react';

const GridItemImageView = ({imageFolder, name, fileType}) => {
  let imageName = name.replace(/ /g, "-").replace(/'/g,"").toLowerCase();
  fileType = fileType || 'png';
  
  return (
    <td>
      <img alt={imageName} className="resource-icon" src={`${imageFolder}/${imageName}.${fileType}`}/>
    </td>
  )
}

export default GridItemImageView;

