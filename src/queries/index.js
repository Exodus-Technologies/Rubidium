'use strict';

import config from '../config';

export const queryOps = { __v: 0, _id: 0 };

export const generateDBUri = () => {
  const { dbUser, dbPass, clusterDomain, dbName } = config.sources.database;
  return `mongodb+srv://${dbUser}:${dbPass}@${clusterDomain}/${dbName}?retryWrites=true&w=majority`;
};
