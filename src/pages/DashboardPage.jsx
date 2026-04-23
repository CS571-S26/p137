import { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Tabs, Tab, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getAllRooms, getEquipmentForRoom, getLocations } from '../data/campusData';
import ReservationCard from '../components/ReservationCard';
import RoomCard from '../components/RoomCard';
import RescheduleModal from '../components/RescheduleModal';

export default function DashboardPage() {
  const [reservations, setReservations] = useState(() => {
    try { return JSON.parse(localStorage.getItem('campusreserve-reservations')) || []; }
    catch { return []; }
  });

  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('campusreserve-favorites')) || []; }
    catch { return []; }
  });

  const [rescheduling, setRescheduling] = useState(null);

  const allRooms = getAllRooms();
  const locations = getLocations();

  const favoriteRooms = useMemo(() => {
    return allRooms.filter(r => favorites.includes(r.id));
  }, [allRooms, favorites]);

  const toggleFavorite = (roomId) => {
    setFavorites(prev => {
      const next = prev.includes(roomId) ? prev.filter(id => id !== roomId) : [...prev, roomId];
      localStorage.setItem('campusreserve-favorites', JSON.stringify(next));
      return next;
    });
  };

  const cancelReservation = (resId) => {
    setReservations(prev => {
      const next = prev.map(r => r.id === resId ? { ...r, status: 'cancelled' } : r);
      localStorage.setItem('campusreserve-reservations', JSON.stringify(next));
      return next;
    });
  };

  const applyReschedule = (updated) => {
    setReservations(prev => {
      const next = prev.map(r => r.id === updated.id ? { ...r, ...updated } : r);
      localStorage.setItem('campusreserve-reservations', JSON.stringify(next));
      return next;
    });
  };

  const upcoming = reservations.filter(r => r.status === 'upcoming');
  const past = reservations.filter(r => r.status !== 'upcoming');

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-white">My Dashboard</h2>

      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="text-center stat-card">
            <Card.Body>
              <div className="stat-number text-primary">{upcoming.length}</div>
              <div className="text-muted">Upcoming</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center stat-card">
            <Card.Body>
              <div className="stat-number text-success">{reservations.filter(r => r.status === 'completed').length}</div>
              <div className="text-muted">Completed</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center stat-card">
            <Card.Body>
              <div className="stat-number text-danger">{favorites.length}</div>
              <div className="text-muted">Favorites</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="upcoming" className="mb-4">
        <Tab eventKey="upcoming" title={`Upcoming (${upcoming.length})`}>
          {upcoming.length === 0 ? (
            <Alert variant="light" className="text-center py-4">
              <p className="mb-2">No upcoming reservations.</p>
              <Link to="/browse" className="btn btn-primary btn-sm">Browse & Book a Room</Link>
            </Alert>
          ) : (
            upcoming.map(res => (
              <ReservationCard
                key={res.id}
                reservation={res}
                onCancel={cancelReservation}
                onReschedule={setRescheduling}
              />
            ))
          )}
        </Tab>

        <Tab eventKey="past" title={`Past & Cancelled (${past.length})`}>
          {past.length === 0 ? (
            <Alert variant="light" className="text-center py-4">
              <p className="mb-0">No past reservations yet.</p>
            </Alert>
          ) : (
            past.map(res => (
              <ReservationCard key={res.id} reservation={res} onCancel={cancelReservation} />
            ))
          )}
        </Tab>

        <Tab eventKey="favorites" title={`Favorites (${favoriteRooms.length})`}>
          {favoriteRooms.length === 0 ? (
            <Alert variant="light" className="text-center py-4">
              <p className="mb-2">No favorite rooms yet.</p>
              <p className="text-muted small mb-2">Heart a room while browsing to add it here for quick access.</p>
              <Link to="/browse" className="btn btn-outline-primary btn-sm">Browse Rooms</Link>
            </Alert>
          ) : (
            <Row className="g-3">
              {favoriteRooms.map(room => {
                const location = locations.find(l => l.id === room.locationId);
                return (
                  <Col lg={4} md={6} key={room.id}>
                    <RoomCard
                      room={room}
                      equipment={getEquipmentForRoom(room.id)}
                      isFavorite
                      onToggleFavorite={() => toggleFavorite(room.id)}
                      showLocation
                      locationName={location?.name}
                    />
                  </Col>
                );
              })}
            </Row>
          )}
        </Tab>
      </Tabs>

      <RescheduleModal
        show={!!rescheduling}
        reservation={rescheduling}
        onClose={() => setRescheduling(null)}
        onConfirm={applyReschedule}
      />
    </Container>
  );
}
