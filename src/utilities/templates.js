'use strict';

import Mailgen from 'mailgen';
import config from '../config';

const { CMS_HOST } = config;

const mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: 'Sheen Magazine',
    link: 'http://www.sheenmagazine.com/'
  }
});

export const generateOTPCodeHtml = (user, otpCode) => {
  const { fullName, email, isAdmin } = user;
  const payload = {
    body: {
      name: fullName,
      intro: ' Thank you for choosing Sheen Magazine.',
      action: {
        instructions:
          'Use the following One Time Passcode (OTP) to complete your password reset procedures. OTP is valid for 15 minutes.',
        button: {
          color: '#22BC66',
          text: isAdmin ? 'Verify OTP' : otpCode,
          ...(isAdmin && {
            link: `${CMS_HOST}/verifyOTP?otpCode=${otpCode}&email=${email}`
          })
        }
      }
    }
  };

  // Generate an HTML email with the provided contents
  return mailGenerator.generate(payload);
};

export const generatePasswordResetHtml = user => {
  const { fullName, isAdmin } = user;
  const payload = {
    body: {
      name: fullName,
      intro: `Thank you for choosing Sheen Magazine. You request to reset your password was successful. ${
        !isAdmin
          ? 'Please login into Sheen Magazine mobile application with your new password'
          : ''
      }`,
      ...(isAdmin && {
        action: {
          instructions:
            'To get started with Sheen Magazine CMS_HOST, Please, click the link below to log into CMS_HOST:',
          button: {
            color: '#22BC66', // Optional action button color
            text: 'Login',
            link: `${CMS_HOST}/login`
          }
        }
      })
    }
  };

  // Generate an HTML email with the provided contents
  return mailGenerator.generate(payload);
};
