'use strict';

import express from 'express';
import { apiCache } from '../middlewares';
import { fancyTimeFormat } from '../utilities/time';

const { Router } = express;
const { version } = require('../../package.json');

const router = Router();

router.get('/sheen-service/', apiCache(), (_, res) => {
  res
    .status(200)
    .send({ message: 'Welcome to Rubidium Service Manager Service!' });
});

router.get('/sheen-service/probeCheck', (_, res) => {
  res.status(200).send({
    uptime: fancyTimeFormat(process.uptime()),
    date: new Date(),
    message: 'Rubidium Service Manager service up and running!',
    appVersion: version
  });
});

export default router;
