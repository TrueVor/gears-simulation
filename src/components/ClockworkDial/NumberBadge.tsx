interface NumberBadgeProps {
  value: number;
}
export function NumberBadge({ value }: NumberBadgeProps) {
  return (
    <g aria-hidden="true">
      <path
        d="M96 24 Q120 6 144 24 L138 61 Q120 76 102 61 Z"
        fill="url(#badgeGradient)"
        stroke="#432818"
        strokeWidth="4"
        style={{ transform: 'translate(0, -17px)' }}
      />
      <text
        x="120"
        y="32"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="24"
        fontWeight="800"
        fill="#38210f"
      >
        {value}
      </text>
    </g>
  );
}
