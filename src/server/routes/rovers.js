const express = require('express');
const { celebrate } = require('celebrate');
const { roverSchema, getRoverPhotos } = require('../lib');

const router = express.Router();

router.get(
  '/api/v1/rovers/:roverName',
  celebrate(roverSchema),
  async (req, res) => {
    const { roverName } = req.params;
    const roverPhotos = await getRoverPhotos(roverName);
    res.json(roverPhotos);
  },
);

module.exports = router;
