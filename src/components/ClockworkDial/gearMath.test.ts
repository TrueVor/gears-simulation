import { describe, expect, it } from 'vitest';
import { activeIndexToAngle, calculateDrivenSpeed, indexToValue, valueToIndex, wrapIndex } from './gearMath';

describe('gear math', () => {
  it('calculates external gear ratios', () => expect(calculateDrivenSpeed(1, 12, 24, 'external')).toBe(-0.5));
  it('calculates internal gear ratios', () => expect(calculateDrivenSpeed(1, 12, 24, 'internal')).toBe(0.5));
  it('reverses direction for externally meshed gears', () => expect(Math.sign(calculateDrivenSpeed(70, 12, 24, 'external'))).toBe(-1));
  it('rotates a larger driven gear more slowly', () => expect(Math.abs(calculateDrivenSpeed(70, 12, 24, 'external'))).toBeLessThan(70));
  it('converts active index to angle', () => expect(activeIndexToAngle(2, 8, -90)).toBe(0));
  it('maps index to value and value to index', () => { expect(indexToValue(3, 10, 40, 4)).toBe(40); expect(valueToIndex(20, 10, 40, 4)).toBe(1); });
  it('wraps from last to first', () => { expect(wrapIndex(8, 8)).toBe(0); expect(wrapIndex(-1, 8)).toBe(7); });
});
