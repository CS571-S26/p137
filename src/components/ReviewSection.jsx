import { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import StarRating from './StarRating';

function ReviewCard({ review }) {
  return (
    <div className="review-card-dark mb-2 py-2">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <div>
          <strong className="me-2 text-white">{review.author}</strong>
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
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || !text.trim() || !author.trim()) return;
    onAddReview({
      id: `r-new-${Date.now()}`,
      roomId,
      author: author.trim(),
      rating,
      date: new Date().toISOString().split('T')[0],
      text: text.trim(),
    });
    setRating(0);
    setText('');
    setAuthor('');
    setShowForm(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="review-section">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0 text-white">Reviews ({reviews.length})</h5>
        <Button
          variant={showForm ? 'outline-secondary' : 'outline-primary'}
          size="sm"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Write a Review'}
        </Button>
      </div>

      {submitted && <Alert variant="success" className="py-2">Review added.</Alert>}

      {showForm && (
        <Card className="mb-3 review-form-dark">
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-2">
                <Form.Label className="small">Your Name</Form.Label>
                <Form.Control
                  size="sm"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g., Alex M."
                  required
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="small">Rating</Form.Label>
                <div>
                  <StarRating rating={rating} size="lg" interactive onRate={setRating} />
                  {rating === 0 && <small className="text-muted ms-2">Click to rate</small>}
                </div>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="small">Your Review</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  size="sm"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Share a tip or your experience..."
                  required
                />
              </Form.Group>
              <Button type="submit" size="sm" variant="primary" disabled={rating === 0}>
                Submit Review
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      {reviews.length === 0 ? (
        <p className="text-muted">No reviews yet. Be the first to review!</p>
      ) : (
        reviews.map(review => <ReviewCard key={review.id} review={review} />)
      )}
    </div>
  );
}
