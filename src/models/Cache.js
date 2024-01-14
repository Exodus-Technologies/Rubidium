'use strict';

import mongoose from 'mongoose';
import config from '../config';
import { isProductionEnvironment } from '../utilities/boolean';

const { Schema } = mongoose;
const { sources } = config;
const { expiryTime: expires } = sources.database;

//cache SCHEMA
//  ============================================
const cacheSchema = new Schema({
  key: {
    type: String,
    required: true,
    index: true
  },
  body: {
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
cacheSchema.set('autoCreate', !isProductionEnvironment());

/**
 * Create cache model out of cacheSchema
 */
const Cache = mongoose.model('Cache', cacheSchema);

export default Cache;
