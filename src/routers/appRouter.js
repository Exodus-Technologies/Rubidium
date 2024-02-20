'use strict';

import express from 'express';
import { StatusCodes } from 'http-status-codes';
import config from '../config';
import { apiCache, validateToken } from '../middlewares';
import { fancyTimeFormat } from '../utilities/time';

const { Router } = express;
const { version } = require('../../package.json');

const router = Router();

router.get('/', apiCache(), (_, res) => {
  res
    .status(StatusCodes.OK)
    .send({ message: 'Welcome to Rubidium Service Manager Service!' });
});

router.get('/probeCheck', (_, res) => {
  res.status(StatusCodes.OK).send({
    uptime: fancyTimeFormat(process.uptime()),
    date: new Date(),
    message: 'Rubidium Service Manager service up and running!',
    appVersion: version
  });
});

router.get('/ip', validateToken, (req, res) => res.send(req.ip));

router.get('/getConfiguration', validateToken, (_, res) => {
  res.status(StatusCodes.OK).send(config);
});

export default router;
