'use strict';

import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';
import { isProductionEnvironment } from '../utilities/boolean';

const { Schema, model } = mongoose;
const autoIncrement = mongooseSequence(mongoose);

//PERMISSION SCHEMA
//  ============================================
const roleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    value: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    permissions: [
      {
        type: Schema.ObjectId,
        ref: 'Permission'
      }
    ]
  },
  { timestamps: true }
);

/**
 * Set the autoCreate option on models if not on production
 */
roleSchema.set('autoCreate', !isProductionEnvironment());

/**
 * Increments roleId everytime an instances is created
 */
roleSchema.plugin(autoIncrement, { inc_field: 'roleId' });

/**
 * Create Role model out of roleSchema
 */
const Role = model('Role', roleSchema);

export default Role;
