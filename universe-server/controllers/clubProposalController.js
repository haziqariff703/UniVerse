const ClubProposal = require('../models/clubProposal');
const User = require('../models/user');
const Notification = require('../models/notification');

const { resolveFilePath } = require('../utils/pathResolver');
const path = require('path');

/**
 * @desc    Submit a new club proposal
 * @route   POST /api/proposals
 * @access  Private (Student)
 */
exports.submitProposal = async (req, res) => {
  try {
    const { clubName, category, mission, advisorName, committeeSize } = req.body;

    const proposalData = {
      clubName,
      category,
      mission,
      advisorName,
      committeeSize,
      student_id: req.user.id
    };

    if (req.files) {
      if (req.files['constitution']) {
        proposalData.constitution_url = resolveFilePath(req.files['constitution'][0]);
      }
      if (req.files['consentLetter']) {
        proposalData.consent_letter_url = resolveFilePath(req.files['consentLetter'][0]);
      }
      if (req.files['logo']) {
        proposalData.logo_url = resolveFilePath(req.files['logo'][0]);
      }
      if (req.files['banner']) {
        proposalData.banner_url = resolveFilePath(req.files['banner'][0]);
      }
    }

    const proposal = new ClubProposal(proposalData);

    await proposal.save();

    // Also mark the user as having an active organizer request for admin visibility
    await User.findByIdAndUpdate(req.user.id, { organizerRequest: true });

    res.status(201).json({ message: 'Proposal submitted successfully', proposal });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

/**
 * @desc    Get current user's proposals
 * @route   GET /api/proposals/my-proposals
 * @access  Private
 */
exports.getMyProposals = async (req, res) => {
  try {
    const proposals = await ClubProposal.find({ student_id: req.user.id });
    res.status(200).json(proposals);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};
