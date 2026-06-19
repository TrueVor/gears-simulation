import { CENTER, polarToCartesian } from './gearMath';

interface IndicatorRingProps {
  dotCount: number;
  activeIndex: number;
  startAngle: number;
  disabled?: boolean;
  onSelect: (index: number) => void;
}

export function IndicatorRing({ dotCount, activeIndex, startAngle, disabled, onSelect }: IndicatorRingProps) {
  return (
    <g>
      {Array.from({ length: dotCount }, (_, index) => {
        const point = polarToCartesian(CENTER.x, CENTER.y, 82, startAngle + index * (360 / dotCount));
        const active = index === activeIndex;
        return (
          <g
            key={index}
            role="button"
            aria-label={`Select position ${index + 1}`}
            aria-disabled={disabled || undefined}
            onClick={() => !disabled && onSelect(index)}
            data-testid={`indicator-${index}`}
            data-active={active ? 'true' : 'false'}
          >
            <circle cx={point.x} cy={point.y} r="11" fill="#080a0d" stroke="#6b4422" strokeWidth="4" />
            <circle cx={point.x} cy={point.y} r={active ? 8 : 5} fill={active ? 'url(#activeDotGradient)' : '#15171c'} stroke={active ? '#fff0a8' : '#050505'} strokeWidth="2" />
          </g>
        );
      })}
    </g>
  );
}
