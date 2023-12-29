'use strict';

import { v4 as uuidv4 } from 'uuid';

export const createSubscriptionId = () => {
  return `subscription-${uuidv4()}`;
};

export const createVideoSubId = () => {
  return `video-${uuidv4()}`;
};

export const createIssueSubId = () => {
  return `issue-${uuidv4()}`;
};
