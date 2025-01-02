import { NextFunction, Request, Response } from "express";
import { SystemError } from "../utils/errors";
import config from "../config";
import { ServerEnvOptions } from "../enums/config.enum";
import apiResponse from "../utils/apiResponse";
import { errorLogger } from "../utils/logger";

class ErrorMiddleware {
  public async errorHandler(
    error: SystemError,
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    const isProduction = config.NODE.ENV === ServerEnvOptions.PRODUCTION;

    let errorCode = error.code || 500;
    let errorMessage: SystemError | object = {};

    if (res.headersSent) {
      next(error);
    }

    if (!isProduction) {
      config.DEBUG(error.stack);
    }

    const { method, path, ip } = req;

    if (errorLogger) {
      errorLogger.error({
        ip,
        errorCode,
        message: error.message,
        method,
        timeStamp: new Date(),
        trace: error.stack,
      });
    }

    if (errorCode === 500 && isProduction) {
      return apiResponse.errorResponse(
        res,
        500,
        "An unexpected error occurred. Please try again later.",
      );
    }

    let errors = {
      ...(error.errors && { error: error.errors }),
      ...(!isProduction && { trace: errorMessage, method, path }),
    };

    return apiResponse.errorResponse(res, errorCode, error.message, errors);
  }
}

export default new ErrorMiddleware();
