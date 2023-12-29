'use strict';

const chakram = require('chakram');
const StatusCodes = require('http-status-codes');

const { expect } = chakram;

describe('AuthService', function () {
  it('should provide a simple async testing framework', function () {
    const response = chakram.get('http://localhost:9000/sheen-service/');
    expect(response).to.have.status(StatusCodes.OK);
    expect(response).to.have.header(
      'content-type',
      'application/json; charset=utf-8'
    );
    expect(response).to.have.json({
      message: 'Welcome to Rubidium Service Manager Service!'
    });
    return chakram.wait();
  });
});
