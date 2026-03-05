import React from 'react';

const ListItemImageView = ({imageFolder, name, fileType, cssClassName, spriteSheet}) => {
  let imageName = name.replace(/ /g, "-").replace(/'/g,"").toLowerCase();
  fileType = fileType || 'png';

  /* Use CSS background-image (sprite sheet) for weapons, bows, shields, monsters, food, and materials - never individual <img> */
  /* Materials: use sprite when cssClassName present (food.png: fruit/mushrooms/veg/fish/shellfish; materials.png: enemy drops, insects, ores, plants, misc); else fall through to img */
  if ((spriteSheet === 'weapons' || spriteSheet === 'bows' || spriteSheet === 'shields' || spriteSheet === 'monsters' || spriteSheet === 'food' || spriteSheet === 'animals' || (spriteSheet === 'materials' && cssClassName))) {
    const spriteClassName = (cssClassName || name.replace(/ /g, '-').replace(/'/g, '').toLowerCase()).replace(/'/g, '');
    const baseClass = spriteSheet === 'weapons' ? 'weapon-sprite weapon-sprite-sm' : spriteSheet === 'bows' ? 'bow-sprite bow-sprite-sm' : spriteSheet === 'shields' ? 'shield-sprite shield-sprite-sm' : spriteSheet === 'monsters' ? 'monster-sprite monster-sprite-sm' : spriteSheet === 'food' ? 'food-sprite food-sprite-sm' : spriteSheet === 'animals' ? 'animal-sprite animal-sprite-sm' : 'material-sprite material-sprite-sm';
    return (
      <div style={{ width: 80, height: 80, overflow: 'hidden', display: 'inline-block' }} title={name} aria-label={imageName}>
        <div className={`${baseClass} ${spriteClassName}`.trim()} />
      </div>
    );
  }

  if (spriteSheet && cssClassName) {
    const spriteClassName = cssClassName.replace(/'/g, '');
    return (
      <div style={{ width: 80, height: 80, overflow: 'hidden', display: 'inline-block' }} title={name} aria-label={imageName}>
        <div className={`armor-sprite armor-sprite-sm ${spriteClassName}`} />
      </div>
    );
  }

  return (
    <img alt={imageName} className="resource-icon-list-view" src={`${imageFolder}/${imageName}.${fileType}`}/>
  )
}

export default ListItemImageView;