const winston = require('winston');
const { combine, timestamp, label, prettyPrint, colorize } = winston.format;
require('dotenv').config();

const LOGGER = winston.createLogger({
    format: combine(
        label({ label: process.env.NODE_ENV || 'developemt'}),
        timestamp(),
        prettyPrint(),
        colorize()
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
        //new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.Console(),
        //new winston.transports.File({ filename: 'logs/info.log', level: 'info' }),
    ],
});

module.exports = LOGGER;
