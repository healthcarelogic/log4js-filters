const log4js = require('log4js');
const { basicLayout } = require('log4js/lib/layouts');

const match = (key, { exact = [], regex = [] }) => exact.find(matcher => key.toLowerCase() === matcher.toLowerCase()) !== undefined ||
  regex.find(matcher => key.match(new RegExp(matcher, 'i'))) !== undefined;

const filter = (data, config) => {

  if (!data || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(entry => filter(entry, config));
  }

  return Object.entries(data).reduce((prev, [key, value]) => {
    if (match(key, config)) {
      return { ...prev, [key]: '******' };
    }
    return { ...prev, [key]: filter(value, config) };
  }, {});
};

log4js.addLayout('log4js-filters', (config) => (log) => {
  const { data } = log;
  const newLog = { ...log, data: filter(data, config) };
  return basicLayout(newLog);
});

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
