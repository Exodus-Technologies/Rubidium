'use strict';

import { v4 as uuidv4 } from 'uuid';

export const createSubscriptionId = () => {
  return `subscription-${uuidv4()}`;
};
