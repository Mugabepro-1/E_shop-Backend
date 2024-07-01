const express = require('express');
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/category');
const checkAdmin = require('../helpers/checkAdmin');

const router = express.Router();

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post('/', checkAdmin, createCategory);
router.put('/:id', checkAdmin, updateCategory);
router.delete('/:id', checkAdmin, deleteCategory);

module.exports = router;
