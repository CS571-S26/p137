import { useState } from 'react';
import { Form, Button, Row, Col, ProgressBar } from 'react-bootstrap';
import TimeRangeSlider, { minutesToLabel } from './TimeRangeSlider';

const STEPS = ['Date & Time', 'Your Info', 'Confirm'];

export default function BookingForm({ room, onSubmit }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    date: '',
    startTime: 540,
    endTime: 600,
    name: '',
    email: '',
    purpose: '',
    groupSize: '1',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  const update = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 0) {
      if (!formData.date) newErrors.date = 'Please select a date';
      const today = new Date().toISOString().split('T')[0];
      if (formData.date && formData.date < today) newErrors.date = 'Date cannot be in the past';
      if (formData.endTime <= formData.startTime) newErrors.time = 'Invalid time range';
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
    onSubmit(formData);
  };

  const progress = ((step + 1) / STEPS.length) * 100;
  const durationMin = formData.endTime - formData.startTime;
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
          <h5 className="mb-3 text-white">Select Date & Time</h5>
          <Row className="g-3">
            <Col xs={12}>
              <Form.Group>
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.date}
                  onChange={(e) => update('date', e.target.value)}
                  isInvalid={!!errors.date}
                />
                <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group>
                <Form.Label>Time Range</Form.Label>
                {errors.time && <div className="text-danger small mb-1">{errors.time}</div>}
                <TimeRangeSlider
                  startTime={formData.startTime}
                  endTime={formData.endTime}
                  onChange={(s, e) => setFormData(prev => ({ ...prev, startTime: s, endTime: e }))}
                />
              </Form.Group>
            </Col>
          </Row>
        </div>
      )}

      {step === 1 && (
        <div>
          <h5 className="mb-3 text-white">Your Information</h5>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.name}
                  onChange={(e) => update('name', e.target.value)}
                  isInvalid={!!errors.name}
                  placeholder="Enter your name"
                />
                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={formData.email}
                  onChange={(e) => update('email', e.target.value)}
                  isInvalid={!!errors.email}
                  placeholder="you@wisc.edu"
                />
                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
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
              <Form.Group>
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
              <Form.Group>
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
          <h5 className="mb-3 text-white">Confirm Your Reservation</h5>
          <div className="dark-confirm-card rounded p-3">
            <Row>
              <Col md={6}>
                <p className="mb-1"><strong className="text-white">Room:</strong> {room.name}</p>
                <p className="mb-1"><strong className="text-white">Date:</strong> {formData.date}</p>
                <p className="mb-1"><strong className="text-white">Time:</strong> {minutesToLabel(formData.startTime)} &ndash; {minutesToLabel(formData.endTime)}</p>
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
          <Button variant="primary" onClick={handleNext}>Continue</Button>
        ) : (
          <Button variant="success" onClick={handleSubmit}>Confirm Reservation</Button>
        )}
      </div>
    </div>
  );
}
