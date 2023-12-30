'use strict';

import winston from 'winston';
import WinstonCloudWatch from 'winston-cloudwatch';
import config from '../config';
import { isProduction } from '../utilities/boolean';

const { NODE_ENV, sources } = config;
const { cloudWatchLogGroup, accessKeyId, secretAccessKey, region } =
  sources.aws;

const loggerTransports = [
  {
    type: 'console',
    options: {
      timestamp: true,
      colorize: true
    }
  }
];

if (isProduction()) {
  loggerTransports.push({
    type: 'cloud-watch',
    options: {
      logGroupName: cloudWatchLogGroup,
      logStreamName: `${cloudWatchLogGroup}-${NODE_ENV}`,
      awsAccessKeyId: accessKeyId,
      awsSecretKey: secretAccessKey,
      awsRegion: region,
      messageFormatter: ({ level, message }) => `[${level}] : ${message}`
    }
  });
}

const createConsoleTransport = options => {
  return new winston.transports.Console(options);
};

const createWinstonCloudWatchTransport = options => {
  return new WinstonCloudWatch(options);
};

const getLoggerTransports = transports => {
  return transports.map(transport => {
    const { type, options } = transport;
    switch (type) {
      case 'console':
        return createConsoleTransport(options);
      case 'cloud-watch':
        return createWinstonCloudWatchTransport(options);
    }
  });
};

const createLoggerFactory = transports => {
  return winston.createLogger({
    transports: getLoggerTransports(transports)
  });
};

export default createLoggerFactory(loggerTransports);
