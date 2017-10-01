"use strict";

let config = require('..')({
    basepath: __dirname,
    packagePath: '../package'
});

let handler = {
    get: function (receiver, name) {
        console.log('name', name);
        return receiver.data[name];
    }
};

let c = new Proxy(config, handler);

/*
 * "development" by default. You can set
 * value in options or when calling node:
 *
 * `NODE_ENV=production node index.js`
 */
console.log('App running environment: %s', c.environment);

console.log(JSON.stringify(c.amqp, null, 4));
console.log(JSON.stringify(c.cli, null, 4));
console.log(JSON.stringify(c.orm.redis.port, null, 4));
console.log(JSON.stringify(c.app.redisConfig, null, 4));
