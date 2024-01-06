'use strict';

import rateLimit from 'express-rate-limit';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { windowMs } from '../constants';
import logger from '../logger';
import { getCache, setCache } from '../queries/cache';
import { getUserByEmail } from '../queries/users';
import { isDevelopmentEnvironment } from '../utilities/boolean';
import { verifyJWTToken } from '../utilities/token';
import { errorFormatter, validationResult } from '../validations';

const requestResponse = (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  res.on('finish', () => {
    logger.info(
      `${res.statusCode} ${res.statusMessage}; ${res.get('X-Response-Time')} ${
        res.get('Content-Length') || 0
      }b sent`
    );
  });
  next();
};

const errorHandler = (err, req, res, next) => {
  err && logger.error('Error: ', err);
  return res
    .status(err.status || StatusCodes.INTERNAL_SERVER_ERROR)
    .send(err.message);
};

const rateLimiter = rateLimit({
  windowMs,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message:
    'Too many accounts created from this IP, please try again after an hour'
});

const validationHandler = (req, res, next) => {
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }
  next();
};

const apiCache = () => {
  return async (req, res, next) => {
    const key = `__express__${req.originalUrl || req.url}`;
    const cachedBody = await getCache(key);
    if (cachedBody) {
      return res.send(JSON.parse(cachedBody));
    } else {
      res.sendResponse = res.send;
      res.send = async body => {
        setCache({ key, body: JSON.stringify(body) });
        res.sendResponse(body);
      };
      next();
    }
  };
};

const validateToken = async (req, res, next) => {
  if (isDevelopmentEnvironment()) return next();
  const authorizationHeader = req.headers['authorization'];

  if (!authorizationHeader) {
    return res.status(StatusCodes.UNAUTHORIZED).send({
      errors: [
        {
          value: ReasonPhrases.UNAUTHORIZED,
          msg: 'Access token is missing'
        }
      ]
    });
  }

  //Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MD......
  const token = authorizationHeader.split(' ')[1];

  try {
    const result = verifyJWTToken(token);

    if (result) {
      const { email } = result.data;
      const [error, user] = await getUserByEmail(email);

      if (!user || error) {
        return res.status(StatusCodes.FORBIDDEN).send({
          errors: [
            {
              value: ReasonPhrases.FORBIDDEN,
              msg: 'Token metadata invalid'
            }
          ]
        });
      }

      if (user.email !== email) {
        return res.status(StatusCodes.FORBIDDEN).send({
          errors: [
            {
              value: ReasonPhrases.FORBIDDEN,
              msg: 'Access token provided was not generated by this service.'
            }
          ]
        });
      }
      next();
    }
    return res.status(StatusCodes.FORBIDDEN).send({
      errors: [
        {
          value: ReasonPhrases.FORBIDDEN,
          msg: 'Access token provided was not generated by this service.'
        }
      ]
    });
  } catch (error) {
    console.error(error);

    if (error.name === 'TokenExpiredError') {
      return res.status(StatusCodes.FORBIDDEN).send({
        errors: [
          {
            value: ReasonPhrases.FORBIDDEN,
            msg: 'Token has expired.'
          }
        ]
      });
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      errors: [
        {
          value: ReasonPhrases.INTERNAL_SERVER_ERROR,
          msg: 'Authenication Error.'
        }
      ]
    });
  }
};

export {
  apiCache,
  errorHandler,
  rateLimiter,
  requestResponse,
  validateToken,
  validationHandler
};
