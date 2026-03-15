import React from 'react';

const GridItemImageView = ({imageFolder, name, fileType, cssClassName, spriteSheet}) => {
  let imageName = name.replace(/ /g, "-").replace(/'/g,"").toLowerCase();
  fileType = fileType || 'png';

  /* Use CSS background-image (sprite sheet) for weapons, bows, shields, monsters, food, and materials - same small size as list view */
  /* Materials: use sprite when cssClassName present (food.png: fruit/mushrooms/veg/fish/shellfish; materials.png: enemy drops, insects, ores, plants, misc); else fall through to img */
  if ((spriteSheet === 'weapons' || spriteSheet === 'bows' || spriteSheet === 'shields' || spriteSheet === 'monsters' || spriteSheet === 'food' || spriteSheet === 'animals' || spriteSheet === 'materials' || spriteSheet === 'other')) {
    const spriteClassName = (cssClassName || name.replace(/ /g, '-').replace(/'/g, '').toLowerCase()).replace(/'/g, '');
    const baseClass = spriteSheet === 'weapons' ? 'weapon-sprite weapon-sprite-sm' : spriteSheet === 'bows' ? 'bow-sprite bow-sprite-sm' : spriteSheet === 'shields' ? 'shield-sprite shield-sprite-sm' : spriteSheet === 'monsters' ? 'monster-sprite monster-sprite-sm' : spriteSheet === 'food' ? 'food-sprite food-sprite-sm' : spriteSheet === 'animals' ? 'animal-sprite animal-sprite-sm' : spriteSheet === 'other' ? 'other-sprite other-sprite-sm' : 'material-sprite material-sprite-sm';
    return (
      <td>
        <div style={{ width: 80, height: 80, overflow: 'hidden', display: 'inline-block' }} title={name} aria-label={imageName}>
          <div className={`${baseClass} ${spriteClassName}`.trim()} />
        </div>
      </td>
    );
  }

  if (spriteSheet && cssClassName) {
    const spriteClassName = cssClassName.replace(/'/g, '');
    return (
      <td>
        <div style={{ width: 80, height: 80, overflow: 'hidden', display: 'inline-block' }} title={name} aria-label={imageName}>
          <div className={`armor-sprite armor-sprite-sm ${spriteClassName}`} />
        </div>
      </td>
    );
  }
  
  return (
    <td>
      <img alt={imageName} className="resource-icon" src={`${imageFolder}/${imageName}.${fileType}`}/>
    </td>
  )
}

export default GridItemImageView;

