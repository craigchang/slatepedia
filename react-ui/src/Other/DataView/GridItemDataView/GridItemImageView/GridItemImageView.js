import React from 'react';

const GridItemImageView = ({name}) => {
  let imageName = name.replace(/ /g, "-").replace(/'/g,"").toLowerCase();
  return (
    <img alt={imageName} className="resource-icon" src={`/img/materials/${imageName}.png`}/>
  )
}

export default GridItemImageView;

