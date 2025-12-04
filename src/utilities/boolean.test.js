import {
  convertArgToBoolean,
  isDevelopmentEnvironment,
  isProductionEnvironment
} from './boolean';

describe('boolean utilities', () => {
  test('convertArgToBoolean recognizes common true/false values', () => {
    expect(convertArgToBoolean('true')).toBe(true);
    expect(convertArgToBoolean('yes')).toBe(true);
    expect(convertArgToBoolean('1')).toBe(true);
    expect(convertArgToBoolean('on')).toBe(true);

    expect(convertArgToBoolean('false')).toBe(false);
    expect(convertArgToBoolean('no')).toBe(false);
    expect(convertArgToBoolean('0')).toBe(false);
    expect(convertArgToBoolean(null)).toBe(false);
    expect(convertArgToBoolean(undefined)).toBe(false);

    expect(convertArgToBoolean('random')).toBe(true);
    expect(convertArgToBoolean(0)).toBe(false);
  });

  test('environment helpers respond to NODE_ENV', () => {
    const old = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    expect(isProductionEnvironment()).toBe(true);
    expect(isDevelopmentEnvironment()).toBe(false);

    process.env.NODE_ENV = 'development';
    expect(isProductionEnvironment()).toBe(false);
    expect(isDevelopmentEnvironment()).toBe(true);

    process.env.NODE_ENV = old;
  });
});
