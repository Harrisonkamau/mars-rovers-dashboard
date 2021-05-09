const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to Mars Rover Dashboard server '});
});

module.exports = router;
