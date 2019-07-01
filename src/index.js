const log4js = require('log4js');
const { basicLayout } = require('log4js/lib/layouts');

/**
 * Test key string against matchers
 *
 * @param {string} key
 * @param {array} exact
 * @param {array} regex
 *
 * @returns {boolean} true if matches and therefore should be filtered
 */
const match = (key, { exact = [], regex = [] }) => exact.find(
  matcher => key.toLowerCase() === matcher.toLowerCase(),
) !== undefined
  || regex.find(matcher => key.match(new RegExp(matcher, 'i'))) !== undefined;

/**
 * Recursively filter log data.
 * If data is of simple type, return as is.
 * If data is an array, filter each element.
 * If data is an object, filter against fields. If not filtered, filter each value.
 *
 * @param {any} data
 * @param {object} config
 *
 * @returns {any}
 */
const filter = (data, config) => {
  if (!data || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(entry => filter(entry, config));
  }

  return Object.entries(data)
    .reduce((prev, [key, value]) => {
      if (match(key, config)) {
        return {
          ...prev, [key]: '******',
        };
      }

      return {
        ...prev, [key]: filter(value, config),
      };
    }, {});
};

// Add filters as a new layout. No side effect unless one starts to use it.
log4js.addLayout('log4js-filters', config => (log) => {
  const { data } = log;
  const newLog = {
    ...log, data: filter(data, config),
  };

  return basicLayout(newLog);
});

// Start with empty matchers.
const layout = {
  type: 'log4js-filters',
  exact: [],
  regex: [],
};

module.exports = {
  layout,
  log4js,
  match,
  filter,
};
