'use strict';

export const STATES = [
  'AL',
  'AK',
  'AS',
  'AZ',
  'AR',
  'CA',
  'CO',
  'CT',
  'DE',
  'DC',
  'FM',
  'FL',
  'GA',
  'GU',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MH',
  'MD',
  'MA',
  'MI',
  'MN',
  'MS',
  'MO',
  'MT',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'MP',
  'OH',
  'OK',
  'OR',
  'PW',
  'PA',
  'PR',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VI',
  'VA',
  'WA',
  'WV',
  'WI',
  'WY'
];

export const windowMs = 15 * 60 * 1000; // 15 minutes

export const TOKEN_EXPIRY = 15;

export const PASSWORD_RESET_REQUEST_SUBJECT = 'Password Reset Request';

export const PASSWORD_RESET_SUCCESS_SUBJECT = 'Password Reset Successfully';

export const PASSWORD_REGEX = '^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$';

export const VIDEO_SUBSCRIPTION_TYPE = 'video';

export const ISSUE_SUBSCRIPTION_TYPE = 'issue';

export const DEFAULT_TIME_FORMAT = 'YYYY-MM-DD[T]HH:mm:ss';

export const SUBSCRIPTION_TYPES = ['issue', 'video'];

export const RECURRING_TYPES = ['one-time', 'monthly', 'yearly'];

export const SUBSCRIPTION_MAX_LIMIT = 6;
