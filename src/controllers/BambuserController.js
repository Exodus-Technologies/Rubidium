'use strict';

import { BambuserService } from '../services';

exports.getApplicationId = async (req, res, next) => {
  try {
    const { query } = req;
    const [statusCode, response] = await BambuserService.getApplicationId(
      query
    );
    res.status(statusCode).send(response);
  } catch (err) {
    console.log(`Error with retrieving application id: `, err);
    next(err);
  }
};

exports.webHookCallback = async (req, res, next) => {
  try {
    const { eventId, action } = req.body;
    if (eventId) {
      if (action !== 'remove') {
        const [statusCode] = await BambuserService.webHookCallback(req.body);
        if (statusCode === StatusCodes.OK) {
          res.status(StatusCodes.OK).end();
        }
      }
    }
    res.status(StatusCodes.OK).end();
  } catch (err) {
    console.log(`Error with invoking webhook for broadcast details: `, err);
    next(err);
  }
};
