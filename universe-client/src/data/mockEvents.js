export const HERO_EVENT = {
  id: "hero-imsa-1",
  title: "Principles of Entrepreneurship Mastery",
  date: "2024-05-15",
  time: "08:30 AM - 05:00 PM",
  category: "Academic",
  description:
    "A comprehensive workshop focused on building professional social media portfolios and personal branding strategies for the digital age.",
  organizer: { name: "IMSA (FPM)" },
  venue: { name: "Dewan Kuliah 1, FPM" },
  image:
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop",
  target: "All FPM Students",
  benefit: "University Merit",
  theme: "cyan", // FPM
  attendees: 420,
};

export const FEATURED_EVENTS = [
  HERO_EVENT,
  {
    id: "jpk-fiesta",
    title: "Fiesta Keusahawanan JPK",
    date: "2024-06-10",
    time: "05:00 PM",
    category: "Lifestyle",
    description:
      "A vibrant food festival featuring student vendors, open-mic sessions, and a nostalgic Wayang Pacak experience.",
    organizer: { name: "JPK Jasmine" },
    venue: { name: "Dataran Jasmine" },
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2574&auto=format&fit=crop",
    target: "College Residents",
    benefit: "Kupon Kolej",
    theme: "purple",
  },
  {
    id: "fita-animation",
    title: "Animation Kingdom Showcase",
    date: "2024-06-20",
    time: "08:00 PM",
    category: "Creative",
    description:
      "Exclusive screening of final year 2D/3D productions and 'Art-Valuate' critique sessions.",
    organizer: { name: "FiTA Animation" },
    venue: { name: "Panggung Percubaan" },
    image:
      "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2670&auto=format&fit=crop",
    target: "Open to Public",
    benefit: "e-Cert Provided",
    theme: "purple",
  },
  {
    id: "jpk-harmony",
    title: "Jasmine Harmony Night",
    date: "2024-07-05",
    time: "08:30 PM",
    category: "Lifestyle",
    description:
      "An acoustic competition under the stars featuring student talents.",
    organizer: { name: "JPK Jasmine" },
    venue: { name: "Dataran Jasmine" },
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2670&auto=format&fit=crop",
    target: "College Residents",
    benefit: "Kupon Kolej",
    theme: "purple",
  },
  {
    id: "irec-sulam",
    title: "SULAM: Digital Resilience",
    date: "2024-06-01",
    time: "09:00 AM",
    category: "Community",
    description:
      "Community service initiative educating the public on identifying digital scams and practicing responsible internet usage.",
    organizer: { name: "IREC (FPM)" },
    venue: { name: "Puncak Perdana Community Hall" },
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2670&auto=format&fit=crop",
    target: "All Students",
    benefit: "Academic Merit",
    theme: "cyan",
  },
];

export const UPCOMING_EVENTS = [
  {
    id: "irec-sulam",
    title: "SULAM: Digital Resilience",
    date: "2024-06-01",
    time: "09:00 AM",
    category: "Community",
    description:
      "Community service initiative educating the public on identifying digital scams and practicing responsible internet usage.",
    organizer: { name: "IREC (FPM)" },
    venue: { name: "Puncak Perdana Community Hall" },
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2670&auto=format&fit=crop",
    target: "All Students",
    benefit: "Academic Merit", // Changed from Kupon Kolej
    theme: "cyan",
  },
  {
    id: "jpk-fiesta",
    title: "Fiesta Keusahawanan JPK",
    date: "2024-06-10",
    time: "05:00 PM",
    category: "Lifestyle",
    description:
      "A vibrant food festival featuring student vendors, open-mic sessions, and a nostalgic Wayang Pacak experience.",
    organizer: { name: "JPK Jasmine" },
    venue: { name: "Dataran Jasmine" },
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2574&auto=format&fit=crop",
    target: "College Residents",
    benefit: "Kupon Kolej",
    theme: "purple",
  },
  {
    id: "jpk-harmony",
    title: "Jasmine Harmony Night",
    date: "2024-07-05",
    time: "08:30 PM",
    category: "Lifestyle",
    description:
      "An acoustic competition under the stars featuring student talents.",
    organizer: { name: "JPK Jasmine" },
    venue: { name: "Dataran Jasmine" },
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2670&auto=format&fit=crop",
    target: "College Residents",
    benefit: "Kupon Kolej",
    theme: "purple",
  },
  {
    id: "aims-workshop",
    title: "Cinematic Horizons Workshop", // Changed title as requested
    date: "2024-07-22",
    time: "10:00 AM",
    category: "Creative",
    description:
      "A session with local directors on turning scripts into short films.",
    organizer: { name: "AIMS (FiTA)" },
    venue: { name: "Studio Filem 1" },
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2574&auto=format&fit=crop",
    target: "FiTA Students",
    benefit: "E-Cert Provided",
    theme: "purple",
  },
  {
    id: "icons-esports",
    title: "E-Sports Galaxy Open",
    date: "2024-08-10",
    time: "02:00 PM",
    category: "Lifestyle",
    description:
      "A Mobile Legends tournament for all Puncak Perdana residents.",
    organizer: { name: "ICONS" },
    venue: { name: "Dewan Serbaguna" },
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2670&auto=format&fit=crop",
    target: "All Gamers",
    benefit: "Campus-Wide Merit",
    theme: "purple",
  },
  {
    id: "smf-career",
    title: "Informatics Career Fair",
    date: "2024-08-25",
    time: "09:00 AM",
    category: "Academic",
    description:
      "Networking with top tech companies for internship placements.",
    organizer: { name: "SMF (FPM)" },
    venue: { name: "Foyer FPM" },
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2670&auto=format&fit=crop",
    target: "Final Year Students",
    benefit: "Resume Checks",
    theme: "cyan",
  },
  {
    id: "pmh-forum",
    title: "Leadership & Spirituality Forum",
    date: "2024-09-05",
    time: "08:00 PM",
    category: "Leadership",
    description:
      "A forum discussing the balance between leadership and spiritual well-being.",
    organizer: { name: "PMH" },
    venue: { name: "Pusat Islam" },
    image:
      "https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=1589&auto=format&fit=crop",
    target: "All Students",
    benefit: "Spiritual Merit",
    theme: "cyan",
  },
  {
    id: "fita-animation",
    title: "Animation Kingdom Showcase",
    date: "2024-06-20",
    time: "08:00 PM",
    category: "Creative",
    description:
      "Exclusive screening of final year 2D/3D productions and 'Art-Valuate' critique sessions.",
    organizer: { name: "FiTA Animation" },
    venue: { name: "Panggung Percubaan" },
    image:
      "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2670&auto=format&fit=crop",
    target: "Open to Public",
    benefit: "e-Cert Provided",
    theme: "purple",
  },
];
