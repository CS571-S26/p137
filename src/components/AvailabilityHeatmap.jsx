import { Fragment, useMemo } from 'react';
import { getBookingsForRoomInRange } from '../data/bookings';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function hourLabel(h) {
  if (h === 0) return '12a';
  if (h === 12) return '12p';
  if (h < 12) return `${h}a`;
  return `${h - 12}p`;
}

function isoDate(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
}

function dayLabel(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return { weekday: DAY_NAMES[d.getDay()], dom: d.getDate() };
}

function overlapMinutes(aStart, aEnd, bStart, bEnd) {
  return Math.max(0, Math.min(aEnd, bEnd) - Math.max(aStart, bStart));
}

export default function AvailabilityHeatmap({ roomId, days = 7, startHour = 7, endHour = 22 }) {
  const startDate = isoDate(0);
  const endDate = isoDate(days - 1);

  const bookings = useMemo(
    () => getBookingsForRoomInRange(roomId, startDate, endDate),
    [roomId, startDate, endDate]
  );

  const hours = [];
  for (let h = startHour; h < endHour; h++) hours.push(h);

  const dayOffsets = Array.from({ length: days }, (_, i) => i);

  const grid = dayOffsets.map(offset => {
    const date = isoDate(offset);
    const dayBookings = bookings.filter(b => b.date === date);
    return hours.map(h => {
      const cellStart = h * 60;
      const cellEnd = (h + 1) * 60;
      const bookedMin = dayBookings.reduce(
        (sum, b) => sum + overlapMinutes(cellStart, cellEnd, b.startTime, b.endTime),
        0
      );
      return { date, hour: h, bookedMin };
    });
  });

  const colorFor = (bookedMin) => {
    if (bookedMin === 0) return { bg: '#0d2b1a', border: '#1a5c34' };
    if (bookedMin < 30) return { bg: '#3d2e0b', border: '#6e5413' };
    if (bookedMin < 60) return { bg: '#5c3a0e', border: '#996419' };
    return { bg: '#4a1820', border: '#8c2b36' };
  };

  const labelFor = (bookedMin) => {
    if (bookedMin === 0) return 'Free';
    if (bookedMin >= 60) return 'Booked';
    return `${bookedMin}m booked`;
  };

  return (
    <div className="availability-heatmap">
      <div className="d-flex align-items-center gap-3 mb-2 flex-wrap">
        <small className="text-muted me-2">Next {days} days &bull; {hourLabel(startHour)}&ndash;{hourLabel(endHour)}</small>
        <div className="d-flex align-items-center gap-2">
          <span className="heatmap-legend-swatch" style={{ background: '#0d2b1a', borderColor: '#1a5c34' }} />
          <small className="text-muted">Free</small>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="heatmap-legend-swatch" style={{ background: '#5c3a0e', borderColor: '#996419' }} />
          <small className="text-muted">Partial</small>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="heatmap-legend-swatch" style={{ background: '#4a1820', borderColor: '#8c2b36' }} />
          <small className="text-muted">Booked</small>
        </div>
      </div>

      <div className="heatmap-scroll">
        <div className="heatmap-grid" style={{ gridTemplateColumns: `auto repeat(${days}, 1fr)` }}>
          <div />
          {dayOffsets.map(offset => {
            const { weekday, dom } = dayLabel(offset);
            return (
              <div key={offset} className="heatmap-header">
                <div className="small text-white-50">{weekday}</div>
                <div className="fw-bold text-white">{dom}</div>
              </div>
            );
          })}

          {hours.map((h, rowIdx) => (
            <Fragment key={`row-${h}`}>
              <div className="heatmap-hour-label">{hourLabel(h)}</div>
              {dayOffsets.map(offset => {
                const cell = grid[offset][rowIdx];
                const { bg, border } = colorFor(cell.bookedMin);
                return (
                  <div
                    key={`${offset}-${h}`}
                    className="heatmap-cell"
                    style={{ background: bg, borderColor: border }}
                    title={`${cell.date} ${hourLabel(h)} - ${labelFor(cell.bookedMin)}`}
                  />
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
