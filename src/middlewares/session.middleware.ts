import { NextFunction, Request, Response } from "express";
import session from "express-session";
import config from "../config";
import { requestLogger } from "../utils/logger";
var MongoDBStore = require("connect-mongodb-session")(session);
import express from "express";

class SessionMiddleware {
  public sessionConfig(): express.RequestHandler {
    const options: session.SessionOptions = {
      secret: "secret",
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 60000 * 60,
      },
    };

    return session(options);
  }
}

export default new SessionMiddleware();
