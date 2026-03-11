import React from 'react';
import BonusEffect from '../../../BonusEffect/BonusEffect';

const getNestedValue = (obj, path) => {
  const parts = path.split('.');
  let value = obj;
  for (const p of parts) {
    value = value?.[p];
  }
  return value;
};

const GridItemBonusEffectView = ({ obj, dataName, classIcon }) => {
  const effectName = dataName.includes('.') ? getNestedValue(obj, dataName) : obj[dataName];
  if (!effectName || effectName === '') return <td>-</td>;

  return (
    <td>
      <BonusEffect effectName={effectName} classIcon={classIcon} />
    </td>
  );
};

export default GridItemBonusEffectView;
