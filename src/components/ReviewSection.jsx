import { useState } from 'react';
import { Button, Alert, Badge } from 'react-bootstrap';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';

function ReviewCard({ review }) {
  return (
    <div className="review-card-dark mb-2 py-2">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <div>
          <strong className="me-2 text-white">{review.author}</strong>
          {review.userGenerated && (
            <Badge bg="primary" pill className="me-2" style={{ fontSize: '0.65rem' }}>You</Badge>
          )}
          <StarRating rating={review.rating} />
        </div>
        <small className="text-muted">{review.date}</small>
      </div>
      <p className="mb-0 small text-muted">{review.text}</p>
    </div>
  );
}

export default function ReviewSection({ reviews, roomId, onAddReview }) {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (review) => {
    onAddReview(review);
    setShowForm(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="review-section">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0 text-white h5">Reviews ({reviews.length})</h2>
        <Button
          variant={showForm ? 'outline-secondary' : 'outline-primary'}
          size="sm"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Write a Review'}
        </Button>
      </div>

      {submitted && <Alert variant="success" className="py-2">Thanks! Your review was posted.</Alert>}

      {showForm && (
        <ReviewForm
          roomId={roomId}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      {reviews.length === 0 ? (
        <p className="text-muted">No reviews yet. Be the first to review!</p>
      ) : (
        reviews.map(review => <ReviewCard key={review.id} review={review} />)
      )}
    </div>
  );
}
