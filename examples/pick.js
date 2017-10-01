'use strict';

let config = require('..')({
    basepath: __dirname,
    globOptions: {
        matchPatterh: '+(orm.js|app.js)'
    }
});

let handler = {
    get: function (receiver, name) {
        console.log('name', name);
        return receiver.data[name];
    }
};

let c = new Proxy(config, handler);

/*
 * We are only loading orm.js and
 * app.js meaning that amqp.js and
 * cli.js should be ignored.
 */
console.log(JSON.stringify(c.amqp, null, 4));
console.log(JSON.stringify(c.cli, null, 4));

console.log(JSON.stringify(c.orm.redis.port, null, 4));
console.log(JSON.stringify(c.app.redisConfig, null, 4));
