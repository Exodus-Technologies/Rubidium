'use strict';

import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';
import { AUTHOR, VIDEO_PUBLISHED_STATUS } from '../constants';
import { isProductionEnvironment } from '../utilities/boolean';
import { createVideoSubId } from '../utilities/strings';

const { Schema, model } = mongoose;
const autoIncrement = mongooseSequence(mongoose);

//VIDEO SCHEMA
//  ============================================
const videoSchema = new Schema(
  {
    subId: {
      type: String,
      default: createVideoSubId(),
      index: true
    },
    title: {
      type: String,
      index: true
    },
    broadcastId: {
      type: String
    },
    url: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    totalViews: {
      type: Number,
      default: 0
    },
    author: {
      type: String,
      default: AUTHOR
    },
    key: {
      type: String,
      required: true
    },
    thumbnail: {
      type: String
    },
    isAvailableForSale: {
      type: Boolean,
      default: true
    },
    duration: {
      type: String
    },
    status: {
      type: String,
      default: VIDEO_PUBLISHED_STATUS
    },
    categories: {
      type: [String]
    }
  },
  { timestamps: true }
);

/**
 * Set the autoCreate option on models if not on production
 */
videoSchema.set('autoCreate', !isProductionEnvironment());

/**
 * Increments videoId everytime an instances is created
 */
videoSchema.plugin(autoIncrement, { inc_field: 'videoId' });

/**
 * Create Video model out of videoSchema
 */
const Video = model('Video', videoSchema);

export default Video;
