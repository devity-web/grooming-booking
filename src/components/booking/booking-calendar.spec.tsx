import {renderToStaticMarkup} from 'react-dom/server';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {BookingCalendar} from './booking-calendar';

describe('BookingCalendar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 7, 13, 12));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the current month and weekday headings', () => {
    const html = renderToStaticMarkup(<BookingCalendar onSelect={vi.fn()} />);

    expect(html).toContain('Agosto 2026');
    for (const weekday of ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']) {
      expect(html).toContain(`>${weekday}<`);
    }
    expect(html).toContain('aria-label="Mês anterior"');
    expect(html).toContain('aria-label="Próximo mês"');
  });

  it('disables past dates and the previous-month control', () => {
    const html = renderToStaticMarkup(<BookingCalendar onSelect={vi.fn()} />);

    expect(html).toMatch(
      /<button[^>]*disabled=""[^>]*aria-label="Mês anterior"[^>]*>/,
    );
    expect(html).toMatch(
      /<button[^>]*disabled=""[^>]*aria-pressed="false"[^>]*>12<\/button>/,
    );
    expect(html).toMatch(
      /<button(?![^>]*disabled="")[^>]*aria-pressed="false"[^>]*>13<\/button>/,
    );
  });

  it('marks the selected date as pressed', () => {
    const html = renderToStaticMarkup(
      <BookingCalendar selected={new Date(2026, 7, 20)} onSelect={vi.fn()} />,
    );

    expect(html).toMatch(/<button[^>]*aria-pressed="true"[^>]*>20<\/button>/);
  });
});
