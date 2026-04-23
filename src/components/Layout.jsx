import { NavLink, Outlet } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { useUser } from '../contexts/UserContext';

export default function Layout() {
  const { profile, isSignedIn } = useUser();
  const initial = profile.name ? profile.name.trim().charAt(0).toUpperCase() : '?';

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar expand="md" sticky="top" data-bs-theme="dark">
        <Container>
          <Navbar.Brand as={NavLink} to="/" className="fw-bold">
            <i className="bi bi-building me-2 text-danger" />CampusReserve
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
              <Nav.Link as={NavLink} to="/browse">Browse</Nav.Link>
              <Nav.Link as={NavLink} to="/dashboard">My Dashboard</Nav.Link>
            </Nav>
            <Nav className="align-items-md-center">
              <Nav.Link as={NavLink} to="/browse" className="text-light">
                <i className="bi bi-search me-1" />Search
              </Nav.Link>
              <Nav.Link as={NavLink} to="/profile" className="d-flex align-items-center text-light">
                <span
                  className="rounded-circle d-inline-flex align-items-center justify-content-center me-2"
                  style={{
                    width: 28,
                    height: 28,
                    background: isSignedIn ? 'linear-gradient(135deg, #0d6efd, #6610f2)' : '#333',
                    color: '#fff',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}
                >
                  {initial}
                </span>
                <span>{isSignedIn ? profile.name.split(' ')[0] : 'Sign In'}</span>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="flex-grow-1">
        <Outlet />
      </main>

      <footer className="site-footer text-white-50 text-center py-3 mt-auto">
        <Container>
          <small>CampusReserve &mdash; UW-Madison Campus Resource Booking</small>
        </Container>
      </footer>
    </div>
  );
}
