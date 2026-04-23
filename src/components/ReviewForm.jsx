import { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import StarRating from './StarRating';
import { useUser } from '../contexts/UserContext';

export default function ReviewForm({ roomId, onSubmit, onCancel }) {
  const { profile } = useUser();
  const [author, setAuthor] = useState(profile.name || '');
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [touched, setTouched] = useState(false);

  const canSubmit = rating > 0 && text.trim().length >= 5 && author.trim().length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit) return;
    onSubmit({
      id: `r-user-${Date.now()}`,
      roomId,
      author: author.trim(),
      rating,
      date: new Date().toISOString().split('T')[0],
      text: text.trim(),
      userGenerated: true,
    });
    setAuthor(profile.name || '');
    setRating(0);
    setText('');
    setTouched(false);
  };

  return (
    <Card className="mb-3 review-form-dark">
      <Card.Body>
        <h6 className="mb-3 text-white">Share your experience</h6>
        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="mb-2">
            <Form.Label className="small">Your Name</Form.Label>
            <Form.Control
              size="sm"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g., Alex M."
              isInvalid={touched && !author.trim()}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label className="small">Rating</Form.Label>
            <div>
              <StarRating rating={rating} size="lg" interactive onRate={setRating} />
              {rating === 0 && <small className="text-muted ms-2">Click a star to rate</small>}
              {touched && rating === 0 && (
                <small className="text-danger ms-2">Required</small>
              )}
            </div>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="small">Your Review</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              size="sm"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share a tip or your experience (at least 5 characters)..."
              isInvalid={touched && text.trim().length < 5}
            />
          </Form.Group>
          <div className="d-flex gap-2 justify-content-end">
            {onCancel && (
              <Button type="button" size="sm" variant="outline-secondary" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" size="sm" variant="primary" disabled={!canSubmit}>
              Submit Review
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
