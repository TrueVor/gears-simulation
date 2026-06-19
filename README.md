# Gears Simulation: Clockwork Dial

An original fantasy-mechanical clockwork selector built with React, TypeScript, Vite, SVG, and Vitest. The component recreates the concept of a geared dial with discrete indicator positions without copying or extracting any game artwork.

## Install and run

```bash
npm install
npm run dev
npm run typecheck
npm run test
npm run build
```

> Note: this environment blocked access to the npm registry while this feature was implemented. The project is configured to run with the commands above once dependencies can be installed.

## Component usage

```tsx
import { useState } from 'react';
import { ClockworkDial } from './components/ClockworkDial/ClockworkDial';

const [value, setValue] = useState(3);

<ClockworkDial
  value={value}
  min={1}
  max={8}
  dotCount={8}
  gearSpeed={1}
  size={420}
  onChange={setValue}
/>;
```

## Props

| Prop | Type | Default | Behavior |
| --- | --- | --- | --- |
| `value` | `number` | `undefined` | Enables controlled mode when provided. |
| `defaultValue` | `number` | `min` | Initial uncontrolled value. |
| `dotCount` | `number` | `8` | Number of discrete socket positions. |
| `min` | `number` | `1` | Minimum displayed value. |
| `max` | `number` | `dotCount` | Maximum displayed value. |
| `startAngle` | `number` | `0` | Angle for the first indicator position. |
| `gearSpeed` | `number` | `1` | Multiplier for the driver gear angular speed. |
| `size` | `number \| string` | `420` | CSS size for the responsive SVG. |
| `disabled` | `boolean` | `false` | Disables pointer, indicator, and keyboard changes. |
| `paused` | `boolean` | `false` | Pauses continuous gear animation. |
| `onChange` | `(value: number) => void` | `undefined` | Called with the mapped value when the selected position changes. |

## Controlled and uncontrolled modes

When `value` is supplied, the dial is controlled: clicks and keyboard input call `onChange`, and the parent owns the selected value. Without `value`, the dial stores its own selected value initialized from `defaultValue` or `min`.

## Gear-ratio calculation

The center gear is the driver and the larger right gear is externally meshed. External mesh speed is calculated with:

```ts
drivenSpeed = -driverSpeed * (driverTeeth / drivenTeeth);
```

The negative sign reverses direction. Because the right gear has twice as many teeth as the center gear, it rotates at half the magnitude of the center gear. Internal meshing is also supported by the pure math helper and preserves direction:

```ts
drivenSpeed = driverSpeed * (driverTeeth / drivenTeeth);
```

## Why SVG instead of Canvas or WebGL?

SVG keeps every mechanical layer scalable, styleable, accessible, and testable as DOM. The dial uses gradients, strokes, paths, and filters without raster assets. Canvas/WebGL would make pointer and dot interactions less semantic and harder to style for this 2D UI component.

## Animation behavior

Gear animation uses `requestAnimationFrame`, mutable refs, and direct SVG `transform` updates. React state is not updated every frame; state is reserved for meaningful application values such as the active indicator. Delta time is clamped to avoid jumps after inactive tabs. If `prefers-reduced-motion: reduce` is enabled, continuous gear animation stops while selected state remains usable.

## Accessibility and interaction

The SVG root uses slider semantics with `aria-valuemin`, `aria-valuemax`, and `aria-valuenow`. Dots can be clicked, and keyboard controls support Arrow keys, Home, and End. The pointer snaps to discrete positions and takes the shortest route across the `0°/360°` boundary.
