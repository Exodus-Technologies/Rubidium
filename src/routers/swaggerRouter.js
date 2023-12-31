'use strict';

import path from 'path';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const { Router } = express;

const router = Router();

const swaggerDocument = YAML.load(
  path.resolve(process.cwd(), 'src', 'swagger', 'swagger.yaml')
);

router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;
