import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getLocations, getAllRooms } from '../data/campusData';
import LocationCard from '../components/LocationCard';

export default function HomePage() {
  const locations = getLocations();
  const rooms = getAllRooms();
  const featuredLocations = locations.slice(0, 3);

  const stats = {
    locations: locations.length,
    rooms: rooms.length,
    avgRating: (rooms.reduce((sum, r) => sum + r.rating, 0) / rooms.length).toFixed(1),
  };

  return (
    <div className="home-page">
      <section className="hero-section text-white text-center">
        <Container>
          <h1 className="display-4 fw-bold mb-3">CampusReserve</h1>
          <p className="lead mb-4" style={{ maxWidth: '640px', margin: '0 auto', color: '#999' }}>
            Find and reserve the perfect study room, conference space, or collaboration hub across UW-Madison campus.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/browse" className="btn btn-light btn-lg px-4">
              Browse Rooms
            </Link>
            <Link to="/dashboard" className="btn btn-outline-light btn-lg px-4">
              My Reservations
            </Link>
          </div>
        </Container>
      </section>

      <section className="py-4">
        <Container>
          <Row className="g-4 text-center">
            <Col md={4}>
              <Card className="h-100 stat-card">
                <Card.Body>
                  <div className="stat-number">{stats.locations}</div>
                  <div className="text-muted">Campus Locations</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 stat-card">
                <Card.Body>
                  <div className="stat-number">{stats.rooms}</div>
                  <div className="text-muted">Reservable Rooms</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 stat-card">
                <Card.Body>
                  <div className="stat-number">{stats.avgRating} <i className="bi bi-star-fill" /></div>
                  <div className="text-muted">Average Rating</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-4">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0 text-white">Featured Locations</h2>
            <Link to="/browse" className="btn btn-outline-primary">View All</Link>
          </div>
          <Row className="g-4">
            {featuredLocations.map(loc => (
              <Col md={4} key={loc.id}>
                <LocationCard location={loc} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="how-it-works-section py-4">
        <Container>
          <h2 className="text-center mb-4 text-white">How It Works</h2>
          <Row className="g-4">
            <Col md={4}>
              <Card className="h-100 text-center p-3">
                <Card.Body>
                  <div className="step-icon mb-3"><i className="bi bi-search" /></div>
                  <h5 className="text-white">1. Browse & Search</h5>
                  <p className="text-muted small">Explore campus locations, filter by building type, room capacity, and available equipment.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 text-center p-3">
                <Card.Body>
                  <div className="step-icon mb-3"><i className="bi bi-calendar-check" /></div>
                  <h5 className="text-white">2. Select & Reserve</h5>
                  <p className="text-muted small">Pick your date, time slot, and any equipment you need. Complete the booking in seconds.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 text-center p-3">
                <Card.Body>
                  <div className="step-icon mb-3"><i className="bi bi-check-circle" /></div>
                  <h5 className="text-white">3. Show Up & Study</h5>
                  <p className="text-muted small">Manage your reservations from your dashboard. Cancel or modify anytime before your slot.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-5 text-center">
        <Container>
          <h2 className="mb-3 text-white">Ready to find your spot?</h2>
          <p className="text-muted mb-4">Compare rooms side by side, read reviews from fellow Badgers, and book your ideal space.</p>
          <Link to="/browse">
            <Button variant="primary" size="lg">Start Browsing</Button>
          </Link>
        </Container>
      </section>
    </div>
  );
}
