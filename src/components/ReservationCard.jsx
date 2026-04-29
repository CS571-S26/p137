import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function formatDuration(minutes) {
  if (!minutes) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

export default function ReservationCard({ reservation, onCancel, onReschedule }) {
  const statusColors = {
    upcoming: 'primary',
    completed: 'success',
    cancelled: 'secondary',
  };

  const timeStr = reservation.timeDisplay || reservation.timeSlot || '';
  const durationStr = typeof reservation.duration === 'number'
    ? formatDuration(reservation.duration)
    : reservation.duration ? `${reservation.duration}h` : '';

  return (
    <Card className="mb-3 shadow-sm reservation-card">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h2 className="mb-1 text-white h6">{reservation.roomName}</h2>
            <small className="text-muted d-block">{reservation.locationName}</small>
          </div>
          <Badge bg={statusColors[reservation.status] || 'secondary'}>
            {reservation.status}
          </Badge>
        </div>
        <hr className="my-2" />
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <small className="d-block">
              <strong>Date:</strong> {reservation.date}
            </small>
            <small className="d-block">
              <strong>Time:</strong> {timeStr}{durationStr ? ` (${durationStr})` : ''}
            </small>
            <small className="d-block">
              <strong>Group:</strong> {reservation.groupSize} people
            </small>
          </div>
          <div className="d-flex flex-column gap-1">
            <Link to={`/room/${reservation.roomId}`} className="btn btn-outline-primary btn-sm">
              View Room
            </Link>
            {reservation.status === 'upcoming' && onReschedule && (
              <Button
                variant="outline-warning"
                size="sm"
                onClick={() => onReschedule(reservation)}
              >
                <i className="bi bi-calendar-event me-1" />Reschedule
              </Button>
            )}
            {reservation.status === 'upcoming' && (
              <Button variant="outline-danger" size="sm" onClick={() => onCancel(reservation.id)}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
