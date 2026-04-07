import { useRef, useCallback, useEffect, useState } from 'react';

const MIN_TIME = 420;
const MAX_TIME = 1380;
const STEP = 15;
const MAX_DURATION = 240;
const MIN_DURATION = 15;
const TOTAL_STEPS = (MAX_TIME - MIN_TIME) / STEP;

function minutesToLabel(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
}

function durationLabel(start, end) {
  const diff = end - start;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function snap(val) {
  return Math.round((val - MIN_TIME) / STEP) * STEP + MIN_TIME;
}

export default function TimeRangeSlider({ startTime, endTime, onChange }) {
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(null);

  const pct = (val) => ((val - MIN_TIME) / (MAX_TIME - MIN_TIME)) * 100;

  const getTimeFromX = useCallback((clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const raw = MIN_TIME + ratio * (MAX_TIME - MIN_TIME);
    return snap(raw);
  }, []);

  const handlePointerDown = useCallback((thumb) => (e) => {
    e.preventDefault();
    setDragging(thumb);
  }, []);

  useEffect(() => {
    if (!dragging) return;

    const handleMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const t = getTimeFromX(clientX);

      if (dragging === 'start') {
        let newStart = Math.min(t, MAX_TIME - MIN_DURATION);
        let newEnd = endTime;
        if (newEnd - newStart < MIN_DURATION) newEnd = newStart + MIN_DURATION;
        if (newEnd - newStart > MAX_DURATION) newEnd = newStart + MAX_DURATION;
        if (newEnd > MAX_TIME) { newEnd = MAX_TIME; newStart = newEnd - MIN_DURATION; }
        onChange(snap(newStart), snap(newEnd));
      } else {
        let newEnd = Math.max(t, MIN_TIME + MIN_DURATION);
        let newStart = startTime;
        if (newEnd - newStart < MIN_DURATION) newStart = newEnd - MIN_DURATION;
        if (newEnd - newStart > MAX_DURATION) newStart = newEnd - MAX_DURATION;
        if (newStart < MIN_TIME) { newStart = MIN_TIME; newEnd = newStart + MIN_DURATION; }
        onChange(snap(newStart), snap(newEnd));
      }
    };

    const handleUp = () => setDragging(null);

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
  }, [dragging, startTime, endTime, onChange, getTimeFromX]);

  const ticks = [];
  for (let t = MIN_TIME; t <= MAX_TIME; t += 60) {
    ticks.push(t);
  }

  return (
    <div className="time-range-slider">
      <div className="d-flex justify-content-between align-items-baseline mb-2">
        <div>
          <span className="text-white fw-bold fs-5">{minutesToLabel(startTime)}</span>
          <span className="text-muted mx-2">&ndash;</span>
          <span className="text-white fw-bold fs-5">{minutesToLabel(endTime)}</span>
        </div>
        <span className="badge bg-primary">{durationLabel(startTime, endTime)}</span>
      </div>

      <div
        ref={trackRef}
        className="slider-track"
        style={{ position: 'relative', height: '36px', cursor: 'pointer', userSelect: 'none', touchAction: 'none' }}
      >
        <div className="slider-rail" />
        <div
          className="slider-fill"
          style={{ left: `${pct(startTime)}%`, width: `${pct(endTime) - pct(startTime)}%` }}
        />
        <div
          className={`slider-thumb ${dragging === 'start' ? 'active' : ''}`}
          style={{ left: `${pct(startTime)}%` }}
          onMouseDown={handlePointerDown('start')}
          onTouchStart={handlePointerDown('start')}
          role="slider"
          aria-label="Start time"
          aria-valuemin={MIN_TIME}
          aria-valuemax={MAX_TIME}
          aria-valuenow={startTime}
          tabIndex={0}
        />
        <div
          className={`slider-thumb ${dragging === 'end' ? 'active' : ''}`}
          style={{ left: `${pct(endTime)}%` }}
          onMouseDown={handlePointerDown('end')}
          onTouchStart={handlePointerDown('end')}
          role="slider"
          aria-label="End time"
          aria-valuemin={MIN_TIME}
          aria-valuemax={MAX_TIME}
          aria-valuenow={endTime}
          tabIndex={0}
        />
      </div>

      <div className="slider-ticks" style={{ position: 'relative', height: '20px' }}>
        {ticks.map(t => (
          <span
            key={t}
            className="slider-tick-label"
            style={{ left: `${pct(t)}%` }}
          >
            {Math.floor(t / 60) > 12 ? Math.floor(t / 60) - 12 : Math.floor(t / 60)}{t / 60 < 12 ? 'a' : 'p'}
          </span>
        ))}
      </div>

      <div className="d-flex justify-content-between mt-1">
        <small className="text-muted">15-min increments</small>
        <small className="text-muted">4h max</small>
      </div>
    </div>
  );
}

export { minutesToLabel, MIN_TIME, MAX_TIME };
