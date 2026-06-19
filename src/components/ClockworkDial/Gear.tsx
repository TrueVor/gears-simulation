import { forwardRef, memo } from "react";
import { buildGearPath } from "./gearMath";
import type { GearConfig } from "./types";

interface GearProps {
  gear: GearConfig;
}

export const Gear = memo(
  forwardRef<SVGGElement, GearProps>(({ gear }, ref) => (
    <g
      ref={ref}
      transform={`translate(${gear.cx} ${gear.cy}) rotate(${gear.initialRotation ?? 0})`}
      data-testid={`gear-${gear.id}`}
    >
      <path
        d={buildGearPath(gear.radius, gear.teeth)}
        fill={gear.fill}
        stroke={gear.stroke}
        strokeWidth="3"
      />
      <circle r={gear.radius * 0.48} fill="#111827" opacity="0.42" />
      <circle
        r={gear.radius * 0.22}
        fill="url(#axleGradient)"
        stroke="#fff2a8"
        strokeWidth="2"
      />
    </g>
  )),
);
Gear.displayName = "Gear";
