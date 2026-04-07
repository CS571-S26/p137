export default function StarRating({ rating, size = 'sm', interactive = false, onRate }) {
  const stars = [1, 2, 3, 4, 5];
  const fontSize = size === 'lg' ? '1.5rem' : size === 'md' ? '1.2rem' : '1rem';

  return (
    <span className="star-rating" style={{ fontSize }}>
      {stars.map(star => {
        const filled = star <= Math.round(rating);
        return (
          <i
            key={star}
            className={`bi ${filled ? 'bi-star-fill star-filled' : 'bi-star star-empty'} ${interactive ? 'star-interactive' : ''}`}
            onClick={() => interactive && onRate?.(star)}
            role={interactive ? 'button' : undefined}
            tabIndex={interactive ? 0 : undefined}
            onKeyDown={(e) => interactive && e.key === 'Enter' && onRate?.(star)}
          />
        );
      })}
    </span>
  );
}
