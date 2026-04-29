import { Form, Row, Col, InputGroup, Button, Collapse } from 'react-bootstrap';
import { useState } from 'react';
import EquipmentBadge from './EquipmentBadge';

export default function SearchFilter({ filters, onChange, locations, equipmentList, roomTypes }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const update = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  const toggleEquipment = (eqId) => {
    const current = filters.equipment || [];
    const next = current.includes(eqId)
      ? current.filter(id => id !== eqId)
      : [...current, eqId];
    update('equipment', next);
  };

  const clearFilters = () => {
    onChange({
      search: '',
      location: '',
      roomType: '',
      minCapacity: '',
      timeSlot: '',
      equipment: [],
    });
  };

  const hasActiveFilters = filters.location || filters.roomType || filters.minCapacity ||
    filters.timeSlot || (filters.equipment && filters.equipment.length > 0);

  return (
    <div className="search-filter-panel rounded p-3 mb-4">
      <Row className="g-2 align-items-end">
        <Col md={5}>
          <InputGroup>
            <InputGroup.Text id="search-icon" aria-hidden="true">
              <i className="bi bi-search" />
            </InputGroup.Text>
            <Form.Control
              type="search"
              placeholder="Search rooms or buildings..."
              aria-label="Search rooms or buildings"
              value={filters.search}
              onChange={(e) => update('search', e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select
            value={filters.location}
            onChange={(e) => update('location', e.target.value)}
            aria-label="Filter by location"
          >
            <option value="">All Locations</option>
            {locations.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Select
            value={filters.roomType}
            onChange={(e) => update('roomType', e.target.value)}
            aria-label="Filter by room type"
          >
            <option value="">All Types</option>
            {roomTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={2} className="d-flex gap-1">
          <Button
            variant="outline-secondary"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex-grow-1"
            size="sm"
          >
            {showAdvanced ? 'Less' : 'More'} Filters
          </Button>
          {hasActiveFilters && (
            <Button variant="outline-danger" onClick={clearFilters} size="sm">
              Clear
            </Button>
          )}
        </Col>
      </Row>

      <Collapse in={showAdvanced}>
        <div className="mt-3">
          <Row className="g-2 align-items-end">
            <Col md={3}>
              <Form.Group controlId="filter-min-capacity">
                <Form.Label className="small text-muted mb-1">Min Capacity</Form.Label>
                <Form.Select value={filters.minCapacity} onChange={(e) => update('minCapacity', e.target.value)}>
                  <option value="">Any</option>
                  <option value="2">2+</option>
                  <option value="4">4+</option>
                  <option value="6">6+</option>
                  <option value="8">8+</option>
                  <option value="10">10+</option>
                  <option value="15">15+</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="filter-time-slot">
                <Form.Label className="small text-muted mb-1">Available At</Form.Label>
                <Form.Select value={filters.timeSlot} onChange={(e) => update('timeSlot', e.target.value)}>
                  <option value="">Any Time</option>
                  {['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
                    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
                    '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'].map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <div className="small text-muted mb-1" id="filter-equipment-label">Equipment</div>
              <div role="group" aria-labelledby="filter-equipment-label">
                {equipmentList.map(eq => (
                  <EquipmentBadge
                    key={eq.id}
                    name={eq.name}
                    selectable
                    selected={(filters.equipment || []).includes(eq.id)}
                    onClick={() => toggleEquipment(eq.id)}
                  />
                ))}
              </div>
            </Col>
          </Row>
        </div>
      </Collapse>
    </div>
  );
}
