This is a log filtering plugin for [log4js-node](https://log4js-node.github.io/log4js-node/).

## Installation

```
npm install --save log4js-filters
```

## Usage

```javascript
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
// [DEBUG] default - { username: 'test', password: '******', userEmail: '******' }
```

## TODO
* Vanilla js
* Minimum version requirements
* Customizable filtering actions (change to '******' for now)
* Customizable follow-up layout (basic layout for now)
* A bit further house keeping
* v1.0.0
