import React from 'react';

import attackUpIcon from './images/attack_up_icon.png';
import defenseUpIcon from './images/defense_up_icon.png';
import coldResistanceIcon from './images/cold_resistance_icon.png';
import heatResistanceIcon from './images/heat_resistance_icon.png';
import shockResistanceIcon from './images/shock_resistance_icon.png';
import stealthUpIcon from './images/stealth_up_icon.png';
import speedUpIcon from './images/speed_up_icon.png';
import extraHeartIcon from './images/extra_heart_icon.png';
import staminaRecoveryIcon from './images/stamina_recovery_icon.png';
import staminaWheelIcon from './images/stamina_wheel_icon.png';
import extraStaminaIcon from './images/extra_stamina_icon.png';
import staminaRestorationIcon from './images/stamina_restoration_icon.png';
import flameGuardIcon from './images/flame_guard_icon.png';
import ancientProficiencyIcon from './images/ancient_proficiency.png';
import climbJumpStaminaUpIcon from './images/climbing_jump_stamina_up_icon.png';
import nightSpeedUpIcon from './images/night_speed_up_icon.png';
import unfreezableIcon from './images/unfreezable_icon.png';
import sandSpeedUpIcon from './images/sand_speed_up_icon.png';
import snowSpeedUpIcon from './images/snow_speed_up_icon.png';
import setBonusIcon from './images/set_bonus_icon.png';
import swimSpeedUpIcon from './images/swim_speed_up_icon.png';

const BONUS_EFFECT_TO_ICON = {
  'Attack Up': attackUpIcon,
  'Defense Up': defenseUpIcon,
  'Cold Resistance': coldResistanceIcon,
  'Heat Resistance': heatResistanceIcon,
  'Heat-Resistant': heatResistanceIcon,
  'Shock Resistance': shockResistanceIcon,
  'Lightning Proof': shockResistanceIcon,
  'Stealth Up': stealthUpIcon,
  'Movement Speed Up': speedUpIcon,
  'Swim Speed Up': speedUpIcon,
  'Climb Speed Up': speedUpIcon,
  'Night Speed Up': speedUpIcon,
  'Speed Up': speedUpIcon,
  'Extra Hearts': extraHeartIcon,
  'Extra Stamina': extraStaminaIcon,
  'Stamina Restoration': staminaRestorationIcon,
  'Stamina Recovery': staminaRestorationIcon,
  'Charge Atk. Stamina Up': attackUpIcon,
  'Climb Stamina Up': climbJumpStaminaUpIcon,
  'Flame Guard': flameGuardIcon,
  'Fireproof': flameGuardIcon,
  'Ancient Proficiency': ancientProficiencyIcon,
  'Guardian Resist': ancientProficiencyIcon,
  'Climing Jump Stamina Up': climbJumpStaminaUpIcon,
  'Unshockable': shockResistanceIcon,
  'Unfreezable': unfreezableIcon,
  'Night Speed Up': nightSpeedUpIcon,
  'Sand Travel': sandSpeedUpIcon,
  'Snow Travel': snowSpeedUpIcon,
  'Master Sword: Beam Up': setBonusIcon,
  'Swim Dash Stamina Up': swimSpeedUpIcon
};

const ICON_STYLE = { width: 25, height: 25, verticalAlign: 'middle', marginRight: 4, backgroundColor: 'darkgrey' };

const BonusEffect = ({ effectName, classIcon }) => {
  if (!effectName || effectName === '') return <>-</>;

  const icon = BONUS_EFFECT_TO_ICON[effectName];

  return icon ? (
    <>
      <img src={icon} alt={effectName} title={effectName} style={ICON_STYLE} />
      {effectName}
    </>
  ) : (
    <span><i className={classIcon} aria-hidden="true"></i> {effectName}</span>
  );
};

export default BonusEffect;
