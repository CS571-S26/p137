import { Table, Badge, Button } from 'react-bootstrap';
import StarRating from './StarRating';
import { Link } from 'react-router-dom';

export default function RoomComparison({ rooms, equipmentMap, locationMap, onRemove }) {
  if (rooms.length === 0) {
    return <p className="text-muted text-center py-4">Select rooms from the browse page to compare them side by side.</p>;
  }

  return (
    <div className="table-responsive">
      <Table bordered className="comparison-table align-middle">
        <thead>
          <tr>
            <th style={{ width: '160px' }}>Feature</th>
            {rooms.map(room => (
              <th key={room.id} className="text-center">
                <div className="mb-1">{room.name}</div>
                <Button variant="outline-danger" size="sm" className="py-0 px-1" onClick={() => onRemove(room.id)}>
                  Remove
                </Button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Location</strong></td>
            {rooms.map(room => (
              <td key={room.id} className="text-center">{locationMap[room.locationId] || '\u2014'}</td>
            ))}
          </tr>
          <tr>
            <td><strong>Type</strong></td>
            {rooms.map(room => (
              <td key={room.id} className="text-center">
                <Badge bg="info">{room.type}</Badge>
              </td>
            ))}
          </tr>
          <tr>
            <td><strong>Capacity</strong></td>
            {rooms.map(room => (
              <td key={room.id} className="text-center">{room.capacity} people</td>
            ))}
          </tr>
          <tr>
            <td><strong>Floor</strong></td>
            {rooms.map(room => (
              <td key={room.id} className="text-center">{room.floor}</td>
            ))}
          </tr>
          <tr>
            <td><strong>Rating</strong></td>
            {rooms.map(room => (
              <td key={room.id} className="text-center">
                <StarRating rating={room.rating} />
                <small className="text-muted d-block">({room.reviewCount} reviews)</small>
              </td>
            ))}
          </tr>
          <tr>
            <td><strong>Amenities</strong></td>
            {rooms.map(room => (
              <td key={room.id} className="text-center">
                {room.amenities.map(a => (
                  <span key={a} className="badge badge-dark-subtle me-1 mb-1">{a}</span>
                ))}
              </td>
            ))}
          </tr>
          <tr>
            <td><strong>Equipment</strong></td>
            {rooms.map(room => {
              const eq = equipmentMap[room.id] || [];
              return (
                <td key={room.id} className="text-center">
                  {eq.length === 0 ? <span className="text-muted">None</span> : eq.map(e => (
                    <span key={e.id} className="badge badge-dark-subtle me-1 mb-1">{e.name}</span>
                  ))}
                </td>
              );
            })}
          </tr>
          <tr>
            <td><strong>Available Slots</strong></td>
            {rooms.map(room => (
              <td key={room.id} className="text-center">
                <small>{room.availableSlots.length} slots</small>
              </td>
            ))}
          </tr>
          <tr>
            <td><strong>Actions</strong></td>
            {rooms.map(room => (
              <td key={room.id} className="text-center">
                <div className="d-flex flex-column gap-1 align-items-center">
                  <Link to={`/room/${room.id}`} className="btn btn-outline-primary btn-sm w-100">
                    Details
                  </Link>
                  <Link to={`/book/${room.id}`} className="btn btn-primary btn-sm w-100">
                    Book
                  </Link>
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
