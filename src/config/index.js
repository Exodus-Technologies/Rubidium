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
  defaultCacheTtl: +process.env.DEFAULT_CACHE_TTL,
  sources: {
    aws: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
      s3ThumbnailBucketName: process.env.S3_THUMBNAIL_BUCKET_NAME,
      s3VideoBucketName: process.env.S3_VIDEO_BUCKET_NAME,
      s3IssueBucketName: process.env.S3_ISSUE_BUCKET_NAME,
      s3CoverImageBucketName: process.env.S3_COVERIMAGE_BUCKET_NAME,
      videoDistributionURI: process.env.AWS_CLOUDFRONT_VIDEOS_DISTRIBUTION_URI,
      thumbnailDistributionURI:
        process.env.AWS_CLOUDFRONT_THUMBNAILS_DISTRIBUTION_URI,
      cloudWatchLogGroup: process.env.CLOUDWATCH_LOG_GROUP
    },
    bambuser: {
      apiKey: process.env.BAMBUSER_API_KEY,
      daId: process.env.BAMBUSER_DAID,
      daSecret: process.env.BAMBUSER_DASECRET,
      broadcastURL: process.env.BAMBUSER_BROADCAST_URL,
      platforms: {
        ios: process.env.BAMBUSER_APP_KEY_IOS,
        android: process.env.BAMBUSER_APP_KEY_ANDROID,
        web: process.env.BAMBUSER_APP_KEY_WEB
      }
    },
    database: {
      clusterDomain: process.env.CLUSTER_DOMAIN,
      dbName: process.env.DB_NAME,
      dbUser: process.env.DB_USER,
      dbPass: process.env.DB_PASS,
      //https://mongodb.github.io/node-mongodb-native/3.1/api/MongoClient.html for options
      options: {}
    },
    twilio: {
      sendGridAPIKey: process.env.SENDGRID_API_KEY,
      noReplyEmail: process.env.NO_REPLY_EMAIL
    }
  }
};

export default config;
