import { Button } from 'react-bootstrap';

export default function FavoriteButton({ isFavorite, onToggle, size = 'sm' }) {
  return (
    <Button
      variant={isFavorite ? 'danger' : 'outline-danger'}
      size={size}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      className="favorite-btn"
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <i className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}`} />
    </Button>
  );
}
