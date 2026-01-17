'use strict';

import express from 'express';
import fs from 'fs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';

const { Router } = express;

const router = Router();

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), 'openapi.json'), 'utf8')
);

router.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;
