import { Badge } from 'react-bootstrap';

export default function EquipmentBadge({ name, selectable = false, selected = false, onClick }) {
  if (selectable) {
    const handleKey = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick?.();
      }
    };
    return (
      <Badge
        bg=""
        className={`equipment-badge selectable me-1 mb-1 ${selected ? 'bg-primary text-white' : 'badge-dark-subtle'}`}
        role="button"
        tabIndex={0}
        aria-pressed={selected}
        aria-label={`${selected ? 'Remove' : 'Add'} ${name} filter`}
        onClick={onClick}
        onKeyDown={handleKey}
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
