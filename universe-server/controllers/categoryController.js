const Category = require('../models/category');

/**
 * @desc    Get all active categories (Public)
 * @route   GET /api/categories
 * @access  Public
 */
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ is_active: true })
      .select('name slug color icon description')
      .sort({ name: 1 });
    
    res.status(200).json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
