'use strict';

import mongoose from 'mongoose';
import config from '../config';

const { Schema } = mongoose;
const { NODE_ENV } = config;

//TOKEN SCHEMA
//  ============================================
const transactionSchema = new Schema(
  {
    userId: {
      type: Number,
      ref: 'user'
    },
    transactionId: {
      type: String
    },
    email: {
      type: String
    },
    content: {
      type: String
    },
    response: {
      type: String
    },
    reason: {
      type: String
    }
  },
  { timestamps: true }
);

/**
 * Set the autoCreate option on models if not on production
 */
transactionSchema.set('autoCreate', NODE_ENV !== 'production');

/**
 * Create Transaction model out of transactionSchema
 */
const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
