'use strict';

export const BASE_URL = '/sheen-service';

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

export const WINDOW_MS = 10 * 60 * 1000; // 15 minutes

export const TOKEN_EXPIRY = 60;

export const CUSTOM_ALPHABET =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const PASSWORD_RESET_REQUEST_SUBJECT = 'Password Reset Request';

export const PASSWORD_RESET_SUCCESS_SUBJECT = 'Password Reset Successfully';

export const STRONG_PASSWORD_VALIDATIONS_REGEX =
  '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-]).{8,}$';

export const PASSWORD_VALIDATION_MESSAGE =
  'Please enter a password at least 8 characters, at least one uppercase letter, one lowercase letter, and one special character.';

export const VIDEO_SUBSCRIPTION_TYPE = 'video';

export const ISSUE_SUBSCRIPTION_TYPE = 'issue';

export const DEFAULT_TIME_FORMAT = 'YYYY-MM-DD[T]HH:mm:ss';

export const SUBSCRIPTION_TYPES = ['issue', 'video'];

export const RECURRING_TYPES = ['one-time', 'monthly', 'yearly'];

export const SUBSCRIPTION_MAX_LIMIT = 6;

export const PLATFORMS = ['android', 'ios', 'web'];

export const DEFAULT_VIDEO_FILE_EXTENTION = 'mp4';

export const DEFAULT_THUMBNAIL_FILE_EXTENTION = 'jpeg';

export const AUTHOR = 'Sheen Magazine';

export const DOWNLOAD_LINK_SUCCESS_STATUS = 'ok';

export const VIDEO_PUBLISHED_STATUS = 'PUBLISHED';

export const VIDEO_DRAFT_STATUS = 'DRAFT';

export const BAMBUSER_BROADCAST_ARCHIVED_STATUS = 'archived';

export const BAMBUSER_API_VERSION_ONE = 'v1';

export const BAMBUSER_API_VERSION_TWO = 'v2';

export const BAMBUSER_API_TIMEOUT = 600000; //10 mins

export const DEFAULT_PDF_FILE_EXTENTION = 'pdf';

export const ISSUE_MIME_TYPE = 'application/pdf';

export const ISSUE_MIME_TYPES = ['application/pdf', 'application/octet-stream'];

export const DEFAULT_COVERIMAGE_FILE_EXTENTION = 'jpeg';

export const COVERIMAGE_MIME_TYPES = ['image/jpeg', 'image/png'];

export const MAX_FILE_SIZE_PDF = 1000 * 1024 * 1024; //1000 MB
