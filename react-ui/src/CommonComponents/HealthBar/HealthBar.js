import React from 'react';
import './HealthBar.css';

import quarterHeartImg from './images/quarter_heart_icon.png';
import halfHeartImg from './images/half_heart_icon.png';
import threeQuartersHeartImg from './images/three_quarters_heart_icon.png';
import fullHeartImg from './images/full_heart_icon.png';

const HEART_IMAGES = {
  quarter: quarterHeartImg,
  half: halfHeartImg,
  threeQuarters: threeQuartersHeartImg,
  full: fullHeartImg
};

const HealthBar = ({health}) => {
    if (!health || health === 0) return '-';
  
    let hearts = [];
    let numWholeHearts = Math.floor(health / 4); // 4 hp = 1 heart
    let partialHeart = health % 4;
    const heartIconComponent = (imgSrc, alt) => (
      <img alt={alt} title={alt} src={imgSrc} />
    );
  
    for(let i = 0; i < numWholeHearts; i++)
      hearts.push(heartIconComponent(HEART_IMAGES.full, 'full heart'));
  
    switch(partialHeart) {
      case 1: hearts.push(heartIconComponent(HEART_IMAGES.quarter, 'quarter heart')); break;
      case 2: hearts.push(heartIconComponent(HEART_IMAGES.half, 'half heart')); break;
      case 3: hearts.push(heartIconComponent(HEART_IMAGES.threeQuarters, 'three quarters heart')); break;
      default: break;
    }
    
    hearts.push( (<span className="visually-hidden">{health} Hearts</span>) )

    return React.Children.toArray(hearts);
  }

  export default HealthBar; 