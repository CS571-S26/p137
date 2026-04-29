import { useEffect, useState } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import WeekBookingGrid from './WeekBookingGrid';
import { minutesToLabel } from '../utils/time';
import { findConflict } from '../data/bookings';

export default function RescheduleModal({ show, reservation, onClose, onConfirm }) {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (reservation && show) {
      setDate(reservation.date);
      setStartTime(reservation.startTime ?? null);
      setEndTime(reservation.endTime ?? null);
      setError('');
    }
  }, [reservation, show]);

  if (!reservation) return null;

  const today = new Date().toISOString().split('T')[0];
  const hasSelection = date && startTime != null && endTime != null;
  const conflict = hasSelection
    ? findConflict(reservation.roomId, date, startTime, endTime, reservation.id)
    : null;

  const handleConfirm = () => {
    if (!hasSelection) return setError('Pick a new date and time on the grid.');
    if (date < today) return setError('Date cannot be in the past.');
    if (endTime <= startTime) return setError('Invalid time range.');
    if (conflict) return setError('This slot overlaps an existing reservation.');

    onConfirm({
      ...reservation,
      date,
      startTime,
      endTime,
      timeDisplay: `${minutesToLabel(startTime)} \u2013 ${minutesToLabel(endTime)}`,
      duration: endTime - startTime,
    });
    onClose();
  };

  const unchanged =
    date === reservation.date &&
    startTime === reservation.startTime &&
    endTime === reservation.endTime;

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton closeVariant="white" data-bs-theme="dark">
        <Modal.Title>Reschedule Reservation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted small mb-3">
          <strong className="text-white">{reservation.roomName}</strong> &bull; {reservation.locationName}
          <br />
          <span className="text-muted">
            Currently: {reservation.date} &bull; {reservation.timeDisplay}
          </span>
        </p>

        <WeekBookingGrid
          roomId={reservation.roomId}
          selectedDate={date}
          startTime={startTime}
          endTime={endTime}
          excludeId={reservation.id}
          onChange={(d, s, e) => {
            setDate(d);
            setStartTime(s);
            setEndTime(e);
            setError('');
          }}
        />

        {error && <Alert variant="danger" className="py-2 mt-3 mb-0">{error}</Alert>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose}>Cancel</Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={!hasSelection || !!conflict || unchanged}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
