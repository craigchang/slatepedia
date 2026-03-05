import React from 'react';

import './IconContainer.css';

const IMAGE_FOLDER = '/img';

const IconContainer = ({propertyName, gridType, folderName, fileType, cssClassName: spriteCssClassName, spriteSheet}) => {
  if (!propertyName) return '';
  if (!folderName) return '';
  let cssClassName = gridType === 'list' ? "resource-icon-list-view" : "resource-icon";
  fileType = fileType || "png";

  let imageName = propertyName.replace(/ /g, "-").replace(/'/g,"").toLowerCase();

  if (spriteSheet && spriteCssClassName) {
    const spriteClassName = spriteCssClassName.replace(/'/g, '');
    if (folderName === "armor") {
      return <div className={`armor-sprite ${spriteClassName}`} title={propertyName} aria-label={imageName} />;
    }
    if (spriteSheet === "weapons") {
      return <div className={`weapon-sprite ${spriteClassName}`} title={propertyName} aria-label={imageName} />;
    }
    if (spriteSheet === "bows") {
      return <div className={`bow-sprite ${spriteClassName}`} title={propertyName} aria-label={imageName} />;
    }
    if (spriteSheet === "shields") {
      return <div className={`shield-sprite ${spriteClassName}`} title={propertyName} aria-label={imageName} />;
    }
    if (spriteSheet === "monsters") {
      return <div className={`monster-sprite ${spriteClassName}`} title={propertyName} aria-label={imageName} />;
    }
    if (spriteSheet === "food") {
      return <div className={`food-sprite ${spriteClassName}`} title={propertyName} aria-label={imageName} />;
    }
    if (spriteSheet === "materials") {
      return <div className={`material-sprite ${spriteClassName}`} title={propertyName} aria-label={imageName} />;
    }
    if (spriteSheet === "animals") {
      return <div className={`animal-sprite ${spriteClassName}`} title={propertyName} aria-label={imageName} />;
    }
  }
  
  return <img alt={imageName} className={cssClassName} src={`${IMAGE_FOLDER}/${folderName}/${imageName}.${fileType}`}/>;
}

export default IconContainer;