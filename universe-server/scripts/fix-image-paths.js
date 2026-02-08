const mongoose = require('mongoose');
require('dotenv').config({ path: './config/.env' });

const Community = require('../models/community');
const Venue = require('../models/venue');
const Speaker = require('../models/speaker');
const Event = require('../models/event');
const ClubProposal = require('../models/clubProposal');

async function fixPaths() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const sanitize = (path) => {
      if (!path) return path;
      // Fix malformed cloud URLs like /https:/res.example.com/...
      if (path.startsWith('/http')) {
        return path.substring(1).replace(':/', '://');
      }
      // Fix potential double slashes
      if (path.startsWith('//')) {
        return path.substring(1);
      }
      return path;
    };

    // 1. Communities
    const communities = await Community.find();
    for (const c of communities) {
      const newLogo = sanitize(c.logo);
      const newBanner = sanitize(c.banner);
      if (newLogo !== c.logo || newBanner !== c.banner) {
        c.logo = newLogo;
        c.banner = newBanner;
        await c.save();
        console.log(`Fixed Community: ${c.name}`);
      }
    }

    // 2. Venues
    const venues = await Venue.find();
    for (const v of venues) {
      let changed = false;
      const newImage = sanitize(v.image);
      if (newImage !== v.image) {
        v.image = newImage;
        changed = true;
      }
      if (v.images && v.images.length > 0) {
        const newImages = v.images.map(img => sanitize(img));
        if (JSON.stringify(newImages) !== JSON.stringify(v.images)) {
          v.images = newImages;
          changed = true;
        }
      }
      if (changed) {
        await v.save();
        console.log(`Fixed Venue: ${v.name}`);
      }
    }

    // 3. Speakers
    const speakers = await Speaker.find();
    for (const s of speakers) {
      const newImage = sanitize(s.image);
      const newProposal = sanitize(s.proposal_url);
      if (newImage !== s.image || newProposal !== s.proposal_url) {
        s.image = newImage;
        s.proposal_url = newProposal;
        await s.save();
        console.log(`Fixed Speaker: ${s.name}`);
      }
    }

    // 4. Events
    const events = await Event.find();
    for (const e of events) {
      const newImage = sanitize(e.image);
      const newProposal = sanitize(e.proposal);
      if (newImage !== e.image || newProposal !== e.proposal) {
        e.image = newImage;
        e.proposal = newProposal;
        await e.save();
        console.log(`Fixed Event: ${e.title}`);
      }
    }

    // 5. Proposals
    const proposals = await ClubProposal.find();
    console.log(`Found ${proposals.length} proposals`);
    for (const p of proposals) {
      console.log(`Processing Proposal: ${p.clubName} - Logo: ${p.logo_url}`);
      const newLogo = sanitize(p.logo_url);
      const newBanner = sanitize(p.banner_url);
      const newConst = sanitize(p.constitution_url);
      const newConsent = sanitize(p.consent_letter_url);
      
      console.log(`Sanitized Logo: ${newLogo}`);
      
      if (newLogo !== p.logo_url || newBanner !== p.banner_url || newConst !== p.constitution_url || newConsent !== p.consent_letter_url) {
        p.logo_url = newLogo;
        p.banner_url = newBanner;
        p.constitution_url = newConst;
        p.consent_letter_url = newConsent;
        await p.save();
        console.log(`Fixed Proposal: ${p.clubName}`);
      }
    }

    // 6. Users (ID Card and Confirmation Letter)
    const User = require('../models/user');
    const users = await User.find({ organizerRequest: true });
    console.log(`Found ${users.length} users with organizer requests`);
    for (const u of users) {
      const newIdCard = sanitize(u.id_card_url);
      const newConf = sanitize(u.confirmation_letter_url);
      if (newIdCard !== u.id_card_url || newConf !== u.confirmation_letter_url) {
        u.id_card_url = newIdCard;
        u.confirmation_letter_url = newConf;
        await u.save();
        console.log(`Fixed User documents: ${u.name}`);
      }
    }

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fixPaths();
