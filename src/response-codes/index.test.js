import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import {
  badRequest,
  forbiddenRequest,
  internalServerErrorRequest,
  notFoundRequest,
  unauthorizedRequest
} from './index';

describe('response-codes helpers', () => {
  test('badRequest returns correct tuple', () => {
    const msg = 'bad';
    const r = badRequest(msg);
    expect(r[0]).toBe(StatusCodes.BAD_REQUEST);
    expect(r[1].errors[0].msg).toBe(msg);
    expect(r[1].errors[0].value).toBe(ReasonPhrases.BAD_REQUEST);
  });

  test('unauthorizedRequest returns correct tuple', () => {
    const msg = 'no auth';
    const r = unauthorizedRequest(msg);
    expect(r[0]).toBe(StatusCodes.UNAUTHORIZED);
    expect(r[1].errors[0].msg).toBe(msg);
  });

  test('forbiddenRequest returns correct tuple', () => {
    const msg = 'forbidden';
    const r = forbiddenRequest(msg);
    expect(r[0]).toBe(StatusCodes.FORBIDDEN);
    expect(r[1].errors[0].value).toBe(ReasonPhrases.FORBIDDEN);
  });

  test('notFoundRequest returns correct tuple', () => {
    const msg = 'not found';
    const r = notFoundRequest(msg);
    expect(r[0]).toBe(StatusCodes.NOT_FOUND);
    expect(r[1].errors[0].msg).toBe(msg);
  });

  test('internalServerErrorRequest returns correct tuple', () => {
    const msg = 'oops';
    const r = internalServerErrorRequest(msg);
    expect(r[0]).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(r[1].errors[0].value).toBe(ReasonPhrases.INTERNAL_SERVER_ERROR);
  });
});
