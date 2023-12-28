'use strict';

import config from '../config';

const { dbUser, dbPass, clusterDomain, dbName } = config.sources.database;

export const getDBUri = () => {
  return `mongodb+srv://${dbUser}:${dbPass}@${clusterDomain}/${dbName}?retryWrites=true&w=majority`;
};
