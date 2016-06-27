# simple-config-loader

Simple configuration loader module for Node.js applications.

## Getting Started
Install the module with: `npm install simple-config-loader`


## Example
If you have three files inside a `config` directory:

**app.js**
```js
module.exports = {
    name: '${package.name}',
    version: '${package.version}',
};
```

**orm.js**
```js
module.exports = {
    database: '${app.name}',
    redis:{
        port: 27012,
        host: process.env.NODE_REDIS_HOST,
        auth: process.env.NODE_REDIS_PORT
    }
};
```

**amqp.js**
```js
module.exports = {
    topic: '${app.name}.updates',
    exchange: '${app.name}.${environment}',
    url: process.env.NODE_AMQP_URL
};

module.exports.afterSolver = function(config){
    config.set('amqp.amqp', require('amqp'));
};
```

```javascript
var config = require('..')({
    basepath: __dirname,
    packagePath: '../package'
});

//remove noise...
delete config.data.package;

console.log(JSON.stringify(config.data, null, 4));
```

The output you get:

```js
{
    "environment": "production",
    "amqp": {
        "topic": "simple-config-loader.updates",
        "exchange": "simple-config-loader.production",
        "url": "amqp://localhost:34579/xhflmar"
    },
    "app": {
        "name": "simple-config-loader",
        "version": "0.0.0"
    },
    "orm": {
        "database": "simple-config-loader",
        "redis": {
            "port": 27012,
            "host": "192.168.23.3",
            "auth": "admin"
        }
    }
}
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2016 goliatone  
Licensed under the MIT license.
