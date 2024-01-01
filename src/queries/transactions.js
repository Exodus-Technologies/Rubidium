'use strict';

import models from '../models';
import logger from '../logger';

export const saveTransaction = async payload => {
  try {
    const { Transaction } = models;
    const transaction = new Transaction(payload);
    await transaction.save();
  } catch (err) {
    logger.error('Error saving transaction data to db: ', err);
  }
};
