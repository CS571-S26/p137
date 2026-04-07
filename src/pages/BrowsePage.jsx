import { useState, useMemo } from 'react';
import { Container, Row, Col, Button, Alert, Tabs, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getLocations, getAllRooms, getEquipmentForRoom, getAllEquipment, getRoomTypes } from '../data/campusData';
import LocationCard from '../components/LocationCard';
import RoomCard from '../components/RoomCard';
import SearchFilter from '../components/SearchFilter';

export default function BrowsePage() {
  const locations = getLocations();
  const allRooms = getAllRooms();
  const equipmentList = getAllEquipment();
  const roomTypes = getRoomTypes();

  const [activeTab, setActiveTab] = useState('rooms');
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    roomType: '',
    minCapacity: '',
    timeSlot: '',
    equipment: [],
  });

  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('campusreserve-favorites')) || []; }
    catch { return []; }
  });

  const [compareList, setCompareList] = useState([]);

  const toggleFavorite = (roomId) => {
    setFavorites(prev => {
      const next = prev.includes(roomId) ? prev.filter(id => id !== roomId) : [...prev, roomId];
      localStorage.setItem('campusreserve-favorites', JSON.stringify(next));
      return next;
    });
  };

  const toggleCompare = (roomId) => {
    setCompareList(prev => {
      if (prev.includes(roomId)) return prev.filter(id => id !== roomId);
      if (prev.length >= 3) return prev;
      return [...prev, roomId];
    });
  };

  const filteredRooms = useMemo(() => {
    return allRooms.filter(room => {
      const location = locations.find(l => l.id === room.locationId);

      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchesName = room.name.toLowerCase().includes(q);
        const matchesLocation = location?.name.toLowerCase().includes(q);
        const matchesType = room.type.toLowerCase().includes(q);
        if (!matchesName && !matchesLocation && !matchesType) return false;
      }

      if (filters.location && room.locationId !== filters.location) return false;
      if (filters.roomType && room.type !== filters.roomType) return false;
      if (filters.minCapacity && room.capacity < parseInt(filters.minCapacity)) return false;
      if (filters.timeSlot && !room.availableSlots.includes(filters.timeSlot)) return false;

      if (filters.equipment && filters.equipment.length > 0) {
        const roomEq = getEquipmentForRoom(room.id).map(e => e.id);
        if (!filters.equipment.every(eqId => roomEq.includes(eqId))) return false;
      }

      return true;
    });
  }, [allRooms, filters, locations]);

  const filteredLocations = useMemo(() => {
    if (!filters.search) return locations;
    const q = filters.search.toLowerCase();
    return locations.filter(l =>
      l.name.toLowerCase().includes(q) || l.type.toLowerCase().includes(q)
    );
  }, [locations, filters.search]);

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-white">Browse Campus Resources</h2>
        {compareList.length > 0 && (
          <Link to={`/compare?rooms=${compareList.join(',')}`} className="btn btn-outline-primary">
            Compare ({compareList.length}) &rarr;
          </Link>
        )}
      </div>

      <SearchFilter
        filters={filters}
        onChange={setFilters}
        locations={locations}
        equipmentList={equipmentList}
        roomTypes={roomTypes}
      />

      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
        <Tab eventKey="rooms" title={`Rooms (${filteredRooms.length})`}>
          {filteredRooms.length === 0 ? (
            <Alert variant="info">No rooms match your filters. Try adjusting your search criteria.</Alert>
          ) : (
            <>
              {compareList.length < 3 && (
                <small className="text-muted d-block mb-3">
                  Select up to 3 rooms to compare. ({compareList.length}/3 selected)
                </small>
              )}
              <Row className="g-3">
                {filteredRooms.map(room => {
                  const location = locations.find(l => l.id === room.locationId);
                  return (
                    <Col lg={4} md={6} key={room.id}>
                      <RoomCard
                        room={room}
                        equipment={getEquipmentForRoom(room.id)}
                        isFavorite={favorites.includes(room.id)}
                        onToggleFavorite={() => toggleFavorite(room.id)}
                        showLocation
                        locationName={location?.name}
                        selectable
                        selected={compareList.includes(room.id)}
                        onSelect={toggleCompare}
                      />
                    </Col>
                  );
                })}
              </Row>
            </>
          )}
        </Tab>
        <Tab eventKey="locations" title={`Locations (${filteredLocations.length})`}>
          <Row className="g-4">
            {filteredLocations.map(loc => (
              <Col md={4} key={loc.id}>
                <LocationCard location={loc} />
              </Col>
            ))}
          </Row>
        </Tab>
      </Tabs>
    </Container>
  );
}
