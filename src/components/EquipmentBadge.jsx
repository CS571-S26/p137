import { Badge } from 'react-bootstrap';

export default function EquipmentBadge({ name, selectable = false, selected = false, onClick }) {
  if (selectable) {
    return (
      <Badge
        bg=""
        className={`equipment-badge selectable me-1 mb-1 ${selected ? 'bg-primary text-white' : 'badge-dark-subtle'}`}
        role="button"
        onClick={onClick}
        style={{ cursor: 'pointer' }}
      >
        {name}
      </Badge>
    );
  }

  return (
    <Badge bg="" className="equipment-badge badge-dark-subtle me-1 mb-1">
      {name}
    </Badge>
  );
}
