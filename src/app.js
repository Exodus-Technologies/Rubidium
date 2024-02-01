'use strict';

import config from './config';
import logger from './logger';
import models from './models';
import generateDBUri from './queries';
import server from './server';

/**
 * Connects to database
 */
const initializeDBConnection = async () => {
  const { options } = config.sources.database;
  const { source } = models;
  try {
    await source.connect(generateDBUri(), options);
  } catch (e) {
    logger.error(`Error connecting to db: ${e}`);
    throw e;
  }
};

/**
 * Starts web server
 */
const initializeServer = () => {
  const { PORT, HOST } = config;
  try {
    server.listen(PORT, HOST);
    logger.info(`Server listening on port: ${PORT}`);
  } catch (err) {
    logger.error(`Server started with error: ${err}`);
    throw err;
  }
};

const bootstrapApp = async () => {
  logger.info('Starting app...');
  await initializeDBConnection();
  initializeServer();
};

bootstrapApp().catch(err => {
  logger.error(`Error starting application: ${err}`);
});

process
  .on('unhandledRejection', reason => {
    logger.error(`Unhandled rejection, reason: ${reason.stack} `);
  })
  .on('uncaughtException', err => {
    logger.error(err, 'Uncaught exception thrown.');
    process.exit(1);
  })
  .on('SIGINT', () => {
    /**
     * Close connection to db
     */
    logger.info('Disconnecting from database and shutting down application.');
    const { source } = models;
    source
      .disconnect()
      .then(() => {
        process.exit(0);
      })
      .catch(() => {
        process.exit(1);
      });
  });
