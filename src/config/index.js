'use strict';

import * as dotenv from 'dotenv';
import { stringToBoolean } from '../utilities/boolean';

dotenv.config();

const config = {
  NODE_ENV: process.env.NODE_ENV,
  HOST: process.env.HOST,
  PORT: process.env.PORT,
  CMS: process.env.CMS_HOST,
  HASH_SALT: +process.env.HASH_SALT,
  jwtSecret: process.env.JWT_SECRET,
  purgeSubscriptions: stringToBoolean(process.env.PURGE_SUBSCRIPTIONS),
  subscriptionURI: process.env.SUBSCRIPTIONS_URI,
  defaultCacheTtl: +process.env.DEFAULT_CACHE_TTL,
  sources: {
    twilio: {
      sendGridAPIKey: process.env.SENDGRID_API_KEY,
      noReplyEmail: process.env.NO_REPLY_EMAIL
    },
    database: {
      clusterDomain: process.env.CLUSTER_DOMAIN,
      dbName: process.env.DB_NAME,
      dbUser: process.env.DB_USER,
      dbPass: process.env.DB_PASS,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    }
  }
};

export default config;
