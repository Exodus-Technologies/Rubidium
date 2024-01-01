'use strict';

import express from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

const { Router } = express;

const router = Router();

router.get('*', (req, res) => {
  return res
    .status(StatusCodes.NOT_FOUND)
    .send({ message: ReasonPhrases.NOT_FOUND });
});

export default router;
