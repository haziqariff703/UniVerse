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
    longDescription:
      "Join us for a transformative session dedicated to securing your digital footprint. In an era where online threats are evolving faster than ever, understanding the mechanics of social engineering and technical vulnerabilities is crucial. This SULAM initiative brings together cybersecurity experts and community leaders to empower you with actionable knowledge.\n\nParticipants will engage in hands-on workshops, case study analyses, and interactive simulations. Whether you are a student, a local business owner, or a concerned citizen, this event provides the tools you need to browse safely and protect your personal information.",
    organizer: {
      name: "IREC (FPM)",
      role: "Information Resource Center",
      logo: "https://api.dicebear.com/7.x/shapes/svg?seed=IREC",
    },
    venue: { name: "Puncak Perdana Community Hall", location_code: "CH-01" },
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2670&auto=format&fit=crop",
    target: "All Students",
    benefit: "Academic Merit",
    theme: "cyan",
    badges: ["Merit Provided", "E-Cert", "Food Provided"],
    agenda: [
      {
        time: "09:00 AM",
        title: "Registration & Briefing",
        desc: "Check-in and welcome pack distribution.",
      },
      {
        time: "10:00 AM",
        title: "The Anatomy of a Scam",
        desc: "Keynote session by industry experts.",
      },
      {
        time: "12:00 PM",
        title: "Interactive Workshop",
        desc: "Simulated phishing attempts and defense tactics.",
      },
      {
        time: "02:00 PM",
        title: "Q&A with Security Team",
        desc: "Open floor for community concerns.",
      },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
      "https://images.unsplash.com/photo-1563986768609-322da13575f3",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
      "https://images.unsplash.com/photo-1551808195-3209559f0f95",
    ],
  },
  {
    id: "jpk-fiesta",
    title: "Fiesta Keusahawanan JPK",
    date: "2024-06-10",
    time: "05:00 PM",
    category: "Lifestyle",
    description:
      "A vibrant food festival featuring student vendors, open-mic sessions, and a nostalgic Wayang Pacak experience.",
    longDescription:
      "The Jasmine Entrepreneurship Fiesta is more than just a bazaar; it's a celebration of creativity and community spirit. Support your fellow students as they showcase their culinary skills and unique products. As the sun sets, immerse yourself in our 'Wayang Pacak' outdoor cinema experience, followed by live performances from local campus talents.\n\nEntry is free for all Puncak Perdana residents. Come for the food, stay for the harmony!",
    organizer: {
      name: "JPK Jasmine",
      role: "College Representative Council",
      logo: "https://api.dicebear.com/7.x/shapes/svg?seed=JPK",
    },
    venue: { name: "Dataran Jasmine", location_code: "DJ-G" },
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2574&auto=format&fit=crop",
    target: "College Residents",
    benefit: "Kupon Kolej",
    theme: "purple",
    badges: ["Kupon Provided", "Food Trucks", "Music"],
    agenda: [
      {
        time: "05:00 PM",
        title: "Bazaar Opening",
        desc: "Visit student booths and food stalls.",
      },
      {
        time: "08:00 PM",
        title: "Wayang Pacak",
        desc: "Outdoor screening of 'Hikayat Merong Mahawangsa'.",
      },
      {
        time: "10:00 PM",
        title: "Open Mic Session",
        desc: "Student acoustic performances.",
      },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
      "https://images.unsplash.com/photo-1526976668912-1a812b5070f4",
    ],
  },
  {
    id: "jpk-harmony",
    title: "Jasmine Harmony Night",
    date: "2024-07-05",
    time: "08:30 PM",
    category: "Lifestyle",
    description:
      "An acoustic competition under the stars featuring student talents.",
    longDescription:
      "Witness the brightest stars of Puncak Perdana under the open sky. Jasmine Harmony Night brings together musicians, poets, and performers for an unforgettable evening of artistic expression. With a focus on acoustic arrangements and raw talent, this competition celebrates the diverse creative culture of our campus.\n\nGrab your picnic mats and join us for a night of pure auditory bliss.",
    organizer: {
      name: "JPK Jasmine",
      role: "College Representative Council",
      logo: "https://api.dicebear.com/7.x/shapes/svg?seed=JPK",
    },
    venue: { name: "Dataran Jasmine", location_code: "DJ-G" },
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2670&auto=format&fit=crop",
    target: "College Residents",
    benefit: "Kupon Kolej",
    theme: "purple",
    badges: ["Kupon Provided", "Chill Vibes", "Star Gazing"],
    agenda: [
      {
        time: "08:30 PM",
        title: "Opening Ceremony",
        desc: "Introduction of judges and event kickoff.",
      },
      {
        time: "09:00 PM",
        title: "Acoustic Showdown",
        desc: "Performances from the top 10 finalists.",
      },
      {
        time: "11:00 PM",
        title: "Prize Giving",
        desc: "Awarding the winners and closing ceremony.",
      },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1501612722273-04666bc4351e",
      "https://images.unsplash.com/photo-1514525253361-b83a859b127e",
      "https://images.unsplash.com/photo-1453090927415-5f45085b65c0",
      "https://images.unsplash.com/photo-1506157786151-b8491531f063",
    ],
  },
  {
    id: "aims-workshop",
    title: "Cinematic Horizons Workshop",
    date: "2024-07-22",
    time: "10:00 AM",
    category: "Creative",
    description:
      "A session with local directors on turning scripts into short films.",
    longDescription:
      "Dive deep into the world of filmmaking with the Cinematic Horizons Workshop. Hosted by AIMS (FiTA), this masterclass is designed for aspiring writers and directors who want to transform their written words into compelling visual stories.\n\nLearn about visual storytelling, blocking, and directing actors from industry veterans who have shaped the local cinematic landscape.",
    organizer: {
      name: "AIMS (FiTA)",
      role: "Art & Media Student Association",
      logo: "https://api.dicebear.com/7.x/shapes/svg?seed=AIMS",
    },
    venue: { name: "Studio Filem 1", location_code: "F-S1" },
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2574&auto=format&fit=crop",
    target: "FiTA Students",
    benefit: "E-Cert Provided",
    theme: "purple",
    badges: ["Industry Merit", "Portfolio Review", "Networking"],
    agenda: [
      {
        time: "10:00 AM",
        title: "Script Analysis",
        desc: "How to identify visual opportunities in a script.",
      },
      {
        time: "01:00 PM",
        title: "Director's Vision",
        desc: "Managing a crew and communicating intent.",
      },
      {
        time: "03:00 PM",
        title: "Practical Exercise",
        desc: "On-set simulation with student actors.",
      },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1533488765986-dfa2a9939acd",
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4",
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26",
      "https://images.unsplash.com/photo-1500462859194-885d162d73f2",
    ],
  },
  {
    id: "icons-esports",
    title: "E-Sports Galaxy Open",
    date: "2024-08-10",
    time: "02:00 PM",
    category: "Lifestyle",
    description:
      "A Mobile Legends tournament for all Puncak Perdana residents.",
    longDescription:
      "Enter the Galaxy Open! ICONS presents the ultimate E-Sports challenge for Puncak Perdana students. Battle it out in the Land of Dawn for glory and prizes. Whether you are a casual player or a competitive squad, the Galaxy Open is the place to prove your skills.\n\nExpect high-octane matches, live shoutcasting, and an electric atmosphere.",
    organizer: {
      name: "ICONS",
      role: "E-Sports Association",
      logo: "https://api.dicebear.com/7.x/shapes/svg?seed=ICONS",
    },
    venue: { name: "Dewan Serbaguna", location_code: "DS-01" },
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2670&auto=format&fit=crop",
    target: "All Gamers",
    benefit: "Campus-Wide Merit",
    theme: "purple",
    badges: ["Cash Prizes", "Top 3 Trophies", "Live Stream"],
    agenda: [
      {
        time: "02:00 PM",
        title: "Tournament Kickoff",
        desc: "Group stage bracket reveals.",
      },
      {
        time: "04:00 PM",
        title: "Quarter Finals",
        desc: "The path to the semi-finals begins.",
      },
      {
        time: "07:00 PM",
        title: "Grand Finals",
        desc: "Final battle for the Galaxy Trophy.",
      },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1511512578047-dfb367046420",
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc",
      "https://images.unsplash.com/photo-1542751110-97427bbecf20",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f",
    ],
  },
  {
    id: "smf-career",
    title: "Informatics Career Fair",
    date: "2024-08-25",
    time: "09:00 AM",
    category: "Academic",
    description:
      "Networking with top tech companies for internship placements.",
    longDescription:
      "Your bridge to the professional world! The Informatics Career Fair, organized by SMF (FPM), brings together leading organizations in the IT, Data, and Creative industries. This is your chance to meet recruiters, understand industry requirements, and secure your dream internship.\n\nDon't forget your resume and your professional pitch!",
    organizer: {
      name: "SMF (FPM)",
      role: "Student Media Federation",
      logo: "https://api.dicebear.com/7.x/shapes/svg?seed=SMF",
    },
    venue: { name: "Foyer FPM", location_code: "F-FPM" },
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2670&auto=format&fit=crop",
    target: "Final Year Students",
    benefit: "Resume Checks",
    theme: "cyan",
    badges: ["Internship Leads", "Workshop Vouchers", "Goodie Bags"],
    agenda: [
      {
        time: "09:00 AM",
        title: "Industry Networking",
        desc: "Open floor for booth visits.",
      },
      {
        time: "11:00 AM",
        title: "Resume Doctor",
        desc: "1-on-1 feedback with HR pros.",
      },
      {
        time: "02:00 PM",
        title: "Mock Interviews",
        desc: "Practice sessions with real interviewers.",
      },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b",
      "https://images.unsplash.com/photo-1454162223968-fd997273934d",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998",
    ],
  },
  {
    id: "pmh-forum",
    title: "Leadership & Spirituality Forum",
    date: "2024-09-05",
    time: "08:00 PM",
    category: "Leadership",
    description:
      "A forum discussing the balance between leadership and spiritual well-being.",
    longDescription:
      "True leadership begins within. PMH invites you to a profound discussion on integrating spiritual values into modern leadership roles. This forum explores how mindfulness, purpose, and spiritual grounding can enhance decision-making and lead to more compassionate, effective leadership.\n\nJoin us for an evening of reflection and inspiration.",
    organizer: {
      name: "PMH",
      role: "Islamic Student Association",
      logo: "https://api.dicebear.com/7.x/shapes/svg?seed=PMH",
    },
    venue: { name: "Pusat Islam", location_code: "PI-H" },
    image:
      "https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=1589&auto=format&fit=crop",
    target: "All Students",
    benefit: "Spiritual Merit",
    theme: "cyan",
    badges: ["Holistic Merit", "Refreshments", "Community Bonding"],
    agenda: [
      {
        time: "08:00 PM",
        title: "Forum Opening",
        desc: "Recitation and introduction.",
      },
      {
        time: "08:30 PM",
        title: "Panel Discussion",
        desc: "Insights from invited religious and youth leaders.",
      },
      {
        time: "10:00 PM",
        title: "Concluding Remarks",
        desc: "Closing prayer and networking.",
      },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1518063311540-30b88557f306",
      "https://images.unsplash.com/photo-1504052434569-70ad5836ab44",
      "https://images.unsplash.com/photo-1490730141103-6ac27d02005a",
      "https://images.unsplash.com/photo-1519834125748-9da418f77366",
    ],
  },
  {
    id: "fita-animation",
    title: "Animation Kingdom Showcase",
    date: "2024-06-20",
    time: "08:00 PM",
    category: "Creative",
    description:
      "Exclusive screening of final year 2D/3D productions and 'Art-Valuate' critique sessions.",
    longDescription:
      "Witness the next generation of animators! The Animation Kingdom Showcase, organized by FiTA Animation, features the crowning works of our final year students. From evocative 2D shorts to technically stunning 3D productions, this event is a testament to the skill and passion of our creative community.\n\nFollowing the screening, join our 'Art-Valuate' session for an in-depth look at the creative process.",
    organizer: {
      name: "FiTA Animation",
      role: "Faculty of Film, Theater & Animation",
      logo: "https://api.dicebear.com/7.x/shapes/svg?seed=FITA",
    },
    venue: { name: "Panggung Percubaan", location_code: "F-PP" },
    image:
      "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2670&auto=format&fit=crop",
    target: "Open to Public",
    benefit: "e-Cert Provided",
    theme: "purple",
    badges: ["Portfolio Showcase", "Director Q&A", "Fame merit"],
    agenda: [
      {
        time: "08:00 PM",
        title: "Screening Session 1",
        desc: "2D Animation short films.",
      },
      {
        time: "09:30 PM",
        title: "Screening Session 2",
        desc: "3D Animation productions.",
      },
      {
        time: "11:00 PM",
        title: "Art-Valuate",
        desc: "Critique and award ceremony.",
      },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23",
      "https://images.unsplash.com/photo-1534423839368-1791a1ad2f60",
      "https://images.unsplash.com/photo-1542751110-97427bbecf20",
    ],
  },
];
