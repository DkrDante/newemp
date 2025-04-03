
const express = require('express');
const { postJob, getJobs, applyJob } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/post', protect, postJob);
router.get('/', getJobs);
router.post('/apply/:jobId', protect, applyJob);

module.exports = router;
