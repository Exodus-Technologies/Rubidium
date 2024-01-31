'use strict';

import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';
import { isProductionEnvironment } from '../utilities/boolean';

const { Schema } = mongoose;
const autoIncrement = mongooseSequence(mongoose);

//PERMISSION SCHEMA
//  ============================================
const permissionSchema = new Schema(
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
    }
  },

  { timestamps: true }
);

/**
 * Set the autoCreate option on models if not on production
 */
permissionSchema.set('autoCreate', !isProductionEnvironment());

/**
 * Increments permissionId everytime an instances is created
 */
permissionSchema.plugin(autoIncrement, { inc_field: 'permissionId' });

/**
 * Create Permission model out of permissionSchema
 */
const Permission = mongoose.model('Permission', permissionSchema);

export default Permission;
