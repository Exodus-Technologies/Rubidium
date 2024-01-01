'use strict';

import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';
import { isProduction } from '../utilities/boolean';

const { Schema } = mongoose;
const autoIncrement = mongooseSequence(mongoose);

//CATEGORY SCHEMA
//  ============================================
const categorySchema = new Schema(
  {
    name: { type: String, required: true }
  },
  { timestamps: true }
);

/**
 * Set the autoCreate option on models if not on production
 */
categorySchema.set('autoCreate', !isProduction());

/**
 * Increments categoryId everytime an instances is created
 */
categorySchema.plugin(autoIncrement, { inc_field: 'categoryId' });

/**
 * Create Category model out of categorySchema
 */
const Category = mongoose.model('Category', categorySchema);

export default Category;
