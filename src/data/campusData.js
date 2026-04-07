const locations = [
  {
    id: 'memorial-library',
    name: 'Memorial Library',
    type: 'Library',
    address: '728 State St, Madison, WI 53706',
    description: 'The largest library on campus with extensive study spaces across multiple floors. A hub for research and quiet study.',
    image: 'https://placehold.co/600x400/111/333',
    hours: 'Mon-Thu 7:30am-2am, Fri 7:30am-10pm, Sat 9am-10pm, Sun 11am-2am',
    roomCount: 4,
  },
  {
    id: 'college-library',
    name: 'College Library',
    type: 'Library',
    address: '600 N Park St, Madison, WI 53706',
    description: 'Popular undergraduate library known for its collaborative atmosphere and modern facilities.',
    image: 'https://placehold.co/600x400/111/333',
    hours: 'Mon-Thu 8am-12am, Fri 8am-8pm, Sat 10am-6pm, Sun 12pm-12am',
    roomCount: 3,
  },
  {
    id: 'union-south',
    name: 'Union South',
    type: 'Union',
    address: '1308 W Dayton St, Madison, WI 53715',
    description: 'A vibrant student union featuring meeting rooms, event spaces, and collaborative work areas near the engineering campus.',
    image: 'https://placehold.co/600x400/111/333',
    hours: 'Mon-Sun 7am-11pm',
    roomCount: 3,
  },
  {
    id: 'memorial-union',
    name: 'Memorial Union',
    type: 'Union',
    address: '800 Langdon St, Madison, WI 53706',
    description: 'The iconic lakeside union with the famous Terrace. Offers reservable meeting and event spaces with stunning lake views.',
    image: 'https://placehold.co/600x400/111/333',
    hours: 'Mon-Sun 7am-12am',
    roomCount: 3,
  },
  {
    id: 'grainger-hall',
    name: 'Grainger Hall',
    type: 'Academic Building',
    address: '975 University Ave, Madison, WI 53706',
    description: 'Home to the Wisconsin School of Business, featuring state-of-the-art collaboration rooms and presentation spaces.',
    image: 'https://placehold.co/600x400/111/333',
    hours: 'Mon-Fri 7am-10pm, Sat-Sun 9am-5pm',
    roomCount: 3,
  },
  {
    id: 'engineering-hall',
    name: 'Engineering Hall',
    type: 'Academic Building',
    address: '1415 Engineering Dr, Madison, WI 53706',
    description: 'Modern engineering building with tech-equipped study rooms and collaborative maker spaces for student projects.',
    image: 'https://placehold.co/600x400/111/333',
    hours: 'Mon-Fri 7am-11pm, Sat 8am-8pm, Sun 10am-10pm',
    roomCount: 3,
  },
];

