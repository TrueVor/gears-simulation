import { CENTER, polarToCartesian } from './gearMath';

interface PointerProps { angle: number }

export function Pointer({ angle }: PointerProps) {
  const tip = polarToCartesian(CENTER.x, CENTER.y, 78, angle);
  const left = polarToCartesian(CENTER.x, CENTER.y, 12, angle - 92);
  const right = polarToCartesian(CENTER.x, CENTER.y, 12, angle + 92);
  return (
    <g className="pointer" data-testid="pointer" style={{ transformOrigin: `${CENTER.x}px ${CENTER.y}px` }}>
      <path d={`M ${left.x} ${left.y} L ${tip.x} ${tip.y} L ${right.x} ${right.y} Z`} fill="url(#pointerGradient)" stroke="#f8df8a" strokeWidth="2" />
    </g>
  );
}
