const Speaker = require('../models/speaker');

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
    if (req.file) {
      const filePath = req.file.path.replace(/\\/g, "/");
      proposal_url = `http://localhost:5000/${filePath}`;
    }

    const speaker = new Speaker({
      name,
      expertise,
      bio,
      social_links: typeof social_links === 'string' ? JSON.parse(social_links) : social_links,
      status: 'pending',
      proposal_url,
      requested_by: req.user.id
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
