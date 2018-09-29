import React from 'react';

const GridItemImageView = ({name}) => {
  let imageName = name.replace(/ /g, "-").replace(/'/g,"").toLowerCase();
  return (
    <td>
      <img alt={imageName} className="resource-icon" src={`/img/materials/${imageName}.png`}/>
    </td>
  )
}

export default GridItemImageView;

