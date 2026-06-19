import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ClockworkDial } from './ClockworkDial';

describe('ClockworkDial', () => {
  it('renders exactly one active indicator', () => {
    render(<ClockworkDial defaultValue={3} dotCount={8} />);
    const indicators = screen.getAllByTestId(/indicator-/);
    expect(indicators.filter((indicator) => indicator.getAttribute('data-active') === 'true')).toHaveLength(1);
  });

  it('moves pointer and emits value after clicking an indicator', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ClockworkDial defaultValue={1} dotCount={8} onChange={onChange} />);
    await user.click(screen.getByTestId('indicator-4'));
    expect(onChange).toHaveBeenCalledWith(5);
    expect(screen.getByTestId('indicator-4').getAttribute('data-active')).toBe('true');
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ClockworkDial value={1} dotCount={8} onChange={onChange} />);
    const slider = screen.getByRole('slider', { name: /clockwork dial/i });
    slider.focus();
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith(2);
    await user.keyboard('{End}');
    expect(onChange).toHaveBeenLastCalledWith(8);
  });
});
