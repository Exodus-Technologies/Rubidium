'use strict';

import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import http from 'http';
import noCache from 'nocache';
import responseTime from 'response-time';

import config from './config';
import { BASE_URL } from './constants';
import logger from './logger';
import { errorHandler, requestResponse } from './middlewares';
import {
  appRouter,
  authRouter,
  categoryRouter,
  issueRouter,
  notFoundRouter,
  permissionRouter,
  roleRouter,
  subscriptionRouter,
  swaggerRouter,
  userRouter,
  videoRouter
} from './routers';

const { trustProxy } = config;

// Create the Express application object
const server = express();

// specify a single subnet
server.set('trust proxy', trustProxy);

//Cors middleware
server.use(cors());
logger.info('CORS enabled.');

//Helmet middleware
server.use(
  helmet({
    xPoweredBy: false
  })
);
logger.info('Loaded helmet middleware.');

//Reducing fingerprinting
server.disable('x-powered-by');
logger.info('Loaded helmet middleware.');

//No cache middleware
server.use(noCache());
logger.info('Loaded no-cache middleware.');

//Compression middleware
server.use(compression());
logger.info('Loaded compression middleware.');

//BodyParser middleware
server.use(express.urlencoded({ limit: '50Mb', extended: false }));
server.use(express.json({ limit: '50Mb' }));
logger.info('Loaded body-parser middleware.');

// Response time middleware
server.use(responseTime());
logger.info('Loaded response time middleware.');

//error handler middleware
server.use(errorHandler);
logger.info('Loaded error handler middleware.');

//route middleware with request/response
server.use(requestResponse);
logger.info('Loaded request/response middleware.');

//Swagger middleware
server.use(BASE_URL, swaggerRouter);
logger.info('Loaded swagger documentation routes middleware.');

//App middleware
server.use(BASE_URL, appRouter);
logger.info('Loaded server routes middleware.');

//Permission middleware
server.use(rateLimiter, permissionRouter);
logger.info('Loaded permission routes middleware.');

//Permission middleware
server.use(rateLimiter, roleRouter);
logger.info('Loaded role routes middleware.');

//Auth middleware
server.use(BASE_URL, authRouter);
logger.info('Loaded auth routes middleware.');

//User middleware
server.use(BASE_URL, userRouter);
logger.info('Loaded user routes middleware.');

//Subscription middleware
server.use(BASE_URL, subscriptionRouter);
logger.info('Loaded subscription routes middleware.');

// Bambuser middleware
// server.use(bambuserRouter);
// logger.info('Loaded bambuser routes middleware.');

//Broadcasts middleware
// server.use(broadcastRouter);
// logger.info('Loaded broadcast routes middleware.');

//Category middleware
server.use(BASE_URL, categoryRouter);
logger.info('Loaded category routes middleware.');

//Video middleware
server.use(BASE_URL, videoRouter);
logger.info('Loaded video routes middleware.');

//Issue middleware
server.use(BASE_URL, issueRouter);
logger.info('Loaded issue routes middleware.');

server.use(notFoundRouter);
logger.info('Loaded not found routes middleware.');

export default http.createServer(server);
