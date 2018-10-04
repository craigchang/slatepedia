import React from 'react';

import './IconContainer.css';

const IMAGE_FOLDER = '/img';

const IconContainer = ({propertyName, gridType, folderName}) => {
  if (!propertyName) return '';
  if (!folderName) return '';
  let cssClassName = gridType === 'list' ? "resource-icon-list-view" : "resource-icon";

  let imageName = propertyName.replace(/ /g, "-").replace(/'/g,"").toLowerCase();
  
  return <img alt={imageName} className={cssClassName} src={`${IMAGE_FOLDER}/${folderName}/${imageName}.png`}/>;
}

export default IconContainer;