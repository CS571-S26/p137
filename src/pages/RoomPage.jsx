import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Badge, Breadcrumb, Button } from 'react-bootstrap';
import { useState } from 'react';
import { getRoomById, getLocationById, getEquipmentForRoom, getReviewsForRoom } from '../data/campusData';
import StarRating from '../components/StarRating';
import FavoriteButton from '../components/FavoriteButton';
import EquipmentBadge from '../components/EquipmentBadge';
import ReviewSection from '../components/ReviewSection';
import AvailabilityHeatmap from '../components/AvailabilityHeatmap';

const USER_REVIEWS_KEY = 'campusreserve-user-reviews';

function loadUserReviews() {
  try { return JSON.parse(localStorage.getItem(USER_REVIEWS_KEY)) || []; }
  catch { return []; }
}

function saveUserReviews(reviews) {
  localStorage.setItem(USER_REVIEWS_KEY, JSON.stringify(reviews));
}

export default function RoomPage() {
  const { id } = useParams();
  const room = getRoomById(id);
  const location = room ? getLocationById(room.locationId) : null;
  const equipment = room ? getEquipmentForRoom(room.id) : [];

  const [userReviews, setUserReviews] = useState(() =>
    loadUserReviews().filter(r => r.roomId === id)
  );
  const seedReviews = room ? getReviewsForRoom(room.id) : [];
  const reviews = [...userReviews, ...seedReviews];

  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('campusreserve-favorites')) || []; }
    catch { return []; }
  });

  const toggleFavorite = () => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id];
      localStorage.setItem('campusreserve-favorites', JSON.stringify(next));
      return next;
    });
  };

  const handleAddReview = (review) => {
    setUserReviews(prev => [review, ...prev]);
    const all = loadUserReviews();
    saveUserReviews([review, ...all]);
  };

  if (!room || !location) {
    return (
      <Container className="py-5 text-center">
        <h1>Room not found</h1>
        <Link to="/browse">Back to Browse</Link>
      </Container>
    );
  }

  const typeColor = { 'Study Room': 'info', 'Conference Room': 'primary', 'Collaboration Space': 'success' };

  return (
    <Container className="py-4">
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>Home</Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/browse' }}>Browse</Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/location/${location.id}` }}>{location.name}</Breadcrumb.Item>
        <Breadcrumb.Item active>{room.name}</Breadcrumb.Item>
      </Breadcrumb>

      <Row className="mb-4">
        <Col md={7}>
          <img src={room.image} alt={room.name} className="w-100 rounded shadow-sm" style={{ height: '320px', objectFit: 'cover' }} />
        </Col>
        <Col md={5}>
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div>
              <Badge bg={typeColor[room.type] || 'secondary'} className="mb-2">{room.type}</Badge>
              <h1 className="mb-1 text-white h2">{room.name}</h1>
            </div>
            <FavoriteButton isFavorite={favorites.includes(id)} onToggle={toggleFavorite} size="md" />
          </div>
          <p className="text-muted mb-1">{location.name} &bull; Floor {room.floor}</p>
          <div className="d-flex align-items-center gap-2 mb-3">
            <StarRating rating={room.rating} size="md" />
            <span className="text-muted">({room.reviewCount} reviews)</span>
          </div>
          <p>{room.description}</p>

          <div className="dark-info-box mb-3">
            <Row>
              <Col xs={6}>
                <small className="text-muted">Capacity</small>
                <div className="fw-bold text-white">{room.capacity} people</div>
              </Col>
              <Col xs={6}>
                <small className="text-muted">Available Slots</small>
                <div className="fw-bold text-white">{room.availableSlots.length} today</div>
              </Col>
            </Row>
          </div>

          <Link to={`/book/${room.id}`}>
            <Button variant="primary" size="lg" className="w-100">Reserve This Room</Button>
          </Link>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <h2 className="text-white h5">Amenities</h2>
          <div className="d-flex flex-wrap gap-2 mb-3">
            {room.amenities.map(a => (
              <span key={a} className="badge badge-dark-subtle px-3 py-2">
                {a}
              </span>
            ))}
          </div>
        </Col>
        <Col md={6}>
          <h2 className="text-white h5">Available Equipment</h2>
          {equipment.length === 0 ? (
            <p className="text-muted small">No reservable equipment for this room.</p>
          ) : (
            <div className="d-flex flex-wrap gap-2 mb-3">
              {equipment.map(eq => <EquipmentBadge key={eq.id} name={eq.name} />)}
            </div>
          )}
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h2 className="text-white mb-0 h5">Availability</h2>
            <Link to={`/book/${room.id}`} className="btn btn-primary btn-sm">
              Reserve a Time Slot
            </Link>
          </div>
          <p className="text-muted small mb-2">
            Hover any cell for details. Pick a green hour to avoid conflicts during booking.
          </p>
          <AvailabilityHeatmap roomId={room.id} />
        </Col>
      </Row>

      <hr />

      <ReviewSection reviews={reviews} roomId={room.id} onAddReview={handleAddReview} />
    </Container>
  );
}
