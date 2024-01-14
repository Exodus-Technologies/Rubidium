'use strict';

import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';
import config from '../config';
import { isProductionEnvironment } from '../utilities/boolean';

const { Schema } = mongoose;
const { sources } = config;
const { expiryTime: expires } = sources.database;

const autoIncrement = mongooseSequence(mongoose);

//TOKEN SCHEMA
//  ============================================
const optCodeSchema = new Schema({
  userId: {
    type: Number,
    required: true,
    ref: 'user',
    index: true
  },
  email: {
    type: String,
    required: true,
    index: true
  },
  otpCode: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires // this is the expiry time in seconds (15 minutes)
  }
});

/**
 * Set the autoCreate option on models if not on production
 */
optCodeSchema.set('autoCreate', !isProductionEnvironment());

/**
 * Increments optId everytime an instances is created
 */
optCodeSchema.plugin(autoIncrement, { inc_field: 'optCodeId' });

/**
 * Create Code model out of optCodeSchema
 */
const Code = mongoose.model('Code', optCodeSchema);

export default Code;
