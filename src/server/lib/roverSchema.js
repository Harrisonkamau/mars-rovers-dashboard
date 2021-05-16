const { Joi } = require('celebrate');

const ROVER_NAMES = Object.freeze([
  'curiosity',
  'spirit',
  'opportunity',
  'perserverance',
]);

const roverSchema = {
  params: Joi.object({
    roverName: Joi.string().required().valid(...ROVER_NAMES),
  }),
};

module.exports = roverSchema;
