'use strict';

const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

import config from '../config';

const { subscriptionURI } = config;

exports.deleteSubscriptions = userId => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        `${subscriptionURI}/deleteSubscriptions/${userId}/`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (response.status === 400) {
        console.log(
          `User: ${userId} does not have any subscriptions to delete. Continuing with account deletion.....`
        );
        resolve();
      }
      if (response.status >= 500) {
        reject();
      }
      resolve();
    } catch (err) {
      console.log(`Error deleting subscription by user: ${userId} `, err);
      reject();
    }
  });
};
