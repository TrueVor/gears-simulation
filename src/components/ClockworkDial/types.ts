import type { RefObject } from 'react';

export interface GearConfig {
  id: string;
  cx: number;
  cy: number;
  radius: number;
  teeth: number;
  angularSpeed?: number;
  initialRotation?: number;
  direction?: 1 | -1;
  fill?: string;
  stroke?: string;
}

export interface GearRuntimeConfig extends GearConfig {
  angularSpeed: number;
  ref: RefObject<SVGGElement | null>;
}

export interface ClockworkDialProps {
  value?: number;
  defaultValue?: number;
  dotCount?: number;
  min?: number;
  max?: number;
  startAngle?: number;
  gearSpeed?: number;
  size?: number | string;
  disabled?: boolean;
  paused?: boolean;
  onChange?: (value: number) => void;
}

export interface Point {
  x: number;
  y: number;
}