const rooms = [
  // Memorial Library
  {
    id: 'ml-study-1',
    locationId: 'memorial-library',
    name: 'Quiet Study Room 201',
    type: 'Study Room',
    floor: 2,
    capacity: 4,
    description: 'A quiet, enclosed study room ideal for focused group work. Features a large table and natural light from east-facing windows.',
    amenities: ['Power Outlets', 'Natural Light', 'Whiteboard', 'Wi-Fi'],
    image: 'https://placehold.co/600x400/111/333',
    availableSlots: ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '4:00 PM', '5:00 PM', '7:00 PM'],
    rating: 4.5,
    reviewCount: 23,
  },
  {
    id: 'ml-study-2',
    locationId: 'memorial-library',
    name: 'Graduate Research Room 305',
    type: 'Study Room',
    floor: 3,
    capacity: 2,
    description: 'A private two-person room designed for focused research and writing. Extremely quiet environment.',
    amenities: ['Power Outlets', 'Desk Lamp', 'Wi-Fi', 'Adjustable Chair'],
    image: 'https://placehold.co/600x400/111/333',
    availableSlots: ['8:00 AM', '10:00 AM', '12:00 PM', '3:00 PM', '6:00 PM'],
    rating: 4.8,
    reviewCount: 15,
  },
  {
    id: 'ml-conf-1',
    locationId: 'memorial-library',
    name: 'Conference Room 410',
    type: 'Conference Room',
    floor: 4,
    capacity: 12,
    description: 'A spacious conference room with presentation equipment, suitable for team meetings and group presentations.',
    amenities: ['Projector', 'Whiteboard', 'Power Outlets', 'Video Conferencing', 'Wi-Fi'],
    image: 'https://placehold.co/600x400/111/333',
    availableSlots: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'],
    rating: 4.2,
    reviewCount: 31,
  },
  {
    id: 'ml-collab-1',
    locationId: 'memorial-library',
    name: 'Collaboration Space 102',
    type: 'Collaboration Space',
    floor: 1,
    capacity: 8,
    description: 'An open collaboration space with movable furniture and writable walls, perfect for brainstorming sessions.',
    amenities: ['Writable Walls', 'Movable Furniture', 'Power Outlets', 'Monitor', 'Wi-Fi'],
    image: 'https://placehold.co/600x400/111/333',
    availableSlots: ['8:00 AM', '9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM', '7:00 PM', '8:00 PM'],
    rating: 4.6,
    reviewCount: 42,
  },

  // College Library
  {
    id: 'cl-study-1',
    locationId: 'college-library',
    name: 'Group Study Room A',
    type: 'Study Room',
    floor: 1,
    capacity: 6,
    description: 'A popular group study room near the main entrance. Glass walls provide visibility while keeping noise contained.',
    amenities: ['Whiteboard', 'Power Outlets', 'Wi-Fi', 'HDMI Display'],
    image: 'https://placehold.co/600x400/111/333',
    availableSlots: ['9:00 AM', '10:00 AM', '1:00 PM', '3:00 PM', '5:00 PM', '7:00 PM'],
    rating: 4.1,
    reviewCount: 56,
  },
  {
    id: 'cl-study-2',
    locationId: 'college-library',
    name: 'Group Study Room B',
    type: 'Study Room',
    floor: 1,
    capacity: 6,
    description: 'Adjacent to Room A with identical amenities. Slightly quieter location at the end of the hallway.',
    amenities: ['Whiteboard', 'Power Outlets', 'Wi-Fi', 'HDMI Display'],
    image: 'https://placehold.co/600x400/111/333',
    availableSlots: ['8:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM'],
    rating: 4.3,
    reviewCount: 38,
  },
  {
    id: 'cl-media-1',
    locationId: 'college-library',
    name: 'Media Room 204',
    type: 'Collaboration Space',
    floor: 2,
    capacity: 4,
    description: 'A tech-equipped room with dual monitors and audio equipment, ideal for multimedia projects and editing.',
    amenities: ['Dual Monitors', 'Audio Equipment', 'Power Outlets', 'Wi-Fi', 'Green Screen'],
    image: 'https://placehold.co/600x400/111/333',
    availableSlots: ['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM'],
    rating: 4.7,
    reviewCount: 19,
  },

  // Union South
  {
    id: 'us-meet-1',
    locationId: 'union-south',
    name: 'Landmark Room',
    type: 'Conference Room',
    floor: 2,
    capacity: 20,
    description: 'A large meeting room with modern AV equipment, perfect for student org meetings and workshops.',
    amenities: ['Projector', 'Microphone System', 'Whiteboard', 'Video Conferencing', 'Wi-Fi', 'Power Outlets'],
    image: 'https://placehold.co/600x400/111/333',
    availableSlots: ['9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM'],
    rating: 4.4,
    reviewCount: 28,
  },
  {
    id: 'us-study-1',
    locationId: 'union-south',
    name: 'Sett Study Nook 1',
    type: 'Study Room',
    floor: 1,
    capacity: 3,
    description: 'A cozy study nook near the Sett dining area. Convenient for quick study sessions between classes.',
    amenities: ['Power Outlets', 'Wi-Fi', 'Whiteboard'],
    image: 'https://placehold.co/600x400/111/333',
    availableSlots: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'],
    rating: 3.9,
    reviewCount: 44,
  },
  {
    id: 'us-collab-1',
    locationId: 'union-south',
    name: 'Innovation Hub',
    type: 'Collaboration Space',
    floor: 3,
    capacity: 10,
    description: 'A creative collaboration space with writable surfaces, flexible seating, and presentation technology.',
    amenities: ['Writable Walls', 'Movable Furniture', 'Projector', 'Power Outlets', 'Wi-Fi', 'Monitor'],
    image: 'https://placehold.co/600x400/111/333',
    availableSlots: ['10:00 AM', '1:00 PM', '3:00 PM', '5:00 PM', '7:00 PM'],
    rating: 4.6,
    reviewCount: 35,
  },

  // Memorial Union
  {
    id: 'mu-meet-1',
    locationId: 'memorial-union',
    name: 'Tripp Commons',
    type: 'Conference Room',
    floor: 1,
    capacity: 30,
    description: 'An elegant meeting hall with historic charm, used for large presentations and formal events.',
    amenities: ['Projector', 'Microphone System', 'Stage', 'Wi-Fi', 'Power Outlets'],
    image: 'https://placehold.co/600x400/111/333',
    availableSlots: ['9:00 AM', '1:00 PM', '5:00 PM'],
    rating: 4.7,
    reviewCount: 22,
  },
  {
    id: 'mu-study-1',
    locationId: 'memorial-union',
    name: 'Lakefront Study Room',
    type: 'Study Room',
    floor: 2,
    capacity: 4,
    description: 'A study room with gorgeous views of Lake Mendota. Sunlight floods in during morning hours.',
    amenities: ['Natural Light', 'Lake View', 'Power Outlets', 'Wi-Fi', 'Whiteboard'],
    image: 'https://placehold.co/600x400/111/333',
    availableSlots: ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM'],
    rating: 4.9,
    reviewCount: 67,
  },
  {
    id: 'mu-collab-1',
    locationId: 'memorial-union',
    name: 'Terrace Workshop Space',
    type: 'Collaboration Space',
    floor: 1,
    capacity: 8,
    description: 'A versatile workshop space near the Terrace entrance with natural light and flexible configuration.',
    amenities: ['Movable Furniture', 'Whiteboard', 'Power Outlets', 'Wi-Fi', 'Monitor'],
    image: 'https://placehold.co/600x400/111/333',
    availableSlots: ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM', '7:00 PM'],
    rating: 4.5,
    reviewCount: 29,
  },

  // Grainger Hall
  {
    id: 'gh-conf-1',
    locationId: 'grainger-hall',
    name: 'Executive Boardroom',
    type: 'Conference Room',
    floor: 3,
    capacity: 14,
    description: 'A professional boardroom with video conferencing and presentation tools, modeled after corporate meeting spaces.',
    amenities: ['Video Conferencing', 'Projector', 'Whiteboard', 'Power Outlets', 'Wi-Fi', 'Phone'],
    image: 'https://placehold.co/600x400/111/333',
    availableSlots: ['8:00 AM', '10:00 AM', '1:00 PM', '3:00 PM', '5:00 PM'],
    rating: 4.6,
    reviewCount: 18,
  },
  {
    id: 'gh-study-1',
    locationId: 'grainger-hall',
    name: 'Business Study Suite',
    type: 'Study Room',
    floor: 2,
    capacity: 5,
    description: 'A well-appointed study room with business publications and a professional atmosphere.',
    amenities: ['Whiteboard', 'Power Outlets', 'Wi-Fi', 'Monitor'],
    image: 'https://placehold.co/600x400/111/333',
    availableSlots: ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM', '7:00 PM'],
    rating: 4.3,
    reviewCount: 25,
  },
  {
    id: 'gh-collab-1',
    locationId: 'grainger-hall',
    name: 'Team Project Room 150',
    type: 'Collaboration Space',
    floor: 1,
    capacity: 6,
    description: 'Designed for team projects with multiple screens and writable surfaces throughout.',
    amenities: ['Dual Monitors', 'Writable Walls', 'Power Outlets', 'Wi-Fi', 'Webcam'],
    image: 'https://placehold.co/600x400/111/333',
    availableSlots: ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM'],
    rating: 4.4,
    reviewCount: 33,
  },

  // Engineering Hall
  {
    id: 'eh-study-1',
    locationId: 'engineering-hall',
    name: 'Engineering Study Pod A',
    type: 'Study Room',
    floor: 1,
    capacity: 4,
    description: 'A modern pod-style study space with integrated technology and ergonomic seating.',
    amenities: ['Power Outlets', 'Monitor', 'Wi-Fi', 'USB Charging'],
    image: 'https://placehold.co/600x400/111/333',
    availableSlots: ['7:00 AM', '9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM', '7:00 PM', '9:00 PM'],
    rating: 4.5,
    reviewCount: 41,
  },
  {
    id: 'eh-conf-1',
    locationId: 'engineering-hall',
    name: 'Senior Design Room',
    type: 'Conference Room',
    floor: 2,
    capacity: 10,
    description: 'A presentation-ready room frequently used for senior design team meetings and project demos.',
    amenities: ['Projector', 'Whiteboard', 'Power Outlets', 'Wi-Fi', 'HDMI Display'],
    image: 'https://placehold.co/600x400/111/333',
    availableSlots: ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM'],
    rating: 4.1,
    reviewCount: 27,
  },
  {
    id: 'eh-maker-1',
    locationId: 'engineering-hall',
    name: 'Maker Collaboration Lab',
    type: 'Collaboration Space',
    floor: 1,
    capacity: 8,
    description: 'A hands-on collaboration lab with workbenches and prototyping tools alongside digital resources.',
    amenities: ['Workbenches', 'Power Outlets', 'Monitor', 'Wi-Fi', '3D Printer Access', 'Whiteboard'],
    image: 'https://placehold.co/600x400/111/333',
    availableSlots: ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM'],
    rating: 4.8,
    reviewCount: 36,
  },
];

