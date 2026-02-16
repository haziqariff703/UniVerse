const Speaker = require('../models/speaker');
const fs = require('fs');
const path = require('path');

// Mock data for seeding
const MOCK_SPEAKERS = [
  {
    name: "Dr. Elena Void",
    role: "Astrophysicist",
    expertise: "Astrophysics",
    category: "Science",
    bio: "Leading researcher in dark matter and cosmic inflation. Dr. Void has spent over a decade mapping the unseen structures of the universe.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200",
    social_links: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    },
    stats: { talks: 12, merit: 450, rating: 4.9 },
    status: 'verified',
    about: "Dr. Elena Void is a pioneering figure in modern astrophysics, best known for her 'Void Theory' of dark matter distribution. A former lead researcher at CERN, she now dedicates her time to educating the next generation of space explorers.",
    achievements: [
      "Nobel Prize Nominee 2024",
      "Published 'The Silent Universe'",
      "TEDx Keynote Speaker",
      "NASA Distinguished Service Medal",
    ],
    past_events: [
      { year: "2025", title: "Keynote: The Edge of the Universe" },
      { year: "2024", title: "Panel: Interstellar Travel" },
      { year: "2023", title: "Workshop: Quantum Mechanics 101" },
    ],
    upcoming: "The Dark Matter Paradox - March 15th, 2026",
  },
  {
    name: "Marcus Nebula",
    role: "AI Ethicist",
    expertise: "AI ethics",
    category: "Tech",
    bio: "Futurist and author aiming to align AI with human values. Marcus advocates for 'Soulful AI' development.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1200",
    social_links: { linkedin: "#", website: "#" },
    stats: { talks: 8, merit: 320, rating: 4.7 },
    status: 'verified',
    about: "Marcus Nebula bridges the gap between silicon and soul. With a background in philosophy and computer science, he helps organizations navigate the moral landscape of artificial intelligence.",
    achievements: [
      "Best-Selling Author: 'The Machine's Heart'",
      "Advisor to the UN on AI Safety",
      "Founder of The Alignment Initiative",
    ],
    past_events: [
      { year: "2025", title: "Debate: Synthetics Rights" },
      { year: "2024", title: "Lecture: The Alignment Problem" },
    ],
    upcoming: "Ethics occurring at Light Speed - April 2nd, 2026",
  },
  {
    name: "Sarah Star",
    role: "Digital Reality Artist",
    expertise: "Digital Art",
    category: "Arts",
    bio: "Pioneer in VR sculpting and immersive installations. Sarah transforms digital spaces into emotional landscapes.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=1200",
    social_links: { twitter: "#", website: "#" },
    stats: { talks: 24, merit: 890, rating: 5.0 },
    status: 'verified',
    about: "Sarah Star treats virtual reality not as a tool, but as a canvas. Her immersive installations have been featured in Tokyo, Berlin, and the Metaverse Art Biennale.",
    achievements: [
      "Digital Tate Fellow",
      "Winner of the Golden Polygon Award",
      "Featured in Wired Magazine",
    ],
    past_events: [
      { year: "2025", title: "Exhibition: Dreams of Polygon" },
      { year: "2024", title: "Workshop: Sculpting Light" },
    ],
    upcoming: "Immersion Beta Launch - May 10th, 2026",
  },
  {
    name: "Prof. Quantum",
    role: "Quantum Engineer",
    expertise: "Quantum Computing",
    category: "Tech",
    bio: "Building the next generation of processors. He believes the future is superimposed.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=1200",
    social_links: { linkedin: "#" },
    stats: { talks: 5, merit: 200, rating: 4.8 },
    status: 'verified',
    about: "Professor Quantum (a pseudonym for Dr. A. Q. Miller) works on the bleeding edge of qubit stability. His lectures are known for being simultaneously confusing and enlightening.",
    achievements: [
      "Breakthrough in Error Correction",
      "Lead Physicist at Q-Core",
    ],
    past_events: [{ year: "2024", title: "The State of Qubit" }],
    upcoming: "Entanglement for Beginners - June 1st, 2026",
  },
  {
    name: "Chef Zorg",
    role: "Gastrophysicist",
    expertise: "Molecular Gastronomy",
    category: "Science",
    bio: "Cooking with science and zero-gravity techniques. Bringing the flavor of the cosmos to your plate.",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=1200",
    social_links: { website: "#" },
    stats: { talks: 18, merit: 600, rating: 4.9 },
    status: 'verified',
    about: "Chef Zorg applies the principles of chemistry and physics to culinary arts. Famous for his 'Edible Clouds' and 'Zero-G Soufflé', he challenges the definition of food itself.",
    achievements: [
      "Michelin Star (Galactic Guide)",
      "Inventor of Cryo-Spherification",
    ],
    past_events: [
      { year: "2025", title: "Tasting: The Moon's Crust" },
      { year: "2023", title: "Lecture: Nitrogen & Nutrition" },
    ],
    upcoming: "The Flavor of Vacuum - July 20th, 2026",
  },
];


