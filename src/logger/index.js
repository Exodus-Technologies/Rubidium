'use strict';

import winston from 'winston';
import WinstonCloudWatch from 'winston-cloudwatch';
import config from '../config';

const { NODE_ENV, sources } = config;
const { cloudWatchLogGroup, accessKeyId, secretAccessKey, region } =
  sources.aws;

const logger = new winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      timestamp: true,
      colorize: true
    })
  ]
});

if (NODE_ENV === 'production') {
  logger.add(
    new WinstonCloudWatch({
      logGroupName: cloudWatchLogGroup,
      logStreamName: `${cloudWatchLogGroup}-${NODE_ENV}`,
      awsAccessKeyId: accessKeyId,
      awsSecretKey: secretAccessKey,
      awsRegion: region,
      messageFormatter: ({ level, message }) => `[${level}] : ${message}`
    })
  );
}

export default logger;
