import type { GearConfig, Point } from "./types";

export const VIEWBOX_SIZE = 240;
export const CENTER: Point = { x: 120, y: 126 };

export function calculateDrivenSpeed(
  driverSpeed: number,
  driverTeeth: number,
  drivenTeeth: number,
  mesh: "external" | "internal" = "external",
): number {
  const ratio = driverTeeth / drivenTeeth;
  return mesh === "external" ? -driverSpeed * ratio : driverSpeed * ratio;
}

export function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleDegrees: number,
): Point {
  const angleRadians = (angleDegrees - 90) * (Math.PI / 180);
  return {
    x: cx + radius * Math.cos(angleRadians),
    y: cy + radius * Math.sin(angleRadians),
  };
}

export function activeIndexToAngle(
  activeIndex: number,
  dotCount: number,
  startAngle: number,
): number {
  return startAngle + activeIndex * (360 / dotCount);
}

export function shortestAngleDelta(from: number, to: number): number {
  return ((((to - from) % 360) + 540) % 360) - 180;
}

export function wrapIndex(index: number, dotCount: number): number {
  return ((index % dotCount) + dotCount) % dotCount;
}

export function indexToValue(
  index: number,
  min: number,
  max: number,
  dotCount: number,
): number {
  if (dotCount <= 1) return min;
  return Math.round(min + (index * (max - min)) / (dotCount - 1));
}

export function valueToIndex(
  value: number,
  min: number,
  max: number,
  dotCount: number,
): number {
  if (dotCount <= 1 || max === min) return 0;
  const clamped = Math.min(max, Math.max(min, value));
  return wrapIndex(
    Math.round(((clamped - min) / (max - min)) * (dotCount - 1)),
    dotCount,
  );
}

export function buildGearPath(radius: number, teeth: number): string {
  const rootRadius = radius * 0.84;
  const outerRadius = radius;
  const points: Point[] = [];
  const steps = teeth * 2;
  for (let i = 0; i < steps; i += 1) {
    const angle = (i / steps) * 360;
    const pointRadius = i % 2 === 0 ? outerRadius : rootRadius;
    points.push(polarToCartesian(0, 0, pointRadius, angle));
  }
  return (
    points
      .map(
        (p, index) =>
          `${index === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`,
      )
      .join(" ") + " Z"
  );
}

export function createMeshedGears(gearSpeed: number): GearConfig[] {
  const centerTeeth = 12;
  const rightTeeth = 24;
  const centerSpeed = gearSpeed * 70;
  return [
    {
      id: "center",
      cx: 120,
      cy: 126,
      radius: 23,
      toothThicknessPercent: 0.5,
      teeth: centerTeeth,
      angularSpeed: centerSpeed,
      fill: "url(#steelGradient)",
      stroke: "#111827",
    },
    {
      id: "right",
      cx: 180,
      cy: 92,
      radius: 44,
      toothThicknessPercent: 0.5,
      teeth: rightTeeth,
      angularSpeed: calculateDrivenSpeed(
        centerSpeed,
        centerTeeth,
        rightTeeth,
        "external",
      ),
      initialRotation: 7.5,
      fill: "url(#bronzeGearGradient)",
      stroke: "#241407",
    },
  ];
}