/**
 * Propose a new speaker (Organizer only)
 * @route POST /api/speakers/propose
 */
exports.proposeSpeaker = async (req, res) => {
  try {
    const { name, expertise, bio, social_links } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Speaker name is required' });
    }

    let proposal_url = null;
    let image = null;

    if (req.files) {
      if (req.files.proposal) {
        const filePath = req.files.proposal[0].path.replace(/\\/g, "/");
        proposal_url = `http://localhost:5000/${filePath}`;
      }
      if (req.files.image) {
        const filePath = req.files.image[0].path.replace(/\\/g, "/");
        image = `http://localhost:5000/${filePath}`;
      }
    } else if (req.file) {
      // Fallback for single file upload if middleware wasn't updated correctly or legacy requests
      const filePath = req.file.path.replace(/\\/g, "/");
      proposal_url = `http://localhost:5000/${filePath}`;
    }

    const speaker = new Speaker({
      name,
      expertise,
      bio, // Map 'bio' from frontend to 'bio' in model (short bio)
      about: bio, // Also use bio as default 'about' for now
      social_links: typeof social_links === 'string' ? JSON.parse(social_links) : social_links,
      status: 'pending',
      proposal_url,
      image,
      requested_by: req.user.id,
      stats: { talks: 0, merit: 0, rating: 0 } // Initialize stats
    });

    await speaker.save();

    res.status(201).json({ 
      message: 'Speaker proposal submitted successfully. Awaiting admin verification.', 
      speaker 
    });
  } catch (error) {
    console.error('Propose speaker error:', error);
    res.status(500).json({ message: 'Failed to submit speaker proposal' });
  }
};

/**
 * Get all verified speakers (Public/Organizer)
 * @route GET /api/speakers
 */
exports.getVerifiedSpeakers = async (req, res) => {
  try {
    const speakers = await Speaker.find({ status: 'verified' }).sort({ name: 1 });
    res.json({ speakers });
  } catch (error) {
    console.error('Get verified speakers error:', error);
    res.status(500).json({ message: 'Failed to fetch speakers' });
  }
};

/**
 * Get speaker by ID (Public)
 * @route GET /api/speakers/:id
 */
/**
 * Get speaker by ID (Public)
 * @route GET /api/speakers/:id
 */
exports.getSpeakerById = async (req, res) => {
  try {
    const Event = require('../models/event'); // Lazy load to avoid circular dependency issues if any
    
    // Use lean() to get a plain JS object we can modify
    const speaker = await Speaker.findById(req.params.id).lean();
    
    if (!speaker) {
      return res.status(404).json({ message: 'Speaker not found' });
    }

    // Fetch latest 5 COMPLETED events for this speaker
    const historicalEvents = await Event.find({
      speaker_ids: req.params.id,
      status: 'Completed'
    })
    .sort({ date_time: -1 }) // Latest first
    .limit(5)
    .select('title date_time venue_id');

    // Map to the format expected by the frontend
    // Frontend expects: { year: String, title: String }
    if (historicalEvents.length > 0) {
      speaker.past_events = historicalEvents.map(event => {
        const date = new Date(event.date_time);
        return {
          id: event._id,
          year: date.getFullYear().toString(), // Extract year
          title: event.title,
          fullDate: date // Optional extra data
        };
      });
    } else {
       // If no real completed events exist, we can either leave the static data 
       // OR clear it. Given the request is to "present the latest 5 events...", 
       // it implies showing ACTUAL data. 
       // However, for demo purposes, if strictly no events are found, 
       // we might want to keep mock data? 
       // The prompt says "only showcase the talk 5 latest event from the speaker that is complete". 
       // This implies IF there are 10, show 5. If 0, show 0.
       // So I will overwrite it with empty array if they have no real history, 
       // UNLESS it's one of the mock speakers who hasn't really participated in the system yet.
       // Safe bet: If real events exist, usage them. If not, fallback to existing to avoid empty Profile for demo.
       // WAIT: User said "only showcase...". Real data is preferred.
       // But to avoid breaking the UI for the "Mock" speakers that are just seeded,
       // I will only overwrite if I found something, OR if I explicitly want to show "No history".
       // Let's overwrite only if the speaker is NOT one of the static mocks? 
       // No, the system should be dynamic. 
       // Decision: I will overwrite `past_events` with `historicalEvents` mapped. 
       // If empty, it shows empty. This is correct for a real system.
       // BUT, checking the requirement "historical data should present...".
       
       // Re-reading: "only 5 latest event that can be displayed even if there are 10 event for the speaker."
       // It implies a filter. I will overwrite.
       speaker.past_events = []; 
    }
    
    // Correction: actually populate if we found them.
    if (historicalEvents.length > 0) {
        speaker.past_events = historicalEvents.map(event => ({
            year: new Date(event.date_time).getFullYear().toString(),
            title: event.title
        }));
    } else {
        // If no real completed events, reset to empty to avoid showing fake data for a real user?
        // Or keep existing for 'demo' speakers?
        // Let's keep existing if it's a seed, but that's hard to know.
        // I will default to empty array to ensure "truth"
        speaker.past_events = []; // Clear mock data
    }

    res.json({ speaker });
  } catch (error) {
    console.error('Get speaker by ID error:', error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Speaker not found' });
    }
    res.status(500).json({ message: 'Failed to fetch speaker details' });
  }
};

