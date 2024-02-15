'use strict';

import sgMail from '@sendgrid/mail';
import config from '../config';

const { notification } = config.sources;
const { sendGridAPIKey } = notification.twilio;

const sgMailClient = sgMail.setApiKey(sendGridAPIKey);

export { sgMailClient };
