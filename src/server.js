'use strict';

import http from 'http';
import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import noCache from 'nocache';
import cors from 'cors';
import responseTime from 'response-time';

import { requestResponse, errorHandler, rateLimiter } from './middlewares';
import {
  appRouter,
  authRouter,
  userRouter,
  subscriptionRouter,
  bambuserRouter,
  broadcastRouter,
  categoryRouter,
  videoRouter
} from './routers';

// Create the Express application object
const server = express();

// specify a single subnet
server.set('trust proxy', true);

//Cors middleware
server.use(cors());
console.log('CORS enabled.');

//Helmet middleware
server.use(helmet());
server.use(helmet.referrerPolicy());
console.log('Loaded helmet middleware.');

//No cache middleware
server.use(noCache());
console.log('Loaded no-cache middleware.');

//Compression middleware
server.use(compression());
console.log('Loaded compression middleware.');

//BodyParser middleware
server.use(express.urlencoded({ limit: '50Mb', extended: false }));
server.use(express.json({ limit: '50Mb' }));
console.log('Loaded body-parser middleware.');

// Response time middleware
server.use(responseTime());
console.log('Loaded response time middleware.');

//error handler middleware
server.use(errorHandler);
console.log('Loaded error handler middleware.');

//route middleware with request/response
server.use(requestResponse);
console.log('Loaded request/response middleware.');

//App middleware
server.use(appRouter);
console.log('Loaded server routes middleware.');

//Auth middleware
server.use(rateLimiter, authRouter);
console.log('Loaded auth routes middleware.');

//User middleware
server.use(rateLimiter, userRouter);
console.log('Loaded user routes middleware.');

//Subscription middleware
server.use(rateLimiter, subscriptionRouter);
console.log('Loaded subscription routes middleware.');

//Bambuser middleware
server.use(rateLimiter, bambuserRouter);
console.log('Loaded bambuser routes middleware.');

//Broadcasts middleware
server.use(rateLimiter, broadcastRouter);
console.log('Loaded broadcast routes middleware.');

//Category middleware
server.use(rateLimiter, categoryRouter);
console.log('Loaded category routes middleware.');

//Video middleware
server.use(rateLimiter, videoRouter);
console.log('Loaded video routes middleware.');

export default http.createServer(server);
