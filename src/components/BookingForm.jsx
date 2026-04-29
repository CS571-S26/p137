import { useEffect, useMemo, useState } from 'react';
import { Form, Button, Row, Col, ProgressBar, Alert } from 'react-bootstrap';
import { minutesToLabel } from '../utils/time';
import WeekBookingGrid from './WeekBookingGrid';
import { useUser } from '../contexts/UserContext';
import { findConflict } from '../data/bookings';

const STEPS = ['Date & Time', 'Your Info', 'Confirm'];

export default function BookingForm({ room, onSubmit }) {
  const { profile } = useUser();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    date: '',
    startTime: null,
    endTime: null,
    name: profile.name || '',
    email: profile.email || '',
    purpose: '',
    groupSize: '1',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      name: prev.name || profile.name || '',
      email: prev.email || profile.email || '',
    }));
  }, [profile.name, profile.email]);

  const conflict = useMemo(() => {
    if (!formData.date || formData.startTime == null || formData.endTime == null) return null;
    return findConflict(room.id, formData.date, formData.startTime, formData.endTime);
  }, [room.id, formData.date, formData.startTime, formData.endTime]);

  const update = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 0) {
      if (!formData.date || formData.startTime == null || formData.endTime == null) {
        newErrors.time = 'Please click and drag on the grid to pick a date and time';
      } else if (formData.endTime <= formData.startTime) {
        newErrors.time = 'Invalid time range';
      } else if (conflict) {
        newErrors.time = 'This time overlaps an existing reservation. Pick a different slot.';
      }
    }
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
      if (!formData.groupSize || parseInt(formData.groupSize) < 1) newErrors.groupSize = 'Enter a valid group size';
      if (parseInt(formData.groupSize) > room.capacity) newErrors.groupSize = `Max capacity is ${room.capacity}`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep(s => s + 1);
  };

  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = () => {
    if (conflict) {
      setStep(0);
      setErrors({ time: 'This time overlaps an existing reservation. Pick a different slot.' });
      return;
    }
    onSubmit(formData);
  };

  const progress = ((step + 1) / STEPS.length) * 100;
  const hasTime = formData.startTime != null && formData.endTime != null;
  const durationMin = hasTime ? formData.endTime - formData.startTime : 0;
  const durationH = Math.floor(durationMin / 60);
  const durationM = durationMin % 60;
  const durationStr = durationH > 0 && durationM > 0
    ? `${durationH}h ${durationM}m`
    : durationH > 0 ? `${durationH}h` : `${durationM}m`;

  return (
    <div className="booking-form">
      <div className="mb-3">
        <div className="d-flex justify-content-between mb-1">
          {STEPS.map((label, i) => (
            <small key={label} className={`${i <= step ? 'text-white fw-bold' : 'text-muted'}`}>
              {label}
            </small>
          ))}
        </div>
        <ProgressBar now={progress} variant="primary" style={{ height: '4px' }} />
      </div>

      {step === 0 && (
        <div>
          <h2 className="mb-3 text-white h5">Select Date & Time</h2>
          <p className="text-muted small mb-3">
            Drag across green cells to pick your booking window. Red is already booked; gray is past.
          </p>
          {errors.time && (
            <Alert variant="danger" className="py-2">
              <i className="bi bi-exclamation-triangle me-2" />
              {errors.time}
            </Alert>
          )}
          <WeekBookingGrid
            roomId={room.id}
            selectedDate={formData.date}
            startTime={formData.startTime}
            endTime={formData.endTime}
            onChange={(date, start, end) =>
              setFormData(prev => ({ ...prev, date, startTime: start, endTime: end }))
            }
          />
        </div>
      )}

      {step === 1 && (
        <div>
          <h2 className="mb-3 text-white h5">Your Information</h2>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group controlId="booking-name">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.name}
                  onChange={(e) => update('name', e.target.value)}
                  isInvalid={!!errors.name}
                  placeholder="Enter your name"
                  autoComplete="name"
                />
                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="booking-email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={formData.email}
                  onChange={(e) => update('email', e.target.value)}
                  isInvalid={!!errors.email}
                  placeholder="you@wisc.edu"
                  autoComplete="email"
                />
                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="booking-group-size">
                <Form.Label>Group Size</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  max={room.capacity}
                  value={formData.groupSize}
                  onChange={(e) => update('groupSize', e.target.value)}
                  isInvalid={!!errors.groupSize}
                />
                <Form.Control.Feedback type="invalid">{errors.groupSize}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="booking-purpose">
                <Form.Label>Purpose</Form.Label>
                <Form.Select value={formData.purpose} onChange={(e) => update('purpose', e.target.value)}>
                  <option value="">Select purpose...</option>
                  <option value="study">Study Session</option>
                  <option value="meeting">Group Meeting</option>
                  <option value="presentation">Presentation</option>
                  <option value="project">Project Work</option>
                  <option value="other">Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group controlId="booking-notes">
                <Form.Label>Notes (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => update('notes', e.target.value)}
                  placeholder="Any special requirements..."
                />
              </Form.Group>
            </Col>
          </Row>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="mb-3 text-white h5">Confirm Your Reservation</h2>
          {conflict && (
            <Alert variant="danger" className="py-2">
              A new conflicting booking was detected. Please go back and choose a different time.
            </Alert>
          )}
          <div className="dark-confirm-card rounded p-3">
            <Row>
              <Col md={6}>
                <p className="mb-1"><strong className="text-white">Room:</strong> {room.name}</p>
                <p className="mb-1"><strong className="text-white">Date:</strong> {formData.date}</p>
                <p className="mb-1"><strong className="text-white">Time:</strong> {hasTime ? `${minutesToLabel(formData.startTime)} \u2013 ${minutesToLabel(formData.endTime)}` : '\u2014'}</p>
                <p className="mb-1"><strong className="text-white">Duration:</strong> {durationStr}</p>
              </Col>
              <Col md={6}>
                <p className="mb-1"><strong className="text-white">Name:</strong> {formData.name}</p>
                <p className="mb-1"><strong className="text-white">Email:</strong> {formData.email}</p>
                <p className="mb-1"><strong className="text-white">Group Size:</strong> {formData.groupSize}</p>
                {formData.purpose && <p className="mb-1"><strong className="text-white">Purpose:</strong> {formData.purpose}</p>}
              </Col>
            </Row>
            {formData.notes && <p className="mt-2 mb-0"><strong className="text-white">Notes:</strong> {formData.notes}</p>}
          </div>
        </div>
      )}

      <div className="d-flex justify-content-between mt-4">
        {step > 0 ? (
          <Button variant="outline-secondary" onClick={handleBack}>Back</Button>
        ) : <div />}
        {step < STEPS.length - 1 ? (
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={step === 0 && !!conflict}
          >
            Continue
          </Button>
        ) : (
          <Button variant="success" onClick={handleSubmit} disabled={!!conflict}>
            Confirm Reservation
          </Button>
        )}
      </div>
    </div>
  );
}
