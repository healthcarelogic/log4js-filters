# log4js-filters

This is a log filtering plugin for [log4js-node](https://log4js-node.github.io/log4js-node/). It checks log object keys against pre-configured words or regex and hide the log content accordingly. See below for an example.

NOTE: Logs have to be of object form. Strings won't get filtered.

## Installation

```
npm install --save log4js-filters
```

## Usage

```javascript
// Example to filter password and any email in logs.

const { log4js, layout } = require('log4js-filters');

// Add a filter to catch "password" key
layout.exact.push('password');

// Add a filter to catch any key containing "email"
layout.regex.push('email');

log4js.configure({
  appenders: {
    out: {
      type: 'stdout',
      layout
    },
  },
  categories: {
    default: { appenders: ['out'], level: 'debug'},
  },
});

const logger = log4js.getLogger();
logger.debug({ username: 'test', password: 'hide-me', userEmail: 'hide-me@example.com' });
```

Output:

```bash
[DEBUG] default - { username: 'test', password: '******', userEmail: '******' }
```
