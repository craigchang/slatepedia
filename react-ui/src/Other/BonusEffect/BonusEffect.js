import React from 'react';

import attackUpIcon from '../../img/icons/attack_up_icon.png';
import defenseUpIcon from '../../img/icons/defense_up_icon.png';
import coldResistanceIcon from '../../img/icons/cold_resistance_icon.png';
import heatResistanceIcon from '../../img/icons/heat_resistance_icon.png';
import shockResistanceIcon from '../../img/icons/shock_resistance_icon.png';
import stealthUpIcon from '../../img/icons/stealth_up_icon.png';
import speedUpIcon from '../../img/icons/speed_up_icon.png';
import extraHeartIcon from '../../img/icons/extra_heart_icon.png';
import staminaRecoveryIcon from '../../img/icons/stamina_recovery_icon.png';
import staminaWheelIcon from '../../img/icons/stamina_wheel_icon.png';
import extraStaminaIcon from '../../img/icons/extra_stamina_icon.png';
import staminaRestorationIcon from '../../img/icons/stamina_restoration_icon.png';
import flameGuardIcon from '../../img/icons/flame_guard_icon.png';
import ancientProficiencyIcon from '../../img/icons/ancient_proficiency.png';
import climbJumpStaminaUpIcon from '../../img/icons/climbing_jump_stamina_up_icon.png';
import nightSpeedUpIcon from '../../img/icons/night_speed_up_icon.png';
import unfreezableIcon from '../../img/icons/unfreezable_icon.png';
import sandSpeedUpIcon from '../../img/icons/sand_speed_up_icon.png';
import snowSpeedUpIcon from '../../img/icons/snow_speed_up_icon.png';
import setBonusIcon from '../../img/icons/set_bonus_icon.png';
import swimSpeedUpIcon from '../../img/icons/swim_speed_up_icon.png';

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
