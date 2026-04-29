import { Fragment, useEffect, useMemo, useState } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { getBookingsForRoomInRange } from '../data/bookings';
import { minutesToLabel } from '../utils/time';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const SLOT_MINUTES = 30;
const START_MIN = 7 * 60;
const END_MIN = 22 * 60;
const MAX_DURATION = 240;
const MAX_SLOTS = MAX_DURATION / SLOT_MINUTES;

function startOfWeek(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function isoDate(d) {
  return d.toISOString().split('T')[0];
}

function formatMonthDay(d) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function hourLabel(m) {
  const h = Math.floor(m / 60);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${h12} ${period}`;
}

export default function WeekBookingGrid({
  roomId,
  selectedDate,
  startTime,
  endTime,
  excludeId,
  onChange,
}) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const todayIso = isoDate(today);
  const currentWeekStart = useMemo(() => startOfWeek(today), [today]);

  const [weekOffset, setWeekOffset] = useState(() => {
    if (selectedDate) {
      const diff = Math.round(
        (startOfWeek(new Date(selectedDate + 'T00:00:00')) - currentWeekStart) /
          (7 * 24 * 3600 * 1000)
      );
      return Math.max(0, diff);
    }
    return 0;
  });

  const weekStart = addDays(currentWeekStart, weekOffset * 7);
  const weekEnd = addDays(weekStart, 6);
  const weekDates = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const slots = useMemo(() => {
    const arr = [];
    for (let m = START_MIN; m < END_MIN; m += SLOT_MINUTES) arr.push(m);
    return arr;
  }, []);

  const bookings = useMemo(
    () => getBookingsForRoomInRange(roomId, isoDate(weekStart), isoDate(weekEnd)),
    [roomId, weekStart, weekEnd]
  );

  const bookingsByDate = useMemo(() => {
    const map = new Map();
    bookings.forEach(b => {
      if (excludeId && b.id === excludeId) return;
      if (!map.has(b.date)) map.set(b.date, []);
      map.get(b.date).push(b);
    });
    return map;
  }, [bookings, excludeId]);

  const isCellBooked = (date, slotStart) => {
    const slotEnd = slotStart + SLOT_MINUTES;
    const list = bookingsByDate.get(date) || [];
    return list.some(b => slotStart < b.endTime && slotEnd > b.startTime);
  };

  const isCellPast = (date, slotStart) => {
    if (date < todayIso) return true;
    if (date > todayIso) return false;
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    return slotStart + SLOT_MINUTES <= nowMin;
  };

  const [drag, setDrag] = useState(null);

  const selectedDateInThisWeek =
    selectedDate && weekDates.some(d => isoDate(d) === selectedDate);

  const selection = drag
    ? drag
    : selectedDateInThisWeek && startTime != null && endTime != null && endTime > startTime
      ? {
          date: selectedDate,
          anchorIdx: Math.max(0, (startTime - START_MIN) / SLOT_MINUTES),
          cursorIdx: Math.max(0, (endTime - START_MIN) / SLOT_MINUTES - 1),
        }
      : null;

  const isCellSelected = (date, slotIdx) => {
    if (!selection || selection.date !== date) return false;
    const min = Math.min(selection.anchorIdx, selection.cursorIdx);
    const max = Math.max(selection.anchorIdx, selection.cursorIdx);
    return slotIdx >= min && slotIdx <= max;
  };

  const clampCursor = (date, anchorIdx, targetIdx) => {
    const direction = targetIdx >= anchorIdx ? 1 : -1;
    let final = anchorIdx;
    for (
      let i = anchorIdx;
      direction > 0 ? i <= targetIdx : i >= targetIdx;
      i += direction
    ) {
      const slotStart = slots[i];
      if (slotStart === undefined) break;
      if (isCellBooked(date, slotStart) || isCellPast(date, slotStart)) break;
      if (Math.abs(i - anchorIdx) + 1 > MAX_SLOTS) break;
      final = i;
    }
    return final;
  };

  const beginDrag = (date, idx) => (e) => {
    e.preventDefault();
    const slotStart = slots[idx];
    if (isCellBooked(date, slotStart) || isCellPast(date, slotStart)) return;
    setDrag({ date, anchorIdx: idx, cursorIdx: idx });
  };

  useEffect(() => {
    if (!drag) return;

    const handleMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const el = document.elementFromPoint(clientX, clientY);
      if (!el) return;
      const cellEl = el.closest('[data-cell]');
      if (!cellEl) return;
      const cellDate = cellEl.getAttribute('data-date');
      const cellIdx = parseInt(cellEl.getAttribute('data-idx'), 10);
      if (cellDate !== drag.date) return;
      const clamped = clampCursor(cellDate, drag.anchorIdx, cellIdx);
      if (clamped !== drag.cursorIdx) {
        setDrag(d => ({ ...d, cursorIdx: clamped }));
      }
      if (e.cancelable) e.preventDefault();
    };

    const handleUp = () => {
      const min = Math.min(drag.anchorIdx, drag.cursorIdx);
      const max = Math.max(drag.anchorIdx, drag.cursorIdx);
      onChange(drag.date, slots[min], slots[max] + SLOT_MINUTES);
      setDrag(null);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [drag, slots, onChange]);

  const weekLabel = () => {
    const sameMonth =
      weekStart.getMonth() === weekEnd.getMonth() &&
      weekStart.getFullYear() === weekEnd.getFullYear();
    if (sameMonth) {
      return `${weekStart.toLocaleDateString('en-US', { month: 'short' })} ${weekStart.getDate()}\u2013${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
    }
    return `${formatMonthDay(weekStart)} \u2013 ${formatMonthDay(weekEnd)}, ${weekEnd.getFullYear()}`;
  };

  const todayStr = todayIso;

  const handleManualDate = (newDate) => {
    if (!newDate) {
      onChange('', null, null);
      return;
    }
    const s = startTime ?? 9 * 60;
    const e = endTime ?? 10 * 60;
    onChange(newDate, s, e);
    const newWeekStart = startOfWeek(new Date(newDate + 'T00:00:00'));
    const diff = Math.round((newWeekStart - currentWeekStart) / (7 * 24 * 3600 * 1000));
    setWeekOffset(Math.max(0, diff));
  };

  const handleManualStart = (val) => {
    const s = parseInt(val, 10);
    if (Number.isNaN(s)) return;
    let e = endTime ?? s + 60;
    if (e <= s) e = s + 30;
    if (e - s > MAX_DURATION) e = s + MAX_DURATION;
    if (e > END_MIN) e = END_MIN;
    onChange(selectedDate || todayStr, s, e);
  };

  const handleManualEnd = (val) => {
    const e = parseInt(val, 10);
    if (Number.isNaN(e)) return;
    const s = startTime ?? e - 60;
    if (e <= s) return;
    if (e - s > MAX_DURATION) return;
    onChange(selectedDate || todayStr, s, e);
  };

  const startOptions = slots.map(m => ({ value: m, label: minutesToLabel(m) }));
  const endOptions = [];
  for (let m = START_MIN + SLOT_MINUTES; m <= END_MIN; m += SLOT_MINUTES) {
    endOptions.push({ value: m, label: minutesToLabel(m) });
  }

  return (
    <div className="week-booking-grid">
      <fieldset className="mb-3 manual-time-entry">
        <legend className="visually-hidden">Manual date and time entry</legend>
        <Row className="g-2 align-items-end">
          <Col sm={5}>
            <Form.Group controlId="wbg-date">
              <Form.Label className="small mb-1">Date</Form.Label>
              <Form.Control
                type="date"
                size="sm"
                min={todayStr}
                value={selectedDate || ''}
                onChange={(e) => handleManualDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col xs={6} sm={3}>
            <Form.Group controlId="wbg-start">
              <Form.Label className="small mb-1">Start</Form.Label>
              <Form.Select
                size="sm"
                value={startTime ?? ''}
                onChange={(e) => handleManualStart(e.target.value)}
                disabled={!selectedDate}
              >
                <option value="">Select...</option>
                {startOptions.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col xs={6} sm={3}>
            <Form.Group controlId="wbg-end">
              <Form.Label className="small mb-1">End</Form.Label>
              <Form.Select
                size="sm"
                value={endTime ?? ''}
                onChange={(e) => handleManualEnd(e.target.value)}
                disabled={!selectedDate || startTime == null}
              >
                <option value="">Select...</option>
                {endOptions
                  .filter(o => startTime == null || (o.value > startTime && o.value - startTime <= MAX_DURATION))
                  .map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col sm={1} className="d-none d-sm-block">
            <small className="text-muted">or drag</small>
          </Col>
        </Row>
        <small className="text-muted d-block mt-1">
          Use the form above for keyboard entry, or drag on the grid below.
        </small>
      </fieldset>

      <div className="d-flex justify-content-between align-items-center mb-2">
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => setWeekOffset(o => Math.max(0, o - 1))}
          disabled={weekOffset === 0}
          aria-label="Previous week"
        >
          <i className="bi bi-chevron-left" />
        </Button>
        <div className="text-white fw-bold text-center">
          {weekLabel()}
          {weekOffset === 0 && (
            <span
              className="badge bg-primary ms-2 align-middle"
              style={{ fontSize: '0.65rem' }}
            >
              This Week
            </span>
          )}
        </div>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => setWeekOffset(o => o + 1)}
          aria-label="Next week"
        >
          <i className="bi bi-chevron-right" />
        </Button>
      </div>

      <div className="wbg-scroll">
        <div className="wbg-grid">
          <div className="wbg-corner" />
          {weekDates.map((d, i) => {
            const iso = isoDate(d);
            const isToday = iso === todayIso;
            return (
              <div
                key={iso}
                className={`wbg-day-header ${isToday ? 'wbg-today-header' : ''}`}
              >
                <div className="small text-white-50">{DAY_NAMES[i]}</div>
                <div className="fw-bold text-white">{d.getDate()}</div>
              </div>
            );
          })}

          {slots.map((slotStart, idx) => (
            <Fragment key={slotStart}>
              <div className="wbg-hour-label">
                {slotStart % 60 === 0 ? hourLabel(slotStart) : ''}
              </div>
              {weekDates.map(d => {
                const date = isoDate(d);
                const isToday = date === todayIso;
                const booked = isCellBooked(date, slotStart);
                const past = isCellPast(date, slotStart);
                const selected = isCellSelected(date, idx);
                let cls = 'wbg-cell';
                if (past) cls += ' wbg-past';
                else if (booked) cls += ' wbg-booked';
                else cls += ' wbg-free';
                if (selected) cls += ' wbg-selected';
                if (isToday) cls += ' wbg-today-col';
                if (slotStart % 60 === 0) cls += ' wbg-hour-boundary';
                const disabled = past || booked;
                return (
                  <div
                    key={date + '-' + slotStart}
                    className={cls}
                    data-cell=""
                    data-date={date}
                    data-idx={idx}
                    onMouseDown={disabled ? undefined : beginDrag(date, idx)}
                    onTouchStart={disabled ? undefined : beginDrag(date, idx)}
                    title={
                      past
                        ? 'Past'
                        : booked
                          ? 'Already booked'
                          : `${date} ${minutesToLabel(slotStart)}`
                    }
                  />
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>

      {selection ? (
        <div className="wbg-summary mt-3">
          <i className="bi bi-check-circle me-2 text-success" />
          <strong className="text-white">
            {new Date(selection.date + 'T00:00:00').toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </strong>{' '}
          <span className="text-muted">from</span>{' '}
          <strong className="text-white">
            {minutesToLabel(slots[Math.min(selection.anchorIdx, selection.cursorIdx)])}
          </strong>{' '}
          <span className="text-muted">to</span>{' '}
          <strong className="text-white">
            {minutesToLabel(slots[Math.max(selection.anchorIdx, selection.cursorIdx)] + SLOT_MINUTES)}
          </strong>
        </div>
      ) : (
        <div className="wbg-summary-empty mt-3">
          <i className="bi bi-hand-index me-2" />
          Click and drag across green cells to pick your booking window.
        </div>
      )}

      <div className="d-flex gap-3 mt-2 flex-wrap">
        <small className="text-muted d-flex align-items-center gap-1">
          <span className="wbg-legend-swatch wbg-free" /> Available
        </small>
        <small className="text-muted d-flex align-items-center gap-1">
          <span className="wbg-legend-swatch wbg-booked" /> Booked
        </small>
        <small className="text-muted d-flex align-items-center gap-1">
          <span className="wbg-legend-swatch wbg-past" /> Past
        </small>
        <small className="text-muted d-flex align-items-center gap-1">
          <span className="wbg-legend-swatch wbg-selected" /> Your Selection
        </small>
        <small className="text-muted ms-auto">30-min slots &bull; 4h max</small>
      </div>
    </div>
  );
}
