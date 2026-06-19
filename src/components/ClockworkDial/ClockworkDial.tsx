import { type CSSProperties, type KeyboardEvent, useMemo, useRef, useState } from 'react';
import styles from './ClockworkDial.module.css';
import { Gear } from './Gear';
import { IndicatorRing } from './IndicatorRing';
import { NumberBadge } from './NumberBadge';
import { Pointer } from './Pointer';
import { activeIndexToAngle, CENTER, createMeshedGears, indexToValue, shortestAngleDelta, valueToIndex, wrapIndex } from './gearMath';
import type { ClockworkDialProps, GearRuntimeConfig } from './types';
import { useGearAnimation } from '../../hooks/useGearAnimation';

export function ClockworkDial({ value, defaultValue, dotCount = 8, min = 1, max = dotCount, startAngle = 0, gearSpeed = 1, size = 420, disabled = false, paused = false, onChange }: ClockworkDialProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? min);
  const currentValue = isControlled ? value : internalValue;
  const activeIndex = valueToIndex(currentValue, min, max, dotCount);
  const [renderedAngle, setRenderedAngle] = useState(activeIndexToAngle(activeIndex, dotCount, startAngle));
  const centerGearRef = useRef<SVGGElement | null>(null);
  const rightGearRef = useRef<SVGGElement | null>(null);

  const gears = useMemo(() => createMeshedGears(gearSpeed), [gearSpeed]);
  const runtimeGears: GearRuntimeConfig[] = useMemo(() => gears.map((gear, index) => ({ ...gear, angularSpeed: gear.angularSpeed ?? 0, ref: index === 0 ? centerGearRef : rightGearRef })), [gears]);
  useGearAnimation(runtimeGears, paused || disabled);

  const selectIndex = (nextIndex: number) => {
    if (disabled) return;
    const wrapped = wrapIndex(nextIndex, dotCount);
    const targetAngle = activeIndexToAngle(wrapped, dotCount, startAngle);
    setRenderedAngle((previous) => previous + shortestAngleDelta(previous, targetAngle));
    const nextValue = indexToValue(wrapped, min, max, dotCount);
    if (!isControlled) setInternalValue(nextValue);
    onChange?.(nextValue);
  };

  const handleKeyDown = (event: KeyboardEvent<SVGSVGElement>) => {
    const keyActions: Record<string, () => void> = {
      ArrowRight: () => selectIndex(activeIndex + 1),
      ArrowUp: () => selectIndex(activeIndex + 1),
      ArrowLeft: () => selectIndex(activeIndex - 1),
      ArrowDown: () => selectIndex(activeIndex - 1),
      Home: () => selectIndex(0),
      End: () => selectIndex(dotCount - 1),
    };
    const action = keyActions[event.key];
    if (action) { event.preventDefault(); action(); }
  };

  const style = { '--dial-size': typeof size === 'number' ? `${size}px` : size } as CSSProperties;
  const displayValue = indexToValue(activeIndex, min, max, dotCount);

  return (
    <div className={`${styles.root} ${disabled ? styles.disabled : ''}`} style={style}>
      <svg className={styles.svg} viewBox="0 0 240 240" role="slider" tabIndex={disabled ? -1 : 0} aria-label="Clockwork dial" aria-valuemin={min} aria-valuemax={max} aria-valuenow={displayValue} aria-disabled={disabled || undefined} onKeyDown={handleKeyDown}>
        <defs>
          <radialGradient id="plateGradient"><stop offset="0%" stopColor="#30261f"/><stop offset="100%" stopColor="#110f12"/></radialGradient>
          <linearGradient id="bronzeGradient" x1="0" x2="1"><stop stopColor="#5d3216"/><stop offset=".5" stopColor="#c78635"/><stop offset="1" stopColor="#321808"/></linearGradient>
          <linearGradient id="bronzeGearGradient" x1="0" x2="1"><stop stopColor="#6a3a18"/><stop offset=".55" stopColor="#d0983f"/><stop offset="1" stopColor="#3a1f0e"/></linearGradient>
          <linearGradient id="steelGradient" x1="0" x2="1"><stop stopColor="#6b7280"/><stop offset=".5" stopColor="#d1d5db"/><stop offset="1" stopColor="#374151"/></linearGradient>
          <radialGradient id="axleGradient"><stop offset="0%" stopColor="#fff6b5"/><stop offset="65%" stopColor="#d99921"/><stop offset="100%" stopColor="#7c3f0b"/></radialGradient>
          <radialGradient id="activeDotGradient"><stop offset="0%" stopColor="#fff8a8"/><stop offset="100%" stopColor="#f2b300"/></radialGradient>
          <linearGradient id="pointerGradient" x1="0" x2="1"><stop stopColor="#fff4cf"/><stop offset="1" stopColor="#c15b3b"/></linearGradient>
          <linearGradient id="badgeGradient" y1="0" y2="1"><stop stopColor="#fff4d6"/><stop offset="1" stopColor="#d9b68a"/></linearGradient>
        </defs>
        <circle cx="120" cy="126" r="112" fill="#25242a" stroke="url(#bronzeGradient)" strokeWidth="10" />
        <circle cx="120" cy="126" r="94" fill="url(#plateGradient)" stroke="#845321" strokeWidth="8" />
        {gears.map((gear, index) => <Gear key={gear.id} gear={gear} ref={index === 0 ? centerGearRef : rightGearRef} />)}
        <IndicatorRing dotCount={dotCount} activeIndex={activeIndex} startAngle={startAngle} disabled={disabled} onSelect={selectIndex} />
        <g style={{ transform: `rotate(${renderedAngle}deg)`, transformOrigin: `${CENTER.x}px ${CENTER.y}px` }}><Pointer angle={0} /></g>
        <circle cx={CENTER.x} cy={CENTER.y} r="14" fill="url(#axleGradient)" stroke="#fff0a4" strokeWidth="3" />
        <NumberBadge value={displayValue} />
      </svg>
    </div>
  );
}
