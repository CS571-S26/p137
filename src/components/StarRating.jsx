export default function StarRating({ rating, size = 'sm', interactive = false, onRate }) {
  const stars = [1, 2, 3, 4, 5];
  const fontSize = size === 'lg' ? '1.5rem' : size === 'md' ? '1.2rem' : '1rem';

  if (!interactive) {
    return (
      <span
        className="star-rating"
        style={{ fontSize }}
        role="img"
        aria-label={`Rated ${Math.round(rating)} out of 5`}
      >
        {stars.map(star => {
          const filled = star <= Math.round(rating);
          return (
            <i
              key={star}
              aria-hidden="true"
              className={`bi ${filled ? 'bi-star-fill star-filled' : 'bi-star star-empty'}`}
            />
          );
        })}
      </span>
    );
  }

  const handleKey = (star) => (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onRate?.(star);
    }
  };

  return (
    <span className="star-rating" style={{ fontSize }}>
      {stars.map(star => {
        const filled = star <= Math.round(rating);
        return (
          <i
            key={star}
            className={`bi ${filled ? 'bi-star-fill star-filled' : 'bi-star star-empty'} star-interactive`}
            onClick={() => onRate?.(star)}
            role="button"
            tabIndex={0}
            aria-label={`Rate ${star} out of 5`}
            aria-pressed={star === Math.round(rating)}
            onKeyDown={handleKey(star)}
          />
        );
      })}
    </span>
  );
}
