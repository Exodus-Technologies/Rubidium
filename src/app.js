'use strict';

import server from './server';
import config from './config';
import models from './models';
import generateDBUri from './queries';

/**
 * Starts web server
 */
const initializeServer = async () => {
  const { PORT, HOST } = config;
  try {
    await server.listen(PORT, HOST);
    console.log(`Server listening on port: ${PORT}`);
  } catch (err) {
    console.log(`Server started with error: ${err}`);
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
    console.log(`Error connecting to db: ${e}`);
    throw e;
  }
};

const initializeApp = async () => {
  console.log('Starting app...');
  await initializeDB();
  await initializeServer();
};

initializeApp().catch(err => {
  console.log(`Error starting application: ${err}`);
});

process
  .on('unhandledRejection', reason => {
    console.log(`Unhandled rejection, reason: ${reason.stack} `);
  })
  .on('uncaughtException', err => {
    console.log(err, 'Uncaught exception thrown.');
    process.exit(1);
  })
  .on('SIGINT', () => {
    /**
     * Close connection to db
     */
    console.log('Disconnecting from database and shutting down application.');
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
