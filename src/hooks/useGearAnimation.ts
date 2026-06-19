import { useEffect, useRef } from 'react';
import type { GearRuntimeConfig } from '../components/ClockworkDial/types';

const MAX_DELTA_SECONDS = 0.05;

function usePrefersReducedMotion(): boolean {
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  return Boolean(reduced);
}

export function useGearAnimation(gears: GearRuntimeConfig[], paused = false): void {
  const frameRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);
  const rotationsRef = useRef<Record<string, number>>({});
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    gears.forEach((gear) => {
      rotationsRef.current[gear.id] = gear.initialRotation ?? 0;
      gear.ref.current?.setAttribute('transform', `translate(${gear.cx} ${gear.cy}) rotate(${rotationsRef.current[gear.id]})`);
    });

    if (paused || prefersReducedMotion) return undefined;

    const tick = (time: number) => {
      const previous = previousTimeRef.current ?? time;
      const deltaSeconds = Math.min((time - previous) / 1000, MAX_DELTA_SECONDS);
      previousTimeRef.current = time;

      gears.forEach((gear) => {
        const nextRotation = (rotationsRef.current[gear.id] ?? gear.initialRotation ?? 0) + gear.angularSpeed * deltaSeconds;
        rotationsRef.current[gear.id] = nextRotation;
        gear.ref.current?.setAttribute('transform', `translate(${gear.cx} ${gear.cy}) rotate(${nextRotation})`);
      });

      frameRef.current = window.requestAnimationFrame(tick);
    };

    frameRef.current = window.requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
      previousTimeRef.current = null;
    };
  }, [gears, paused, prefersReducedMotion]);
}
