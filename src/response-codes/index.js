'use strict';

import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const badRequest = message => {
  return [
    StatusCodes.BAD_REQUEST,
    {
      errors: [
        {
          value: ReasonPhrases.BAD_REQUEST,
          msg: message
        }
      ]
    }
  ];
};

export const unauthorizedRequest = message => {
  return [
    StatusCodes.UNAUTHORIZED,
    {
      errors: [
        {
          value: ReasonPhrases.UNAUTHORIZED,
          msg: message
        }
      ]
    }
  ];
};

export const forbiddenRequest = message => {
  return [
    StatusCodes.FORBIDDEN,
    {
      errors: [
        {
          value: ReasonPhrases.FORBIDDEN,
          msg: message
        }
      ]
    }
  ];
};

export const notFoundRequest = message => {
  return [
    StatusCodes.NOT_FOUND,
    {
      errors: [
        {
          value: ReasonPhrases.NOT_FOUND,
          msg: message
        }
      ]
    }
  ];
};

export const internalServerErrorRequest = message => {
  return [
    StatusCodes.INTERNAL_SERVER_ERROR,
    {
      errors: [
        {
          value: ReasonPhrases.INTERNAL_SERVER_ERROR,
          msg: message
        }
      ]
    }
  ];
};
