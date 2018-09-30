import React from 'react';

const GridItemImageView = ({imageFolder, name}) => {
  let imageName = name.replace(/ /g, "-").replace(/'/g,"").toLowerCase();
  return (
    <td>
      <img alt={imageName} className="resource-icon" src={`${imageFolder}/${imageName}.png`}/>
    </td>
  )
}

export default GridItemImageView;

