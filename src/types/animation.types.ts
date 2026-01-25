/**
 * Animation Type Definitions
 */

export const AnimationSpeed = {
  SLOW: 50,
  NORMAL: 10,
  FAST: 5,
  INSTANT: 0
} as const;

export type AnimationSpeedType = typeof AnimationSpeed[keyof typeof AnimationSpeed];

export type AnimationSpeedKey = keyof typeof AnimationSpeed;

export interface AnimationState {
  isAnimating: boolean;
  isPaused: boolean;
  speed: AnimationSpeedType;
}

export type AnimationCallback = () => void;