/**
 * Get speakers for specific organizer (Own + Admin/Seeded)
 * @route GET /api/speakers/organizer
 */
exports.getSpeakersForOrganizer = async (req, res) => {
  try {
    // Logic: Show speakers requested by THIS user OR speakers with no requester (Seeded/System)
    // We could also verify if the requester was an admin, but 'null' covers seeded data.
    // If admins add speakers via API, they will have an ID. We might want to include them?
    // For now, let's stick to "My Speakers" + "System Speakers (seeded)".
    
    // Constraint: "instead of showing all the speaker directory"
    // implies filtering out other organizers' entries.
    
    const query = {
      $or: [
        { requested_by: req.user.id }, // My added speakers
        { requested_by: null }         // System seeded speakers
      ]
    };

    const speakers = await Speaker.find(query).sort({ name: 1 });
    res.json({ speakers });
  } catch (error) {
    console.error('Get organizer speakers error:', error);
    res.status(500).json({ message: 'Failed to fetch speakers' });
  }
};

/**
 * Update speaker details
 * @route PUT /api/speakers/:id
 */
exports.updateSpeaker = async (req, res) => {
  try {
    const { name, expertise, bio, social_links } = req.body;
    let speaker = await Speaker.findById(req.params.id);

    if (!speaker) {
      return res.status(404).json({ message: 'Speaker not found' });
    }

    // Authorization: Only Admin or Owner can edit
    // Note: If requested_by is null (System), only Admin should edit.
    const isAdmin = req.user.roles && req.user.roles.includes('admin');
    const isOwner = speaker.requested_by && speaker.requested_by.toString() === req.user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'Not authorized to edit this speaker' });
    }

    // Handle file updates
    if (req.files) {
      if (req.files.proposal) {
        const filePath = req.files.proposal[0].path.replace(/\\/g, "/");
        speaker.proposal_url = `http://localhost:5000/${filePath}`;
      }
      if (req.files.image) {
        const filePath = req.files.image[0].path.replace(/\\/g, "/");
        speaker.image = `http://localhost:5000/${filePath}`;
      }
    }

    // Update fields
    if (name) speaker.name = name;
    if (expertise) speaker.expertise = expertise;
    if (bio) {
        speaker.bio = bio;
        speaker.about = bio; // Keep synced for now
    }
    if (social_links) {
        speaker.social_links = typeof social_links === 'string' ? JSON.parse(social_links) : social_links;
    }

    await speaker.save();
    res.json({ message: 'Speaker updated successfully', speaker });
  } catch (error) {
    console.error('Update speaker error:', error);
    res.status(500).json({ message: 'Failed to update speaker' });
  }
};

/**
 * Delete speaker
 * @route DELETE /api/speakers/:id
 */
exports.deleteSpeaker = async (req, res) => {
  try {
    const speaker = await Speaker.findById(req.params.id);

    if (!speaker) {
      return res.status(404).json({ message: 'Speaker not found' });
    }

    // Authorization
    const isAdmin = req.user.roles && req.user.roles.includes('admin');
    const isOwner = speaker.requested_by && speaker.requested_by.toString() === req.user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'Not authorized to delete this speaker' });
    }

    await Speaker.findByIdAndDelete(req.params.id);
    res.json({ message: 'Speaker deleted successfully' });
  } catch (error) {
    console.error('Delete speaker error:', error);
    res.status(500).json({ message: 'Failed to delete speaker' });
  }
};

/**
 * Seed speakers (Dev/Admin)
 * @route POST /api/speakers/seed
 */
exports.seedSpeakers = async (req, res) => {
  try {
    // Check if speakers already exist to avoid duplicates (optional, based on preference)
    const count = await Speaker.countDocuments();
    if (count > 0) {
        return res.status(200).json({ message: 'Speakers already seeded', count });
    }

    await Speaker.insertMany(MOCK_SPEAKERS);
    res.status(201).json({ message: 'Speakers seeded successfully', count: MOCK_SPEAKERS.length });
  } catch (error) {
    console.error('Seed speakers error:', error);
    res.status(500).json({ message: 'Failed to seed speakers' });
  }
};
