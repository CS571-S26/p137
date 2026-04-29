import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Breadcrumb } from 'react-bootstrap';
import { useState } from 'react';
import { getRoomById, getLocationById } from '../data/campusData';
import BookingForm from '../components/BookingForm';
import { minutesToLabel } from '../utils/time';

export default function BookingPage() {
  const { id } = useParams();
  const room = getRoomById(id);
  const location = room ? getLocationById(room.locationId) : null;
  const [confirmed, setConfirmed] = useState(false);

  if (!room || !location) {
    return (
      <Container className="py-5 text-center">
        <h1>Room not found</h1>
        <Link to="/browse">Back to Browse</Link>
      </Container>
    );
  }

  const handleSubmit = (formData) => {
    const existing = JSON.parse(localStorage.getItem('campusreserve-reservations') || '[]');
    const durationMin = formData.endTime - formData.startTime;
    const reservation = {
      id: `res-${Date.now()}`,
      roomId: room.id,
      roomName: room.name,
      locationName: location.name,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      timeDisplay: `${minutesToLabel(formData.startTime)} \u2013 ${minutesToLabel(formData.endTime)}`,
      duration: durationMin,
      groupSize: formData.groupSize,
      name: formData.name,
      email: formData.email,
      purpose: formData.purpose,
      notes: formData.notes,
      status: 'upcoming',
      createdAt: new Date().toISOString(),
    };
    existing.push(reservation);
    localStorage.setItem('campusreserve-reservations', JSON.stringify(existing));
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="mb-3" style={{ fontSize: '4rem' }}><i className="bi bi-check-circle text-success" /></div>
          <h2 className="text-success mb-3">Reservation Confirmed!</h2>
          <p className="text-muted mb-4">
            Your reservation for <strong>{room.name}</strong> at <strong>{location.name}</strong> has been confirmed.
            You will receive a confirmation email shortly.
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <Link to="/dashboard" className="btn btn-primary">View My Reservations</Link>
            <Link to="/browse" className="btn btn-outline-secondary">Book Another Room</Link>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>Home</Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/room/${room.id}` }}>{room.name}</Breadcrumb.Item>
        <Breadcrumb.Item active>Book</Breadcrumb.Item>
      </Breadcrumb>

      <Row>
        <Col md={4}>
          <Card className="shadow-sm mb-3 sticky-top" style={{ top: '80px' }}>
            <Card.Img variant="top" src={room.image} alt={room.name} style={{ height: '180px', objectFit: 'cover' }} />
            <Card.Body>
              <div className="mb-1 h5 text-white fw-semibold">{room.name}</div>
              <p className="text-muted small mb-2">{location.name} &bull; Floor {room.floor}</p>
              <div className="d-flex gap-2 mb-2">
                <span className="badge badge-dark-subtle"><i className="bi bi-people me-1" />{room.capacity}</span>
                <span className="badge badge-dark-subtle">{room.type}</span>
              </div>
              <small className="text-muted">{room.amenities.join(' \u2022 ')}</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <h1 className="mb-3 text-white h4">Reserve {room.name}</h1>
              <BookingForm room={room} onSubmit={handleSubmit} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
