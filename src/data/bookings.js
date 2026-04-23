const RESERVATIONS_KEY = 'campusreserve-reservations';

function todayIso(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

const SEED_TEMPLATE = [
  ['ml-study-1', 0, 540, 660],
  ['ml-study-1', 1, 840, 960],
  ['ml-study-1', 3, 600, 720],
  ['ml-study-2', 0, 720, 840],
  ['ml-study-2', 2, 900, 1020],
  ['ml-conf-1', 0, 600, 720],
  ['ml-conf-1', 4, 840, 960],
  ['ml-collab-1', 1, 720, 840],
  ['ml-collab-1', 2, 540, 660],
  ['cl-study-1', 0, 540, 660],
  ['cl-study-1', 1, 720, 840],
  ['cl-study-1', 4, 900, 1020],
  ['cl-study-2', 0, 780, 900],
  ['cl-media-1', 2, 600, 720],
  ['us-meet-1', 0, 540, 660],
  ['us-meet-1', 3, 780, 900],
  ['us-study-1', 1, 540, 600],
  ['us-study-1', 2, 720, 780],
  ['us-collab-1', 0, 600, 780],
  ['mu-meet-1', 2, 540, 660],
  ['mu-study-1', 0, 480, 540],
  ['mu-study-1', 1, 600, 720],
  ['mu-study-1', 5, 840, 960],
  ['mu-collab-1', 3, 660, 780],
  ['gh-conf-1', 2, 540, 660],
  ['gh-conf-1', 4, 780, 900],
  ['gh-study-1', 1, 600, 720],
  ['gh-collab-1', 0, 720, 840],
  ['eh-study-1', 2, 540, 600],
  ['eh-study-1', 3, 900, 960],
  ['eh-conf-1', 1, 600, 720],
  ['eh-maker-1', 0, 780, 900],
  ['eh-maker-1', 5, 540, 660],
];

let _seedCache = null;
export function getSeedBookings() {
  if (_seedCache) return _seedCache;
  _seedCache = SEED_TEMPLATE.map(([roomId, offset, startTime, endTime], i) => ({
    id: `seed-${i}`,
    roomId,
    date: todayIso(offset),
    startTime,
    endTime,
    status: 'upcoming',
    seeded: true,
    label: 'Already booked',
  }));
  return _seedCache;
}

export function getUserReservations() {
  try { return JSON.parse(localStorage.getItem(RESERVATIONS_KEY)) || []; }
  catch { return []; }
}

export function saveUserReservations(list) {
  localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(list));
}

export function getBookingsForRoomOnDate(roomId, date) {
  if (!date) return [];
  const seeds = getSeedBookings().filter(b => b.roomId === roomId && b.date === date);
  const user = getUserReservations().filter(
    r => r.roomId === roomId && r.status === 'upcoming' && r.date === date
  );
  return [...seeds, ...user];
}

export function getBookingsForRoomInRange(roomId, startDate, endDate) {
  const seeds = getSeedBookings().filter(
    b => b.roomId === roomId && b.date >= startDate && b.date <= endDate
  );
  const user = getUserReservations().filter(
    r => r.roomId === roomId && r.status === 'upcoming' && r.date >= startDate && r.date <= endDate
  );
  return [...seeds, ...user];
}

export function findConflict(roomId, date, startTime, endTime, excludeId) {
  const bookings = getBookingsForRoomOnDate(roomId, date);
  return bookings.find(b => {
    if (excludeId && b.id === excludeId) return false;
    return startTime < b.endTime && endTime > b.startTime;
  }) || null;
}
