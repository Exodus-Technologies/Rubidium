'use strict';

/**
 * https://github.com/validatorjs/validator.js#validators
 */
import { validationResult } from 'express-validator';

const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  return `${location}[${param}]: ${msg}`;
};

export { errorFormatter, validationResult };
