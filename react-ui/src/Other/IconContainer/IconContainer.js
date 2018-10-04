import React from 'react';

import './IconContainer.css';

const IMAGE_FOLDER = '/img';

const IconContainer = ({propertyName, gridType, folderName, fileType}) => {
  if (!propertyName) return '';
  if (!folderName) return '';
  let cssClassName = gridType === 'list' ? "resource-icon-list-view" : "resource-icon";
  fileType = fileType || "png";

  let imageName = propertyName.replace(/ /g, "-").replace(/'/g,"").toLowerCase();
  
  return <img alt={imageName} className={cssClassName} src={`${IMAGE_FOLDER}/${folderName}/${imageName}.${fileType}`}/>;
}

export default IconContainer;