import React from 'react';

const QUARTER_HEART = "quarter-heart";
const HALF_HEART = "half-heart";
const THREE_QUARTER_HEART = "three-quarter-heart";
const HEART = "heart";
const HEART5 = "heart5";
const HEART10 = "heart10";
const HEART15 = "heart15";
const HEART20 = "heart20";
const HEART25 = "heart25";

const HeartContainerComponent = (hpRecovery) => {
    if (hpRecovery == 0) return '-';
  
    let heartsArray = [];
    let numWholeHearts = Math.floor(hpRecovery / 4); // 4 hp = 1 heart
    let partialHeart = hpRecovery % 4;
    let getHeartIconComponent = (imageName) => (<img alt={imageName} title={imageName} src={`/img/other/${imageName}.png`} />);
  
    if (numWholeHearts != 0) {
        if (5 <= numWholeHearts && numWholeHearts < 10) {
            heartsArray.push(getHeartIconComponent(HEART5));
            numWholeHearts -= 5;
        } else if (10 <= numWholeHearts && numWholeHearts < 15) {
            heartsArray.push(getHeartIconComponent(HEART10));
            numWholeHearts -= 10;
        } else if (15 <= numWholeHearts && numWholeHearts < 20) {
            heartsArray.push(getHeartIconComponent(HEART15));
            numWholeHearts -= 15;
        } else if (20 <= numWholeHearts && numWholeHearts < 25) {
            heartsArray.push(getHeartIconComponent(HEART20));
            numWholeHearts -= 20;
        } else if (25 <= numWholeHearts) {
            heartsArray.push(getHeartIconComponent(HEART25));
            numWholeHearts -= 25;
        }

        // fill remaining whole hearts
        for(let i = 0; i < numWholeHearts; i++)
            heartsArray.push(getHeartIconComponent(HEART));
    }
  
    if (partialHeart != 0) {
      switch(partialHeart) {
        case 1: heartsArray.push(getHeartIconComponent(QUARTER_HEART)); break;
        case 2: heartsArray.push(getHeartIconComponent(HALF_HEART)); break;
        case 3: heartsArray.push(getHeartIconComponent(THREE_QUARTER_HEART)); break;
        default: break;
      }
    }

    heartsArray.push( (<span className="sr-only">{hpRecovery}</span>) )
  
    return heartsArray;
  }

  export default HeartContainerComponent; 