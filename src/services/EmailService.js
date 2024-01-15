'use strict';

import config from '../config';
import logger from '../logger';
import { sgMailClient } from '../twilio';

const { CMS } = config;

exports.sendMail = async (toEmail, subject, content) => {
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

exports.generateOTPCodeHtml = (user, otpCode) => {
  const { fullName, email, isAdmin } = user;
  return `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a
        href="http://www.sheenmagazine.com/"
        style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600"
      >
        Sheen Magazine
      </a>
    </div>
    <p style="font-size:1.1em">Hi ${fullName},</p>
    <p>
      Thank you for choosing Sheen Magazine. Use the following One Time Passcode (OTP) to complete
      your password reset procedures. OTP is valid for 15 minutes.
    </p>
    <h2 style="background: #00466a;margin: 0 auto; width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">
      ${
        !isAdmin
          ? otpCode
          : `
          <a 
            href="${CMS}/verifyOTP?otpCode=${otpCode}&email=${email}"
            style="text-decoration:none;font-weight:600"
          >
          Verify OTP
          </a>`
      }
    </h2>
    <p style="font-size:0.9em;">
      Regards,
      <br />
       <a
        href="http://www.sheenmagazine.com/"
        style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600"
      >
        Sheen Magazine
      </a>
    </p>
  </div>
</div>`;
};

exports.generatePasswordResetHtml = user => {
  const { fullName, isAdmin } = user;
  return `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:100%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a
        href="http://www.sheenmagazine.com/"
        style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600"
      >
        Sheen Magazine
      </a>
    </div>
    <p style="font-size:1.1em">Hi ${fullName},</p>
    <p>
      Thank you for choosing Sheen Magazine. You request to reset your password was successful.
    </p>
    <h2 style="background: #00466a;margin: 0 auto; width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">
      ${
        !isAdmin
          ? `<p> You request to reset your password was successful. </p>
             <p> Please login into Sheen Magazine mobile application with your new password. </p>`
          : `<p> Please, click the link below to log into CMS.</p>
            <a 
            href="${CMS}/login" 
            style="text-decoration:none;font-weight:600">
            Login
            </a>`
      }
    </h2>
    <p style="font-size:0.9em;">
      Regards,
      <br />
       <a
        href="http://www.sheenmagazine.com/"
        style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600"
      >
        Sheen Magazine
      </a>
    </p>
  </div>
</div>`;
};
