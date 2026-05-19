const express = require('express');
const router = express.Router();

router.get('/', (req, res) => { res.send('Doctors list placeholder'); });

module.exports = router;
