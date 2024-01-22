const express = require('express');

const reportController = require('../controllers/reportController');

const router = express.Router();

router.use('/api', reportController);

module.exports = router;