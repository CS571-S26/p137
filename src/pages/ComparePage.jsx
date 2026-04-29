import { useSearchParams, Link } from 'react-router-dom';
import { Container, Breadcrumb, Alert } from 'react-bootstrap';
import { useMemo } from 'react';
import { getRoomById, getLocationById, getEquipmentForRoom } from '../data/campusData';
import RoomComparison from '../components/RoomComparison';

export default function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const roomIds = (searchParams.get('rooms') || '').split(',').filter(Boolean);

  const rooms = useMemo(() => roomIds.map(getRoomById).filter(Boolean), [roomIds]);

  const equipmentMap = useMemo(() => {
    const map = {};
    rooms.forEach(r => { map[r.id] = getEquipmentForRoom(r.id); });
    return map;
  }, [rooms]);

  const locationMap = useMemo(() => {
    const map = {};
    rooms.forEach(r => {
      const loc = getLocationById(r.locationId);
      if (loc) map[r.locationId] = loc.name;
    });
    return map;
  }, [rooms]);

  const removeRoom = (roomId) => {
    const next = roomIds.filter(id => id !== roomId);
    if (next.length === 0) {
      setSearchParams({});
    } else {
      setSearchParams({ rooms: next.join(',') });
    }
  };

  return (
    <Container className="py-4">
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>Home</Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/browse' }}>Browse</Breadcrumb.Item>
        <Breadcrumb.Item active>Compare</Breadcrumb.Item>
      </Breadcrumb>

      <h1 className="mb-4 text-white h2">Compare Rooms</h1>

      {rooms.length === 0 ? (
        <Alert variant="info" className="text-center py-4">
          <p className="mb-2">No rooms selected for comparison.</p>
          <Link to="/browse" className="btn btn-primary btn-sm">Browse & Select Rooms</Link>
        </Alert>
      ) : (
        <RoomComparison
          rooms={rooms}
          equipmentMap={equipmentMap}
          locationMap={locationMap}
          onRemove={removeRoom}
        />
      )}
    </Container>
  );
}
