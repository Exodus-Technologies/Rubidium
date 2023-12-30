'use strict';

import mongoose from 'mongoose';
import { createSubscriptionId } from '../utilities/strings';

const { Schema, model } = mongoose;

import { SUBSCRIPTION_TYPES, RECURRING_TYPES } from '../constants';
import { isProduction } from '../utilities/boolean';

//SUBSCRIPTION SCHEMA
//  ============================================
const subscriptionSchema = new Schema({
  subscriptionId: { type: String, default: createSubscriptionId() },
  userId: { type: Number, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  type: { type: String, required: true, enum: SUBSCRIPTION_TYPES },
  purchaseDate: { type: String },
  recurring: { type: String, enum: RECURRING_TYPES },
  ids: { type: [String] },
  access: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  left: { type: Number }
});

/**
 * Set the autoCreate option on models if not on production
 */
subscriptionSchema.set('autoCreate', !isProduction());

/**
 * Create Subscription model out of subscriptionSchema
 */
const Subscription = model('Subscription', subscriptionSchema);

export default Subscription;
