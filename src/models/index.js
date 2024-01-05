'use strict';

/**
 * https://gist.github.com/AKIRA-MIYAKE/03b9ae80dbdf61bf28ef
 */
import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import config from '../config';
import logger from '../logger';

const basename = path.basename(__filename);

const models = {};

const { clusterDomain } = config.sources.database;

/**
 * Set event listener to mongoose.connection on error
 */
mongoose.connection.on('error', error => {
  logger.error(error);
});

/**
 * Set event listener to mongoose.connection on open
 */
mongoose.connection.on('open', () => {
  logger.info(`Connected to ${clusterDomain}....`);
});

/**
 * This warning message is indicating that the Mongoose library is currently using the "strictQuery" option and that this option will be switched back to "false" in Mongoose 7 by default.
 * Mongoose uses this option to determine whether to enforce strict query syntax. When set to "false", Mongoose will allow query conditions to match multiple properties.
 * To resolve this warning, you can either set "strictQuery" to "false" in your code by using the following line:
 */
mongoose.set('strictQuery', false);

/**
 * Assign models to 'models' object
 */
fs.readdirSync(__dirname)
  .filter(filename => {
    // Get file's name that lives in the same directory without myself.
    return filename.indexOf('.') !== 0 && filename !== basename;
  })
  .forEach(filename => {
    // If file's extension is not 'js', break.
    if (filename.slice(-3) !== '.js') return;

    const filepath = path.join(__dirname, filename);

    // When imported file use 'export default', object is assinged 'default'.
    const imported = require(filepath).default
      ? require(filepath).default
      : require(filepath);

    if (typeof imported.modelName !== 'undefined') {
      // Model definition file is expected exporting 'Model' of mongoose.
      models[imported.modelName] = imported;
    }
  });

models.source = mongoose;

export default models;
