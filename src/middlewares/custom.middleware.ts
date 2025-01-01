import { NextFunction, Request, Response } from "express";
import { requestLogger } from "../utils/logger";

class CustomMiddlewares {
  public logger(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    res.on("finish", () => {
      const duration = Date.now() - start;
      const logEntry = `method:${req.method}, endpoint:${req.url}, statusCode:${res.statusCode}, responseTime: ${duration}ms`;
      requestLogger.info(logEntry);
    });
  }
}

export default new CustomMiddlewares();
