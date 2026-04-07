import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import FavoriteButton from './FavoriteButton';
import EquipmentBadge from './EquipmentBadge';

export default function RoomCard({ room, equipment = [], isFavorite, onToggleFavorite, showLocation, locationName, selectable, selected, onSelect }) {
  const typeColor = {
    'Study Room': 'info',
    'Conference Room': 'primary',
    'Collaboration Space': 'success',
  };

  return (
    <Card className={`room-card h-100 ${selected ? 'border-primary border-2' : ''}`}>
      <div className="card-img-wrapper">
        <Card.Img variant="top" src={room.image} alt={room.name} loading="lazy" />
        <Badge bg={typeColor[room.type] || 'secondary'} className="location-type-badge">
          {room.type}
        </Badge>
        {onToggleFavorite && (
          <div className="favorite-overlay">
            <FavoriteButton isFavorite={isFavorite} onToggle={onToggleFavorite} />
          </div>
        )}
      </div>
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start">
          <Card.Title className="h6 mb-1">{room.name}</Card.Title>
          {selectable && (
            <input
              type="checkbox"
              checked={selected}
              onChange={() => onSelect?.(room.id)}
              className="form-check-input"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
        {showLocation && <small className="text-muted mb-1">{locationName}</small>}
        <div className="d-flex align-items-center gap-2 mb-2">
          <StarRating rating={room.rating} />
          <small className="text-muted">({room.reviewCount})</small>
        </div>
        <div className="d-flex gap-2 mb-2 flex-wrap">
          <span className="badge badge-dark-subtle">
            <i className="bi bi-people me-1" />{room.capacity} people
          </span>
          <span className="badge badge-dark-subtle">
            Floor {room.floor}
          </span>
        </div>
        {equipment.length > 0 && (
          <div className="mb-2">
            {equipment.slice(0, 3).map(eq => (
              <EquipmentBadge key={eq.id} name={eq.name} />
            ))}
            {equipment.length > 3 && (
              <span className="badge badge-dark-subtle me-1 mb-1">
                +{equipment.length - 3} more
              </span>
            )}
          </div>
        )}
        <div className="mt-auto d-flex gap-2">
          <Link to={`/room/${room.id}`} className="btn btn-outline-primary btn-sm flex-grow-1">
            View Details
          </Link>
          <Link to={`/book/${room.id}`} className="btn btn-primary btn-sm">
            Book
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
}
