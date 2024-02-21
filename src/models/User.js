'use strict';

import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';
import config from '../config';
import { STATES } from '../constants';
import { isProductionEnvironment } from '../utilities/boolean';

const { Schema, model } = mongoose;
const autoIncrement = mongooseSequence(mongoose);
const { HASH_SALT } = config;

//USER SCHEMA
//  ============================================
const userSchema = new Schema(
  {
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      match: /\S+@\S+\.\S+/,
      index: true
    },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    dob: { type: String },
    gender: { type: String },
    city: { type: String },
    state: {
      type: String,
      enum: STATES
    },
    zipCode: { type: String },
    isAdmin: {
      type: Boolean,
      default: false
    },
    lastLoggedIn: {
      type: Date,
      default: Date.now()
    },
    role: [
      {
        type: Schema.ObjectId,
        ref: 'Role'
      }
    ]
  },
  { timestamps: true }
);

//HASH PASSWORD
// ============================================

//Hash password before saving
userSchema.pre('save', function (next) {
  const user = this;

  //Hash password only if the password has been changed or is new
  if (!user.isModified('password')) return next();

  //Generate Salt
  const salt = bcrypt.genSaltSync(HASH_SALT);
  const hash = bcrypt.hashSync(user.password, salt);
  user.password = hash;
  next();
});

userSchema.pre('findOneAndUpdate', async function (next) {
  const user = this;
  try {
    //Hash password only if the password has been changed or is new
    if (user._update.password) {
      const salt = bcrypt.genSaltSync(HASH_SALT);
      const hash = bcrypt.hashSync(user._update.password, salt);
      user._update.password = hash;
    }
    next();
  } catch (err) {
    return next(err);
  }
});

//Create method to compare a given password with the database hash
userSchema.methods.getIsValidPassword = function (password) {
  const user = this;
  return bcrypt.compareSync(password, user.password);
};

/**
 * Set the autoCreate option on models if not on production
 */
userSchema.set('autoCreate', !isProductionEnvironment());

/**
 * Increments userId everytime an instances is created
 */
userSchema.plugin(autoIncrement, { inc_field: 'userId' });

/**
 * Create User model out of userSchema
 */
const User = model('User', userSchema);

export default User;
