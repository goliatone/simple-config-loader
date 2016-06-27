module.exports = {
    database: '${app.name}',
    redis:{
        port: 27012,
        host: process.env.NODE_REDIS_HOST,
        auth: process.env.NODE_REDIS_PORT
    }
};
