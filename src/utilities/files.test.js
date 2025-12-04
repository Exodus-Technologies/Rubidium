describe('files utilities', () => {
  test('getFileContentFromPath resolves buffer via mocked fs', async () => {
    jest.resetModules();
    jest.doMock('fs', () => ({
      readFile: (path, cb) => cb(null, Buffer.from('hello')),
      promises: { readFile: async p => Buffer.from('hello') }
    }));
    const { getFileContentFromPath } = require('./files');
    const buf = await getFileContentFromPath('/fake/path');
    expect(Buffer.isBuffer(buf)).toBe(true);
    expect(buf.toString()).toBe('hello');
  });

  test('getFileContentFromPath rejects on error', async () => {
    jest.resetModules();
    jest.doMock('fs', () => ({
      readFile: (path, cb) => cb(new Error('nope')),
      promises: {
        readFile: async p => {
          throw new Error('nope');
        }
      }
    }));
    const { getFileContentFromPath } = require('./files');
    await expect(getFileContentFromPath('/bad/path')).rejects.toBeInstanceOf(
      Error
    );
  });

  test('getContentFromURL resolves content.file for http', async () => {
    jest.resetModules();
    // provide global StatusCodes and video duration helper used by files.js
    const oldStatus = global.StatusCodes;
    const oldGetVid = global.getVideoDurationInSeconds;
    global.StatusCodes = { OK: 200 };
    global.getVideoDurationInSeconds = async () => 10;

    jest.doMock('follow-redirects', () => ({
      http: {
        get: (url, cb) => {
          const resp = {
            statusCode: 200,
            statusMessage: 'OK',
            on: (ev, h) => {
              if (ev === 'data') h(Buffer.from('http-file'));
              if (ev === 'end') h();
            }
          };
          const req = { on: () => {} };
          cb(resp);
          return req;
        }
      },
      https: {
        get: (url, cb) => {
          const resp = {
            statusCode: 200,
            statusMessage: 'OK',
            on: (ev, h) => {
              if (ev === 'data') h(Buffer.from('https-file'));
              if (ev === 'end') h();
            }
          };
          const req = { on: () => {} };
          cb(resp);
          return req;
        }
      }
    }));

    const { getContentFromURL } = require('./files');
    const res = await getContentFromURL('http://example.com/file');
    expect(res.file.toString()).toBe('http-file');

    // restore globals
    global.StatusCodes = oldStatus;
    global.getVideoDurationInSeconds = oldGetVid;
  });

  test('getVideoContentFromURL returns file and duration for https', async () => {
    jest.resetModules();
    const oldStatus = global.StatusCodes;
    const oldGetVid = global.getVideoDurationInSeconds;
    global.StatusCodes = { OK: 200 };
    global.getVideoDurationInSeconds = async () => 123;

    jest.doMock('follow-redirects', () => ({
      http: {
        get: (url, cb) => {
          const resp = {
            statusCode: 200,
            on: (ev, h) => {
              if (ev === 'data') h(Buffer.from('nope'));
              if (ev === 'end') h();
            }
          };
          const req = { on: () => {} };
          cb(resp);
          return req;
        }
      },
      https: {
        get: (url, cb) => {
          const resp = {
            statusCode: 200,
            on: (ev, h) => {
              if (ev === 'data') h(Buffer.from('video-file'));
              if (ev === 'end') h();
            }
          };
          const req = { on: () => {} };
          cb(resp);
          return req;
        }
      }
    }));

    const { getVideoContentFromURL } = require('./files');
    const r = await getVideoContentFromURL('https://example.com/video');
    expect(r.file.toString()).toBe('video-file');
    expect(r.duration).toBe(123);

    global.StatusCodes = oldStatus;
    global.getVideoDurationInSeconds = oldGetVid;
  });
});
