'use strict';

import sgMail from '@sendgrid/mail';
import config from '../config';

const { sendGridAPIKey, noReplyEmail } = config.sources.twilio;

sgMail.setApiKey(sendGridAPIKey);

export const sendEmailNotification = (toEmail, subject, content) => {
  return new Promise(async (resolve, reject) => {
    const params = {
      to: toEmail,
      from: noReplyEmail, // Use the email address or domain you verified above
      subject,
      html: content
    };

    try {
      const emailResponses = await sgMail.send(params);
      const [response] = emailResponses;
      if (response.statusCode < 300) {
        resolve();
      }
    } catch (err) {
      console.log(`Error send email to user: ${toEmail}`, err);
      reject(err);
    }
  });
};
