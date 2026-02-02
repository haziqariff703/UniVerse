const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Venue = require('../models/venue');

dotenv.config({ path: './config/.env' });

const venues = [
  {
    name: "Tingkat Tiga, Blok Akademik",
    type: "Academic",
    location_code: "BA-L3",
    max_capacity: 438,
    description: "An indoor multi-purpose space situated on the third level of the academic block. Perfect for student club carnivals, exhibitions, and interactive sessions.",
    facilities: ["Open Space", "Wifi", "Power Outlets", "Elevator Access", "PA System", "Exhibition Booths"],
    bestFor: ["Carnivals", "Exhibitions", "Booths", "Talks"],
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1200",
    glowColor: "cyan",
    occupancyStatus: "Busy",
    liveOccupancy: 85,
    nextAvailable: "04:00 PM",
    accessHours: "08:00 - 22:00",
    accessLevel: "Student ID",
    managedBy: "HEP Office"
  },
  {
    name: "Surau Ar-Razzaq",
    type: "Residential",
    location_code: "SR-01",
    max_capacity: 300,
    description: "A serene campus prayer hall that doubles as a multipurpose congregation space for religious programs and community gatherings.",
    facilities: ["PA System", "AC", "Prayer Mats", "Ablution Area", "Projector", "Whiteboard"],
    bestFor: ["Religious Talks", "Ghazal", "Gatherings"],
    image: "https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&q=80&w=1200", // Placeholder for surauImage
    glowColor: "purple",
    occupancyStatus: "Available",
    liveOccupancy: 20,
    nextAvailable: "Now",
    accessHours: "05:00 - 23:00",
    accessLevel: "Public",
    managedBy: "Warden Office"
  },
  {
    name: "Dewan Serba Guna",
    type: "Social",
    location_code: "DSG-HQ",
    max_capacity: 500,
    description: "The primary multipurpose hall for large-scale student events, launches, and formal ceremonies. Equipped with professional sound systems.",
    facilities: ["Stage", "PA System", "Sound System", "Projector", "AC", "Backstage", "VIP Holding Room", "Dressing Room"],
    bestFor: ["Formal Dinners", "Launches", "Ceremonies", "Showcases"],
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200",
    glowColor: "purple",
    occupancyStatus: "Closed",
    liveOccupancy: 0,
    nextAvailable: "Tomorrow, 08:00 AM",
    accessHours: "08:00 - 23:00",
    accessLevel: "Event Entry",
    managedBy: "HEP Office"
  },
  {
    name: "Kolej Jasmine Common Areas",
    type: "Residential",
    location_code: "KJ-COM",
    max_capacity: 500,
    description: "Versatile common halls and outdoor lawns within the Jasmine residential college, ideal for student society promotions and club fairs.",
    facilities: ["Open Area", "Wifi", "Benches", "Street Lighting", "PA System", "Portable Stage"],
    bestFor: ["Club Fairs", "Informal Gatherings", "Pop-up Markets"],
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=1200",
    glowColor: "purple",
    occupancyStatus: "Available",
    liveOccupancy: 10,
    nextAvailable: "Now",
    accessHours: "07:00 - 23:59",
    accessLevel: "Student ID",
    managedBy: "Jasmine College Office"
  },
  {
    name: "PTAR Campus Library",
    type: "Academic",
    location_code: "PTAR-01",
    max_capacity: 80,
    description: "Academic-focused spaces including seminar rooms and discussion areas. Best for quiet academic competitions and scholarly talks.",
    facilities: ["AC", "Wifi", "Whiteboard", "Projector", "Tiered Seating", "Discussion Rooms", "Power Outlets"],
    bestFor: ["Seminars", "Competitions", "Academic Talks"],
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=1200",
    glowColor: "cyan",
    occupancyStatus: "Moderate",
    liveOccupancy: 65,
    nextAvailable: "Now",
    accessHours: "08:30 - 22:30",
    accessLevel: "Student ID",
    managedBy: "Library Management"
  },
  {
    name: "Outdoor Lawns / Open Areas",
    type: "Outdoor",
    location_code: "OUT-01",
    max_capacity: 1000,
    description: "Expansive open spaces for massive outdoor festivals, cultural screenings, and large-scale informal student gatherings.",
    facilities: ["Wide Open Space", "Natural Ventilation", "Stage Setup Ready", "Floodlights"],
    bestFor: ["Wayang Pacak", "Festivals", "Concerts", "Cultural Events"],
    image: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&q=80&w=1200",
    glowColor: "purple",
    occupancyStatus: "Available",
    liveOccupancy: 0,
    nextAvailable: "Now",
    accessHours: "24 Hours",
    accessLevel: "Open Access",
    managedBy: "Security Hub"
  },
  {
    name: "Faculty Lecture Halls",
    type: "Academic",
    location_code: "FLH-B2",
    max_capacity: 120,
    description: "Professional lecture theaters located within academic blocks, featuring classroom-style setups for educational sessions.",
    facilities: ["AC", "Projector", "Microphone", "Writing Tablets", "Whiteboard", "Sound System"],
    bestFor: ["Educational Seminars", "Faculty Talks", "Workshops"],
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200",
    glowColor: "cyan",
    occupancyStatus: "Available",
    liveOccupancy: 0,
    nextAvailable: "Now",
    accessHours: "08:00 - 18:00",
    accessLevel: "Academic Only",
    managedBy: "Faculty Office"
  }
];

const seedVenues = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/UniVerse');
    console.log('MongoDB Connected to [UniVerse] ✅');

    // Clear existing venues
    await Venue.deleteMany();
    console.log('Existing venues removed.');

    // Insert new venues
    await Venue.insertMany(venues);
    console.log('Venues seeded successfully.');

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedVenues();
