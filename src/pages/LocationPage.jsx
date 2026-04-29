import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Badge, Breadcrumb } from 'react-bootstrap';
import { getLocationById, getRoomsByLocation, getEquipmentForRoom } from '../data/campusData';
import RoomCard from '../components/RoomCard';
import { useState } from 'react';

export default function LocationPage() {
  const { id } = useParams();
  const location = getLocationById(id);
  const rooms = getRoomsByLocation(id);

  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('campusreserve-favorites')) || []; }
    catch { return []; }
  });

  const toggleFavorite = (roomId) => {
    setFavorites(prev => {
      const next = prev.includes(roomId) ? prev.filter(rid => rid !== roomId) : [...prev, roomId];
      localStorage.setItem('campusreserve-favorites', JSON.stringify(next));
      return next;
    });
  };

  if (!location) {
    return (
      <Container className="py-5 text-center">
        <h1>Location not found</h1>
        <Link to="/browse">Back to Browse</Link>
      </Container>
    );
  }

  const typeColor = { Library: 'success', Union: 'primary', 'Academic Building': 'warning' };

  return (
    <Container className="py-4">
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>Home</Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/browse' }}>Browse</Breadcrumb.Item>
        <Breadcrumb.Item active>{location.name}</Breadcrumb.Item>
      </Breadcrumb>

      <div className="location-hero mb-4 rounded overflow-hidden position-relative">
        <img src={location.image} alt={location.name} className="w-100" style={{ height: '280px', objectFit: 'cover' }} />
        <div className="location-hero-overlay">
          <Badge bg={typeColor[location.type] || 'secondary'} className="mb-2">{location.type}</Badge>
          <h1 className="text-white mb-1">{location.name}</h1>
          <p className="text-white-50 mb-0">{location.address}</p>
        </div>
      </div>

      <Row className="mb-4">
        <Col md={8}>
          <p>{location.description}</p>
        </Col>
        <Col md={4}>
          <div className="dark-info-box">
            <h2 className="text-white h6">Hours</h2>
            <small className="text-muted">{location.hours}</small>
          </div>
        </Col>
      </Row>

      <h2 className="mb-3 text-white h3">Rooms in {location.name} ({rooms.length})</h2>
      <Row className="g-3">
        {rooms.map(room => (
          <Col lg={4} md={6} key={room.id}>
            <RoomCard
              room={room}
              equipment={getEquipmentForRoom(room.id)}
              isFavorite={favorites.includes(room.id)}
              onToggleFavorite={() => toggleFavorite(room.id)}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
