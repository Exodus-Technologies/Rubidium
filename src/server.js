'use strict';

import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import http from 'http';
import noCache from 'nocache';
import responseTime from 'response-time';

import config from './config';
import logger from './logger';
import { errorHandler, rateLimiter, requestResponse } from './middlewares';
import {
  appRouter,
  authRouter,
  bambuserRouter,
  broadcastRouter,
  categoryRouter,
  issueRouter,
  notFoundRouter,
  subscriptionRouter,
  swaggerRouter,
  userRouter,
  videoRouter
} from './routers';

const { numOfProxies } = config;

// Create the Express application object
const server = express();

// specify a single subnet
server.set('trust proxy', numOfProxies);

//Cors middleware
server.use(cors());
logger.info('CORS enabled.');

//Helmet middleware
server.use(helmet());
server.use(helmet.referrerPolicy());
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
server.use(swaggerRouter);
logger.info('Loaded swagger documentation routes middleware.');

//App middleware
server.use(appRouter);
logger.info('Loaded server routes middleware.');

//Auth middleware
server.use(rateLimiter, authRouter);
logger.info('Loaded auth routes middleware.');

//User middleware
server.use(rateLimiter, userRouter);
logger.info('Loaded user routes middleware.');

//Subscription middleware
server.use(rateLimiter, subscriptionRouter);
logger.info('Loaded subscription routes middleware.');

//Bambuser middleware
server.use(rateLimiter, bambuserRouter);
logger.info('Loaded bambuser routes middleware.');

//Broadcasts middleware
server.use(rateLimiter, broadcastRouter);
logger.info('Loaded broadcast routes middleware.');

//Category middleware
server.use(rateLimiter, categoryRouter);
logger.info('Loaded category routes middleware.');

//Video middleware
server.use(rateLimiter, videoRouter);
logger.info('Loaded video routes middleware.');

//Issue middleware
server.use(rateLimiter, issueRouter);
logger.info('Loaded issue routes middleware.');

server.use(notFoundRouter);
logger.info('Loaded not found routes middleware.');

export default http.createServer(server);
