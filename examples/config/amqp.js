module.exports = {
    topic: '${app.name}.updates',
    exchange: '${app.name}.${environment}',
    url: process.env.NODE_AMQP_URL
};
