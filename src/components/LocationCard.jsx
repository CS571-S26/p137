import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function LocationCard({ location }) {
  const typeColor = {
    Library: 'success',
    Union: 'primary',
    'Academic Building': 'warning',
  };

  return (
    <Card className="location-card h-100 shadow-sm">
      <div className="card-img-wrapper">
        <Card.Img variant="top" src={location.image} alt={location.name} loading="lazy" />
        <Badge bg={typeColor[location.type] || 'secondary'} className="location-type-badge">
          {location.type}
        </Badge>
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title>{location.name}</Card.Title>
        <Card.Text className="text-muted small flex-grow-1">{location.description}</Card.Text>
        <div className="d-flex justify-content-between align-items-center mt-2">
          <small className="text-muted">{location.roomCount} rooms available</small>
          <Link to={`/location/${location.id}`} className="btn btn-outline-primary btn-sm">
            Explore &rarr;
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
}
