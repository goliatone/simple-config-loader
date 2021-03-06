# simple-config-loader

Simple configuration loader module for Node.js applications.

## Getting Started
Install the module with: `npm install simple-config-loader`.

This module will load all javascript files found in a `config` directory, and merge them into a single object. It will use the files name as it's key.

By default, this module loads the `package.json` file and makes it available under the `package` key. It also provides an `environment` key that takes the value of `process.env.NODE_ENV`.

Consider a file `config/app.js` with the following `exports`:
```js
module.exports = {
    name: '${package.name}',
    version: '${package.version}',
};
```
This will be available in the `app` key of the final configuration object.

It also supports interpolating values that contain references to other values in the final configuration object.

So, the expression `'${package.name}'` will be resolved by looking up the `name` attribute of the `package` key.

**NOTE** You can use [envset][envset] to manage your environment variables.

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
    //package:... deleted
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

### Options

```js
var DEFAULTS = {
    strict: true,
    logger: console,
    autoinitialize: true,
    config: {
        environment: process.env.NODE_ENV || 'production'
    },
    packagePath: '../package',
    configsPath: './',
    basepath: _resolve(_join(__dirname, '../../../')),
    dirname: 'config',
    globOptions: {
        matchPatterh: '**.js',
        ignorePattern: 'index.js'
    },
    getConfigFiles: function(){
        var target = _join(this.basepath, this.dirname, this.globOptions.matchPatterh);
        var ignore = _join(this.basepath, this.dirname, this.globOptions.ignorePattern);
        var files = glob.sync(target, {ignore: ignore});

        if(!files || files.length === 0){
            var msg = 'Not config files found at ' + target;
            if(this.strict) throw new Error(msg);
            else console.log(msg);
        }
        return files;
    },
    getPackage: function(data, path){
        try{
            data.package = require(path);
            delete data.package.readme;
        } catch(e) {
            this.logger.error('Error loading package');
            data = {};
        }
        return data;
    }
};
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
* 2016-07-26 - V5.1: Pass section name to `afterSolver`
* 2016-10-06 - V6.1: Updated dependencies

## License
Copyright (c) 2016 goliatone  
Licensed under the MIT license.


[envset]: https://github.com/goliatone/envset
