import { useMemo, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { getUserReservations } from '../data/bookings';

const YEARS = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate', 'Other'];

export default function ProfilePage() {
  const { profile, updateProfile, clearProfile, isSignedIn } = useUser();
  const [draft, setDraft] = useState(profile);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});

  const stats = useMemo(() => {
    const res = getUserReservations();
    const favs = (() => {
      try { return JSON.parse(localStorage.getItem('campusreserve-favorites')) || []; }
      catch { return []; }
    })();
    const reviews = (() => {
      try { return JSON.parse(localStorage.getItem('campusreserve-user-reviews')) || []; }
      catch { return []; }
    })();
    return {
      upcoming: res.filter(r => r.status === 'upcoming').length,
      total: res.length,
      favorites: favs.length,
      reviews: reviews.length,
    };
  }, []);

  const set = (key, value) => {
    setDraft(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
    setSaved(false);
  };

  const validate = () => {
    const e = {};
    if (!draft.name.trim()) e.name = 'Name is required';
    if (!draft.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) e.email = 'Invalid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validate()) return;
    updateProfile(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSignOut = () => {
    clearProfile();
    setDraft({ name: '', email: '', major: '', year: '' });
    setSaved(false);
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-white">My Profile</h2>

      <Row className="g-4">
        <Col lg={4}>
          <Card className="mb-3 shadow-sm">
            <Card.Body className="text-center">
              <div
                className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                style={{
                  width: 90,
                  height: 90,
                  background: 'linear-gradient(135deg, #0d6efd, #6610f2)',
                  fontSize: '2.2rem',
                  color: '#fff',
                  fontWeight: 700,
                }}
              >
                {profile.name ? profile.name.trim().charAt(0).toUpperCase() : '?'}
              </div>
              <h5 className="text-white mb-1">{profile.name || 'Guest User'}</h5>
              <small className="text-muted d-block mb-2">{profile.email || 'Not signed in'}</small>
              {isSignedIn ? (
                <Badge bg="success">Signed in</Badge>
              ) : (
                <Badge bg="secondary">Guest</Badge>
              )}
              {profile.major && (
                <p className="text-muted small mt-3 mb-0">
                  {profile.year ? `${profile.year} \u2022 ` : ''}{profile.major}
                </p>
              )}
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Body>
              <h6 className="text-white mb-3">Activity</h6>
              <Row className="g-2 text-center">
                <Col xs={6}>
                  <div className="stat-number" style={{ fontSize: '1.6rem' }}>{stats.upcoming}</div>
                  <small className="text-muted">Upcoming</small>
                </Col>
                <Col xs={6}>
                  <div className="stat-number" style={{ fontSize: '1.6rem' }}>{stats.total}</div>
                  <small className="text-muted">Total Bookings</small>
                </Col>
                <Col xs={6}>
                  <div className="stat-number" style={{ fontSize: '1.6rem' }}>{stats.favorites}</div>
                  <small className="text-muted">Favorites</small>
                </Col>
                <Col xs={6}>
                  <div className="stat-number" style={{ fontSize: '1.6rem' }}>{stats.reviews}</div>
                  <small className="text-muted">Reviews</small>
                </Col>
              </Row>
              <div className="d-grid gap-2 mt-3">
                <Link to="/dashboard" className="btn btn-outline-primary btn-sm">Go to Dashboard</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 text-white">Profile Details</h5>
                {isSignedIn && (
                  <Button variant="outline-danger" size="sm" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                )}
              </div>

              {saved && <Alert variant="success" className="py-2">Profile saved.</Alert>}
              {!isSignedIn && (
                <Alert variant="info" className="py-2">
                  Fill in your name and email to auto-fill the booking form next time.
                </Alert>
              )}

              <Form onSubmit={handleSave}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        value={draft.name}
                        onChange={(e) => set('name', e.target.value)}
                        isInvalid={!!errors.name}
                        placeholder="e.g., Bucky Badger"
                      />
                      <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={draft.email}
                        onChange={(e) => set('email', e.target.value)}
                        isInvalid={!!errors.email}
                        placeholder="you@wisc.edu"
                      />
                      <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Major</Form.Label>
                      <Form.Control
                        value={draft.major}
                        onChange={(e) => set('major', e.target.value)}
                        placeholder="e.g., Computer Science"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Year</Form.Label>
                      <Form.Select
                        value={draft.year}
                        onChange={(e) => set('year', e.target.value)}
                      >
                        <option value="">Select...</option>
                        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <Button
                    variant="outline-secondary"
                    type="button"
                    onClick={() => { setDraft(profile); setErrors({}); setSaved(false); }}
                  >
                    Reset
                  </Button>
                  <Button variant="primary" type="submit">Save Changes</Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
