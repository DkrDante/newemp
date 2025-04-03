
const express = require('express');
const { getFreelancers, getFreelancerById, updateFreelancer } = require('../controllers/freelancerController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getFreelancers);
router.get('/:id', getFreelancerById);
router.put('/:id', protect, updateFreelancer);

module.exports = router;
