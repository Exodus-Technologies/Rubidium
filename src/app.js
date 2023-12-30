'use strict';

import server from './server';
import config from './config';
import models from './models';
import generateDBUri from './queries';
import logger from './logger';

/**
 * Starts web server
 */
const initializeServer = async () => {
  const { PORT, HOST } = config;
  try {
    await server.listen(PORT, HOST);
    logger.info(`Server listening on port: ${PORT}`);
  } catch (err) {
    logger.error(`Server started with error: ${err}`);
    throw err;
  }
};

/**
 * Connects to database
 */
const initializeDB = async () => {
  const { options } = config.sources.database;
  const { source } = models;
  const uri = generateDBUri();
  try {
    await source.connect(uri, options);
  } catch (e) {
    logger.error(`Error connecting to db: ${e}`);
    throw e;
  }
};

const initializeApp = async () => {
  logger.info('Starting app...');
  await initializeDB();
  await initializeServer();
};

initializeApp().catch(err => {
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
