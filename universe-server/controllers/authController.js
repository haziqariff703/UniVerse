const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res) => {
  try {
    const { 
      student_id, 
      name, 
      email, 
      password, 
      role, 
      preferences,
      ic_number,
      gender,
      date_of_birth
    } = req.body;

    // Sanitize unique fields: convert empty strings to undefined
    const sanitizedStudentId = student_id === "" ? undefined : student_id;
    const sanitizedIcNumber = ic_number === "" ? undefined : ic_number;

    // Check if user already exists
    // Build query dynamically based on what's provided
    const orConditions = [{ email }];
    if (sanitizedStudentId) orConditions.push({ student_id: sanitizedStudentId });
    if (sanitizedIcNumber) orConditions.push({ ic_number: sanitizedIcNumber });

    const existingUser = await User.findOne({ 
      $or: orConditions
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email, student ID, or IC number already exists.' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Validate role (defaults to student if invalid or admin)
    const validRoles = ['student', 'organizer'];
    const assignedRole = validRoles.includes(role) ? role : 'student';

    // Create new user
    const user = new User({
      student_id: sanitizedStudentId,
      name,
      email,
      password: hashedPassword,
      role: 'student', // Always start as student until approved
      roles: ['student'], // Always start as student
      organizerRequest: role === 'organizer', // Capture intent
      preferences: preferences || [],
      ic_number: sanitizedIcNumber,
      gender,
      date_of_birth
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role, roles: user.roles, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully!',
      token,
      user: {
        id: user._id,
        student_id: user.student_id,
        name: user.name,
        email: user.email,
        role: user.role,
        roles: user.roles,
        preferences: user.preferences,
        ic_number: user.ic_number,
        gender: user.gender
      }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate roles array from DB source of truth
    let roles = user.roles || ['student'];
    
    // Safety check: Ensure student role exists
    if (!roles.includes('student')) {
      roles.push('student');
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role, roles: roles, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        student_id: user.student_id,
        name: user.name,
        email: user.email,
        role: user.role,
        roles: roles,
        preferences: user.preferences,
        is_organizer_approved: user.is_organizer_approved
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login.', error: error.message });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};
