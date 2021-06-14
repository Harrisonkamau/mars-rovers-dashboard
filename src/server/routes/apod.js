/**
 * Route for grabbing the Picture Of The Day
 */

const express = require('express');
const { getPicOfTheDay } = require('../lib');

const router = express.Router();

router.get('/api/v1/apod', async (req, res) => {
  const pictureOfTheDay = await getPicOfTheDay();
  res.json(pictureOfTheDay);
});

module.exports = router;
