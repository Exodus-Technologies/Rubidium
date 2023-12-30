'use strict';

import fs from 'fs';
import { http, https } from 'follow-redirects';
import logger from '../logger';

export const getFileContentFromPath = path => {
  return new Promise((resolve, reject) => {
    try {
      fs.readFile(path, (err, buffer) => {
        if (err) {
          reject(err);
        }
        resolve(buffer);
      });
    } catch (err) {
      logger.error(`Error getting file: ${path} `, err);
      reject(err);
    }
  });
};

export const getContentFromURL = url => {
  return new Promise((resolve, reject) => {
    let client = http;

    if (url.toString().indexOf('https') === 0) {
      client = https;
    }

    const request = client.get(url, resp => {
      if (resp.statusCode === StatusCodes.OK) {
        const chunks = [];
        resp.on('data', chunk => {
          chunks.push(chunk);
        });
        resp.on('end', async () => {
          const content = { file: Buffer.concat(chunks) };
          resolve(content);
        });
      } else {
        reject(
          `Server responded with ${resp.statusCode}: ${resp.statusMessage}`
        );
      }
    });

    request.on('error', err => {
      reject(err.message);
    });
  });
};

export const getVideoContentFromURL = url => {
  return new Promise((resolve, reject) => {
    let client = http;

    if (url.toString().indexOf('https') === 0) {
      client = https;
    }

    client
      .get(url, resp => {
        const chunks = [];

        resp.on('data', chunk => {
          chunks.push(chunk);
        });

        resp.on('end', async () => {
          const content = { file: Buffer.concat(chunks) };
          const duration = await getVideoDurationInSeconds(url);
          content['duration'] = duration;
          logger.info('Finished processing file from url: ', url, content);
          resolve(content);
        });
      })
      .on('error', err => {
        logger.error(`Error getting video data from url: ${url} `, err);
        reject(err);
      });
  });
};
