/*
import winston from "winston";

const logFormat = winston.format.printf(
  ({ level, message, timestamp, ...meta }) => {
    // return `[${timestamp}] ${level.toUpperCase()}: ${message} ${
    //   Object.keys(meta).length ? JSON.stringify(meta) : ""
    // }`;
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...meta,
    });
  }
);

export const serverLogger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
    logFormat
  ),
  defaultMeta: { testMetaData: "Hello Test" },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/app.log" }),
  ],
});
*/

import winston from "winston";
import fs from "fs";
import path from "path";

const LOG_DIR = path.resolve(process.cwd(), "../server-logs"); // outside project folder

// Ensure directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Define Winston format
const logFormat = winston.format.printf(
  ({ level, message, timestamp, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...meta,
    });
  }
);

// Singleton Winston instance
let loggerInstance: winston.Logger | null = null;

function createWinstonLogger() {
  if (loggerInstance) return loggerInstance;

  const transports: winston.transport[] = [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        logFormat
      ),
    }),
    new winston.transports.File({
      filename: path.join(LOG_DIR, "app.log"),
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        logFormat
      ),
    }),
  ];

  loggerInstance = winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json()
    ),
    defaultMeta: { app: "bezs" },
    transports,
  });

  return loggerInstance;
}

// Wrapper methods
const winstonLogger = createWinstonLogger();

export const serverLogger = {
  info: (message: string, meta?: Record<string, unknown>) => {
    winstonLogger.info(message, meta);
  },
  error: (message: string, meta?: Record<string, unknown>) => {
    winstonLogger.error(message, meta);
  },
  warn: (message: string, meta?: Record<string, unknown>) => {
    winstonLogger.warn(message, meta);
  },
  debug: (message: string, meta?: Record<string, unknown>) => {
    winstonLogger.debug(message, meta);
  },
  verbose: (message: string, meta?: Record<string, unknown>) => {
    winstonLogger.verbose(message, meta);
  },
};
