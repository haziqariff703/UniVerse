const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../config/.env') });

const User = require('../models/user');
const Event = require('../models/event');
const Notification = require('../models/notification');
const AuditLog = require('../models/auditLog');

const BASE_URL = 'http://localhost:5000/api';
let adminToken = '';
let userToken = '';
let userId = '';
let eventId = '';

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected.');

    // 1. Cleanup
    console.log('Cleaning up test data...');
    const testEmail = 'test_verify@example.com';
    const adminEmail = 'admin_verify@example.com';
    await User.deleteMany({ email: { $in: [testEmail, adminEmail] } });
    await Event.deleteMany({ title: 'Test Verification Event' });
    // Note: Not deleting notifications/audit logs to avoid clearing other data, but filtering by user_id later

    // 2. Create Admin
    console.log('Creating Admin...');
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash('password123', salt);
    
    const admin = new User({
      name: 'Verify Admin',
      email: adminEmail,
      password: hashedPass,
      role: 'admin',
      student_id: 'ADMIN99909',
      ic_number: '990101019999'
    });
    await admin.save();
    
    // Login Admin
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: adminEmail, password: 'password123' })
    });
    const adminLoginData = await adminLoginRes.json();
    adminToken = adminLoginData.token;
    console.log('Admin logged in.');

    // 3. Create User (Applicant)
    console.log('Creating Student User...');
    const user = new User({
      name: 'Verify Student',
      email: testEmail,
      password: hashedPass,
      role: 'student',
      organizerRequest: true,
      student_id: 'STUDENT999',
      ic_number: '990101018888' 
    });
    await user.save();
    userId = user._id.toString();

    // Login User
    const userLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: 'password123' })
    });
    const userLoginData = await userLoginRes.json();
    userToken = userLoginData.token;
    console.log('Student logged in.');

    // 4. Test Organizer Rejection
    console.log('\n--- Testing Organizer Rejection ---');
    const rejectOrgRes = await fetch(`${BASE_URL}/admin/organizers/${userId}/reject`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ reason: 'Insufficient documents' })
    });
    const rejectOrgData = await rejectOrgRes.json();
    console.log('Reject Response:', rejectOrgData.message);

    // Verify Notification
    const notif1 = await Notification.findOne({ user_id: userId, type: 'alert' }).sort({ created_at: -1 });
    if (notif1 && notif1.message.includes('Insufficient documents')) {
      console.log('PASS: Rejection notification found with reason.');
    } else {
      console.error('FAIL: Rejection notification missing or incorrect.', notif1);
    }
    
    // Verify User Role (Should still be student, request false)
    const userAfterReject = await User.findById(userId);
    if (userAfterReject.role === 'student' && userAfterReject.organizerRequest === false) {
      console.log('PASS: User role and request status correct.');
    } else {
      console.error('FAIL: User status incorrect.', userAfterReject);
    }

    // 5. Reset for Approval Test
    console.log('\n--- Resetting for Approval ---');
    await User.findByIdAndUpdate(userId, { organizerRequest: true });

    // 6. Test Organizer Approval
    console.log('--- Testing Organizer Approval ---');
    const approveOrgRes = await fetch(`${BASE_URL}/admin/organizers/${userId}/approve`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const approveOrgData = await approveOrgRes.json();
    console.log('Approve Response:', approveOrgData.message);

    // Verify Notification
    const notif2 = await Notification.findOne({ user_id: userId, type: 'success' }).sort({ created_at: -1 });
    if (notif2 && notif2.message.includes('approved')) {
      console.log('PASS: Approval notification found.');
    } else {
      console.error('FAIL: Approval notification missing.', notif2);
    }

    // 7. Create Event (Now as Organizer)
    console.log('\n--- Creating Event ---');
    // Refresh user token to get new role? (JWT contains role, so usually need relogin, but backend checks DB for permission for *some* things, but usually middleware checks token. 
    // Wait, auth middleware usually decodes token. If token says 'student', might fail. 
    // Let's re-login user to get new token with 'organizer' role.
    const userLoginRes2 = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: 'password123' })
    });
    const userLoginData2 = await userLoginRes2.json();
    userToken = userLoginData2.token; // Update token

    const eventData = {
      title: 'Test Verification Event',
      description: 'A test event',
      date_time: new Date(Date.now() + 86400000).toISOString(),
      capacity: 100,
      venue_id: new mongoose.Types.ObjectId(), // Fake ID
      image: '', // Optional
      proposal: '' // Optional
    };

    const createEventRes = await fetch(`${BASE_URL}/events`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify(eventData)
    });
    const createEventData = await createEventRes.json();
    if (createEventRes.ok) {
       eventId = createEventData.event._id;
       console.log('Event Created:', eventId);
    } else {
       console.error('Failed to create event:', createEventData);
       return;
    }

    // 8. Test Event Rejection
    console.log('\n--- Testing Event Rejection ---');
    const rejectEventRes = await fetch(`${BASE_URL}/admin/events/${eventId}/reject`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ reason: 'Dates conflict' })
    });
    console.log('Reject Event Response:', await rejectEventRes.json());

    // Verify Event Status & Reason
    const eventRejected = await Event.findById(eventId);
    if (eventRejected.status === 'rejected' && eventRejected.rejection_reason === 'Dates conflict') {
      console.log('PASS: Event status rejected and reason persisted.');
    } else {
      console.error('FAIL: Event status/reason incorrect.', eventRejected);
    }

    // Verify Notification
    const notif3 = await Notification.findOne({ user_id: userId, type: 'alert', message: /rejected/ }).sort({ created_at: -1 });
    if (notif3 && notif3.message.includes('Dates conflict')) {
      console.log('PASS: Event rejection notification found.');
    } else {
      console.error('FAIL: Event rejection notification missing.', notif3);
    }

    // 9. Reset Event for Approval
    await Event.findByIdAndUpdate(eventId, { status: 'pending' });

    // 10. Test Event Approval
    console.log('\n--- Testing Event Approval ---');
    const approveEventRes = await fetch(`${BASE_URL}/admin/events/${eventId}/approve`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    console.log('Approve Event Response:', await approveEventRes.json());
    
    // Verify Notification
    const notif4 = await Notification.findOne({ user_id: userId, type: 'success', message: /approved/ }).sort({ created_at: -1 });
    if (notif4) {
      console.log('PASS: Event approval notification found.');
    } else {
      console.error('FAIL: Event approval notification missing.');
    }

  } catch (err) {
    console.error('Test Failed:', err);
  } finally {
    console.log('\nCleaning up and closing...');
    const testEmail = 'test_verify@example.com';
    const adminEmail = 'admin_verify@example.com';
    await User.deleteMany({ email: { $in: [testEmail, adminEmail] } });
    if (eventId) await Event.findByIdAndDelete(eventId);
    
    await mongoose.disconnect();
    process.exit();
  }
}

run();