const equipment = [
  { id: 'projector', name: 'Projector', icon: 'bi-projector' },
  { id: 'whiteboard', name: 'Whiteboard', icon: 'bi-easel' },
  { id: 'monitor', name: 'External Monitor', icon: 'bi-display' },
  { id: 'charger', name: 'Laptop Charger', icon: 'bi-battery-charging' },
  { id: 'webcam', name: 'Webcam', icon: 'bi-webcam' },
  { id: 'microphone', name: 'Microphone', icon: 'bi-mic' },
  { id: 'hdmi-cable', name: 'HDMI Cable', icon: 'bi-usb-plug' },
  { id: 'usb-hub', name: 'USB Hub', icon: 'bi-usb-symbol' },
  { id: 'phone-charger', name: 'Phone Charger', icon: 'bi-phone-charging' },
  { id: 'extension-cord', name: 'Extension Cord', icon: 'bi-plug' },
];

const roomEquipment = {
  'ml-study-1': ['whiteboard', 'charger', 'extension-cord'],
  'ml-study-2': ['charger'],
  'ml-conf-1': ['projector', 'whiteboard', 'hdmi-cable', 'webcam', 'microphone'],
  'ml-collab-1': ['monitor', 'whiteboard', 'charger', 'hdmi-cable'],
  'cl-study-1': ['whiteboard', 'hdmi-cable', 'charger'],
  'cl-study-2': ['whiteboard', 'hdmi-cable', 'charger'],
  'cl-media-1': ['monitor', 'webcam', 'microphone', 'hdmi-cable', 'usb-hub'],
  'us-meet-1': ['projector', 'microphone', 'whiteboard', 'webcam', 'hdmi-cable'],
  'us-study-1': ['whiteboard', 'charger'],
  'us-collab-1': ['projector', 'monitor', 'whiteboard', 'hdmi-cable'],
  'mu-meet-1': ['projector', 'microphone', 'hdmi-cable'],
  'mu-study-1': ['whiteboard', 'charger'],
  'mu-collab-1': ['monitor', 'whiteboard', 'charger', 'hdmi-cable'],
  'gh-conf-1': ['projector', 'webcam', 'whiteboard', 'hdmi-cable', 'phone-charger'],
  'gh-study-1': ['monitor', 'whiteboard', 'charger'],
  'gh-collab-1': ['monitor', 'whiteboard', 'webcam', 'hdmi-cable'],
  'eh-study-1': ['monitor', 'charger', 'usb-hub'],
  'eh-conf-1': ['projector', 'whiteboard', 'hdmi-cable'],
  'eh-maker-1': ['monitor', 'whiteboard', 'usb-hub', 'extension-cord'],
};

