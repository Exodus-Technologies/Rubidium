'use strict';

import config from '../config';

const generateDBUri = () => {
  const { dbUser, dbPass, clusterDomain, dbName } = config.sources.database;
  return `mongodb+srv://${dbUser}:${dbPass}@${clusterDomain}/${dbName}?retryWrites=true&w=majority`;
};

export default generateDBUri;
