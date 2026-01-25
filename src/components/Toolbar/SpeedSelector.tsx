/**
 * Speed Selector Component
 */

import React from 'react';
import { AnimationSpeed, AnimationSpeedType } from '../../types';

interface SpeedSelectorProps {
  onSelect: (speed: AnimationSpeedType) => void;
  disabled?: boolean;
}

export const SpeedSelector: React.FC<SpeedSelectorProps> = ({
  onSelect,
  disabled = false,
}) => {
  return (
    <div className="dropdown">
      <button className="btn dropdown-btn" aria-label="Select animation speed">
        Speed
      </button>
      <div className="dropdown-content" role="menu">
        <button
          type="button"
          role="menuitem"
          onClick={() => onSelect(AnimationSpeed.SLOW)}
          disabled={disabled}
        >
          Slow
        </button>
        <button
          type="button"
          role="menuitem"
          onClick={() => onSelect(AnimationSpeed.NORMAL)}
          disabled={disabled}
        >
          Normal
        </button>
        <button
          type="button"
          role="menuitem"
          onClick={() => onSelect(AnimationSpeed.FAST)}
          disabled={disabled}
        >
          Fast
        </button>
        <button
          type="button"
          role="menuitem"
          onClick={() => onSelect(AnimationSpeed.INSTANT)}
          disabled={disabled}
        >
          Instant
        </button>
      </div>
    </div>
  );
};
