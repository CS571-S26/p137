import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <Container className="py-5 text-center">
      <div style={{ fontSize: '5rem' }} className="mb-3"><i className="bi bi-exclamation-triangle" /></div>
      <h2>404 - Page Not Found</h2>
      <p className="text-muted mb-4">The page you're looking for doesn't exist or has been moved.</p>
      <div className="d-flex gap-3 justify-content-center">
        <Link to="/"><Button variant="primary">Go Home</Button></Link>
        <Link to="/browse"><Button variant="outline-secondary">Browse Rooms</Button></Link>
      </div>
    </Container>
  );
}
