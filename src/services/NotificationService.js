'use strict';

import logger from '../logger';
import { sgMailClient } from '../twilio';

exports.sendEmail = async (toEmail, subject, content) => {
  const params = {
    to: toEmail,
    from: noReplyEmail, // Use the email address or domain you verified above
    subject,
    html: content
  };

  try {
    const emailResponses = await sgMailClient.send(params);
    const [response] = emailResponses;
    if (response.statusCode < 300) {
      resolve();
    }
  } catch (err) {
    logger.error(`Error send email to user: ${toEmail}`, err);
    reject(err);
  }
};
