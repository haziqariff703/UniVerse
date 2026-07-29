const mongoose = require('mongoose');
const path = require('path');
const User = require('../models/user');
const Community = require('../models/community');
const CommunityMember = require('../models/communityMember');
const ClubProposal = require('../models/clubProposal');
require('dotenv').config({ path: path.join(__dirname, '../config/.env') });

const seedClub = async () => {
  try {
    // Connect to DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to Database: ${mongoose.connection.name}`);

    // 1. Find Organizer User
    const organizer = await User.findOne({ email: 'organizer@universe.com' });
    if (!organizer) {
      console.error('Error: organizer@universe.com not found. Please run seedAdmin.js first.');
      process.exit(1);
    }
    console.log(`Found Organizer ID: ${organizer._id}`);

    // 2. Create Club Proposal (Approved)
    let proposal = await ClubProposal.findOne({ clubName: 'Tech Innovators Club' });
    if (!proposal) {
      proposal = new ClubProposal({
        clubName: 'Tech Innovators Club',
        category: 'Academic',
        mission: 'To foster technical innovation and software development skills among students.',
        advisorName: 'Dr. Ahmad',
        committeeSize: 10,
        student_id: organizer._id,
        status: 'approved'
      });
      await proposal.save();
      console.log('[SUCCESS] Created approved Club Proposal');
    } else {
      console.log('[SKIPPED] Club Proposal already exists.');
    }

    // 3. Create Community
    let community = await Community.findOne({ slug: 'tech-innovators-club' });
    if (!community) {
      community = new Community({
        name: 'Tech Innovators Club',
        slug: 'tech-innovators-club',
        tagline: 'Innovating the future',
        description: 'A club dedicated to building software solutions and exploring new technologies.',
        category: 'Academic',
        advisor: { name: 'Dr. Ahmad', title: 'Club Advisor' },
        owner_id: organizer._id,
        is_verified: true
      });
      await community.save();
      console.log('[SUCCESS] Created Community (Club) successfully.');
    } else {
      console.log('[SKIPPED] Community already exists.');
    }

    // 4. Assign Organizer as President
    let membership = await CommunityMember.findOne({ community_id: community._id, user_id: organizer._id });
    if (!membership) {
      membership = new CommunityMember({
        community_id: community._id,
        user_id: organizer._id,
        role: 'President',
        department: 'Executive',
        status: 'Approved',
        joined_at: new Date()
      });
      await membership.save();
      console.log('[SUCCESS] Assigned Organizer as the President of the club.');
    } else {
      console.log('[SKIPPED] Organizer is already a member/president of this club.');
    }

    console.log('\n--- Club Seeding Process Completed ---');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding club:', error);
    process.exit(1);
  }
};

seedClub();
