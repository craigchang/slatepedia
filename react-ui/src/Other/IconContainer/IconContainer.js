import React from 'react';

const IMAGE_FOLDER = '/img';

const IconContainer = ({propertyName, folderName}) => {
  if (!propertyName) return '';
  if (!folderName) return '';

  let imageName = propertyName.replace(/ /g, "-").replace(/'/g,"").toLowerCase();
  
  
  
  return <img alt={imageName} className="resource-icon" src={`${IMAGE_FOLDER}/${folderName}/${imageName}.png`}/>;
}

export default IconContainer;