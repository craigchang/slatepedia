import React from 'react';

import './IconContainer.css';

const IMAGE_FOLDER = '/img';

const IconContainer = ({propertyName, gridType, folderName, fileType, cssClassName: spriteCssClassName, spriteSheet, small}) => {
  console.log({propertyName, gridType, folderName, fileType, spriteCssClassName, spriteSheet, small})
  if (!propertyName) return '';
  if (!folderName) return '';
  let cssClassName = gridType === 'list' ? "resource-icon-list-view" : "resource-icon";
  if (small) cssClassName = "resource-icon-sm";
  fileType = fileType || "png";

  let imageName = propertyName.replace(/ /g, "-").replace(/'/g,"").toLowerCase();

  const sizeStyle = small ? { width: 80, height: 80, overflow: 'hidden', display: 'inline-block' } : null;

  if (spriteSheet && spriteCssClassName) {
    const spriteClassName = spriteCssClassName.replace(/'/g, '');
    let spriteEl = null;
    if (folderName === "armor") {
      spriteEl = <div className={`armor-sprite${small ? ' armor-sprite-sm' : ''} ${spriteClassName}`} title={!small ? propertyName : undefined} aria-label={!small ? imageName : undefined} />;
    } else if (spriteSheet === "weapons") {
      spriteEl = <div className={`weapon-sprite${small ? ' weapon-sprite-sm' : ''} ${spriteClassName}`} title={!small ? propertyName : undefined} aria-label={!small ? imageName : undefined} />;
    } else if (spriteSheet === "bows") {
      spriteEl = <div className={`bow-sprite${small ? ' bow-sprite-sm' : ''} ${spriteClassName}`} title={!small ? propertyName : undefined} aria-label={!small ? imageName : undefined} />;
    } else if (spriteSheet === "shields") {
      spriteEl = <div className={`shield-sprite${small ? ' shield-sprite-sm' : ''} ${spriteClassName}`} title={!small ? propertyName : undefined} aria-label={!small ? imageName : undefined} />;
    } else if (spriteSheet === "monsters") {
      spriteEl = <div className={`monster-sprite${small ? ' monster-sprite-sm' : ''} ${spriteClassName}`} title={!small ? propertyName : undefined} aria-label={!small ? imageName : undefined} />;
    } else if (spriteSheet === "food") {
      spriteEl = <div className={`food-sprite${small ? ' food-sprite-sm' : ''} ${spriteClassName}`} title={!small ? propertyName : undefined} aria-label={!small ? imageName : undefined} />;
    } else if (spriteSheet === "materials") {
      spriteEl = <div className={`material-sprite${small ? ' material-sprite-sm' : ''} ${spriteClassName}`} title={!small ? propertyName : undefined} aria-label={!small ? imageName : undefined} />;
    } else if (spriteSheet === "animals") {
      spriteEl = <div className={`animal-sprite${small ? ' animal-sprite-sm' : ''} ${spriteClassName}`} title={!small ? propertyName : undefined} aria-label={!small ? imageName : undefined} />;
    }
    if (spriteEl) {
      return small ? <div style={sizeStyle} title={propertyName} aria-label={imageName}>{spriteEl}</div> : spriteEl;
    }
  }
  
  return;
}

export default IconContainer;