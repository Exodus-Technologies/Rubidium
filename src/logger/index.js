'use strict';

import winston from 'winston';
import WinstonCloudWatch from 'winston-cloudwatch';
import config from '../config';
import { isProductionEnvironment } from '../utilities/boolean';

const { NODE_ENV, sources } = config;
const { region } = sources.aws;
const { cloudAccessKeyId, cloudSecretAccessKey, logGroupName } =
  sources.aws.cloudWatch;

const { splat, combine, timestamp, printf, colorize } = winston.format;

const getLogStreamName = () => {
  return `${logGroupName}-${NODE_ENV}`;
};

// meta param is ensured by splat()
const myFormat = printf(({ timestamp, level, message, meta }) => {
  return `${timestamp} ${level}: ${message} ${
    meta ? JSON.stringify(meta) : ''
  }`;
});

const loggerTransports = [
  {
    type: 'console',
    options: {
      timestamp: true,
      colorize: true
    }
  }
];

if (isProductionEnvironment()) {
  loggerTransports.push({
    type: 'cloud-watch',
    options: {
      logGroupName: logGroupName,
      logStreamName: getLogStreamName(),
      awsAccessKeyId: cloudAccessKeyId,
      awsSecretKey: cloudSecretAccessKey,
      awsRegion: region,
      messageFormatter: ({ level, message }) => `[${level}]: ${message}`
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
    format: combine(timestamp(), colorize(), splat(), myFormat),
    transports: getLoggerTransports(transports)
  });
};

export default createLoggerFactory(loggerTransports);
