'use strict';

import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';

const { Schema } = mongoose;
const autoIncrement = mongooseSequence(mongoose);

import { createIssueSubId } from '../utilities/strings';
import { isProduction } from '../utilities/boolean';

//ISSUE SCHEMA
//  ============================================
const issueSchema = new Schema(
  {
    subId: { type: String, default: createIssueSubId() },
    title: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String, required: true },
    totalViews: { type: Number, default: 0 },
    issueOrder: { type: Number },
    key: { type: String, required: true },
    paid: { type: Boolean, default: true },
    price: { type: Number, default: 5.99 },
    coverImage: { type: String }
  },
  { timestamps: true }
);

/**
 * Set the autoCreate option on models if not on production
 */
issueSchema.set('autoCreate', !isProduction());

/**
 * Increments issueId everytime an instances is created
 */
issueSchema.plugin(autoIncrement, { inc_field: 'issueId' });

/**
 * Create model of Issue to access
 */
const Issue = mongoose.model('Issue', issueSchema);

export default Issue;
