import winston, { format } from "winston";
import "winston-daily-rotate-file";
import config from "../../config";
import { ServerEnvOptions } from "../../enums/config.enum";

let errorLogger: winston.Logger;

let requestLogger: winston.Logger;

if (
  [
    ServerEnvOptions.DEVELOPMENT,
    ServerEnvOptions.PRODUCTION,
    ServerEnvOptions.STAGING,
    ServerEnvOptions.TESTING,
  ].includes(config.NODE.ENV)
) {
  errorLogger = winston.createLogger({
    transports: [
      new winston.transports.DailyRotateFile({
        filename: "%DATE%.log",
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        dirname: ".logs/error",
        maxSize: "20m",
        maxFiles: "15d",
      }),
    ],
    level: "error",
    format: format.combine(
      format.timestamp(),
      format.printf(
        ({ timestamp, level, message }) =>
          `{"time":"${timestamp}", "level":"${level}", "message": "${message}"}`
      )
    ),
  });

  requestLogger = winston.createLogger({
    transports: [
      new winston.transports.DailyRotateFile({
        filename: "%DATE%.log",
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        dirname: ".logs/requests",
        maxSize: "20m",
        maxFiles: "15d",
      }),
    ],
    // level: "info",
    format: format.combine(
      format.timestamp(),
      format.printf(
        ({ timestamp, level, message }) =>
          `{"time":"${timestamp}", "level":"${level}", "message": "${message}"}`
      )
    ),
  });
}

export { errorLogger, requestLogger };
