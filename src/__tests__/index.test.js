const {
  filter, layout, log4js, match,
} = require('../index');

describe('match', () => {
  const testData = {
    empty: {
      expected: false,
      key: 'test',
      config: {},
    },
    'exact match': {
      expected: true,
      key: 'test',
      config: {
        exact: ['test'],
      },
    },
    'exact mismatch': {
      expected: false,
      key: 'test1',
      config: {
        exact: ['test'],
      },
    },
    'exact case-insensitive match': {
      expected: true,
      key: 'TeSt',
      config: {
        exact: ['tesT'],
      },
    },
    'regex match': {
      expected: true,
      key: '1test2',
      config: {
        regex: ['test'],
      },
    },
    'regex mismatch': {
      expected: false,
      key: '1test2',
      config: {
        regex: ['^test'],
      },
    },
    'regex case-insensitive match': {
      expected: true,
      key: '1TesT2',
      config: {
        regex: ['teSt'],
      },
    },
  };

  Object.entries(testData)
    .forEach(
      ([name, { expected, key, config }]) => test(
        name, () => expect(
          match(key, config),
        ).toBe(expected),
      ),
    );
});

describe('filter', () => {
  const testData = {
    empty: {
      expected: { test: 'data' },
      data: { test: 'data' },
      config: {},
    },
    exact: {
      expected: { test: '******' },
      data: { test: 'data' },
      config: { exact: ['test'] },
    },
    deep: {
      expected: { foo: { bar: { test: '******' } } },
      data: { foo: { bar: { test: 'data' } } },
      config: { exact: ['test'] },
    },
    middle: {
      expected: { foo: { test: '******' } },
      data: { foo: { test: { bar: 'data' } } },
      config: { exact: ['test'] },
    },
    string: {
      expected: 'test',
      data: 'test',
      config: { exact: ['test'] },
    },
    array: {
      expected: ['test'],
      data: ['test'],
      config: { exact: ['test'] },
    },
    'object array': {
      expected: [{ test: '******' }, { data: 'data' }],
      data: [{ test: 'test' }, { data: 'data' }],
      config: { exact: ['test'] },
    },
  };

  Object.entries(testData)
    .forEach(
      ([name, { expected, data, config }]) => test(
        name, () => expect(
          filter(data, config),
        ).toEqual(expected),
      ),
    );
});

describe('layout', () => {
  test(
    'Example in README', () => {
      // Add a filter to catch "password" key
      layout.exact = ['password'];

      // Add a filter to catch any key containing "email"
      layout.regex = ['email'];

      log4js.configure({
        appenders: {
          stdout: {
            type: 'stdout',
            layout,
          },
        },
        categories: {
          default: {
            appenders: ['stdout'],
            level: 'debug',
          },
        },
      });

      const logger = log4js.getLogger();
      logger.debug({
        username: 'test', password: 'hide-me', userEmail: 'hide-me@example.com',
      });

      expect(true).toBe(true);
    },
  );
});