const reviews = [
  { id: 'r1', roomId: 'ml-study-1', author: 'Alex M.', rating: 5, date: '2026-03-28', text: 'Great natural light in the morning. Perfect for early study sessions.' },
  { id: 'r2', roomId: 'ml-study-1', author: 'Jordan K.', rating: 4, date: '2026-03-25', text: 'Solid room, but the outlet by the window doesn\'t always work. Use the ones near the door.' },
  { id: 'r3', roomId: 'ml-study-1', author: 'Sam P.', rating: 5, date: '2026-03-20', text: 'My go-to study spot. Always clean and quiet.' },
  { id: 'r4', roomId: 'ml-conf-1', author: 'Riley T.', rating: 4, date: '2026-03-30', text: 'Projector works well. Bring your own HDMI adapter for Mac though.' },
  { id: 'r5', roomId: 'ml-conf-1', author: 'Casey L.', rating: 4, date: '2026-03-22', text: 'Good for group presentations. Gets warm in the afternoon.' },
  { id: 'r6', roomId: 'ml-collab-1', author: 'Taylor W.', rating: 5, date: '2026-04-01', text: 'The writable walls are amazing for brainstorming. Wish every room had them.' },
  { id: 'r7', roomId: 'cl-study-1', author: 'Morgan H.', rating: 4, date: '2026-03-27', text: 'Glass walls are nice but not great if you need privacy. Good for group work.' },
  { id: 'r8', roomId: 'cl-study-1', author: 'Pat V.', rating: 3, date: '2026-03-18', text: 'Gets noisy during peak hours from nearby hallway. Book early morning slots.' },
  { id: 'r9', roomId: 'cl-media-1', author: 'Jamie R.', rating: 5, date: '2026-03-29', text: 'The dual monitors and audio setup are fantastic for video editing projects.' },
  { id: 'r10', roomId: 'us-meet-1', author: 'Drew S.', rating: 5, date: '2026-04-02', text: 'Best room for student org meetings. AV setup is professional quality.' },
  { id: 'r11', roomId: 'us-study-1', author: 'Quinn B.', rating: 4, date: '2026-03-24', text: 'Convenient between classes but a bit small. Great for solo or pair study.' },
  { id: 'r12', roomId: 'us-collab-1', author: 'Avery D.', rating: 5, date: '2026-03-31', text: 'Innovation Hub lives up to its name. The flexible space is perfect for hackathons.' },
  { id: 'r13', roomId: 'mu-study-1', author: 'Kai N.', rating: 5, date: '2026-04-03', text: 'Lake views make studying so much better. Best room on campus hands down.' },
  { id: 'r14', roomId: 'mu-study-1', author: 'Robin E.', rating: 5, date: '2026-03-26', text: 'Absolutely gorgeous in the morning. Gets competitive to book though.' },
  { id: 'r15', roomId: 'mu-meet-1', author: 'Harper G.', rating: 4, date: '2026-03-21', text: 'Beautiful historic room. The acoustics could be better for large groups.' },
  { id: 'r16', roomId: 'gh-conf-1', author: 'Finley J.', rating: 5, date: '2026-03-29', text: 'Feels like a real corporate boardroom. Video conferencing setup is top-notch.' },
  { id: 'r17', roomId: 'gh-study-1', author: 'Emerson C.', rating: 4, date: '2026-03-23', text: 'Professional atmosphere helps you focus. Monitor is great for spreadsheet work.' },
  { id: 'r18', roomId: 'eh-study-1', author: 'Dakota F.', rating: 5, date: '2026-04-01', text: 'Pod design is super modern and comfortable. USB charging built right in.' },
  { id: 'r19', roomId: 'eh-maker-1', author: 'Sage A.', rating: 5, date: '2026-03-30', text: '3D printer access from a study room is incredible. Great for prototyping.' },
  { id: 'r20', roomId: 'eh-conf-1', author: 'Reese M.', rating: 4, date: '2026-03-19', text: 'Good for senior design meetings. Whiteboard space could be bigger.' },
  { id: 'r21', roomId: 'ml-study-2', author: 'Blair O.', rating: 5, date: '2026-03-28', text: 'Perfect for deep focus work. The quiet is almost meditative.' },
  { id: 'r22', roomId: 'mu-collab-1', author: 'Phoenix W.', rating: 4, date: '2026-04-02', text: 'Great location near the Terrace. Natural light is wonderful in summer.' },
  { id: 'r23', roomId: 'gh-collab-1', author: 'Ellis Q.', rating: 5, date: '2026-03-27', text: 'Writable walls plus dual monitors — exactly what team projects need.' },
];

export function getLocations() {
  return locations;
}

export function getLocationById(id) {
  return locations.find(loc => loc.id === id);
}

export function getRoomsByLocation(locationId) {
  return rooms.filter(room => room.locationId === locationId);
}

export function getRoomById(id) {
  return rooms.find(room => room.id === id);
}

export function getAllRooms() {
  return rooms;
}

export function getEquipmentForRoom(roomId) {
  const equipIds = roomEquipment[roomId] || [];
  return equipIds.map(eid => equipment.find(e => e.id === eid)).filter(Boolean);
}

export function getAllEquipment() {
  return equipment;
}

export function getReviewsForRoom(roomId) {
  return reviews.filter(r => r.roomId === roomId);
}

export function getAverageRating(roomId) {
  const roomReviews = reviews.filter(r => r.roomId === roomId);
  if (roomReviews.length === 0) return 0;
  return roomReviews.reduce((sum, r) => sum + r.rating, 0) / roomReviews.length;
}

export function getRoomTypes() {
  return [...new Set(rooms.map(r => r.type))];
}

export function getLocationTypes() {
  return [...new Set(locations.map(l => l.type))];
}
