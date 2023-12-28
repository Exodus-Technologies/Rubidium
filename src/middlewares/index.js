'use strict';

import NodeCache from 'node-cache';
import rateLimit from 'express-rate-limit';
import config from '../config';
import { errorFormatter, validationResult } from '../validations';
import { windowMs } from '../constants';

const nodeCache = new NodeCache();
const { defaultCacheTtl } = config;

const requestResponse = (req, res, next) => {
  console.info(`${req.method} ${req.originalUrl}`);
  res.on('finish', () => {
    console.info(
      `${res.statusCode} ${res.statusMessage}; ${res.get('X-Response-Time')} ${
        res.get('Content-Length') || 0
      }b sent`
    );
  });
  next();
};

const errorHandler = (err, req, res, next) => {
  err && console.error('Error: ', err);
  res.status(err.status || 500).send(err.message);
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
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const apiCache = () => {
  return (req, res, next) => {
    const key = `__express__${req.originalUrl || req.url}`;
    const cachedBody = nodeCache.get(key);
    if (cachedBody) {
      res.send(JSON.parse(cachedBody));
      return;
    } else {
      res.sendResponse = res.send;
      res.send = body => {
        nodeCache.set(key, body, defaultCacheTtl);
        res.sendResponse(body);
      };
      next();
    }
  };
};

export {
  requestResponse,
  errorHandler,
  validationHandler,
  apiCache,
  rateLimiter
};
