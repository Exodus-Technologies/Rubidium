'use strict';

import logger from '../logger';
import models from '../models';

export const saveTransaction = async payload => {
  try {
    const { Transaction } = models;
    const transaction = new Transaction(payload);
    const saved = await transaction.save();
    return [null, saved];
  } catch (err) {
    logger.error('Error saving transaction data to db: ', err);
    return [err, null];
  }
};
