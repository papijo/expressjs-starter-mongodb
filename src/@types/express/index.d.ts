import "express";
import session from "express-session";

declare module "express" {
  export interface Request {
    sessionOptions: session.SessionOptions;
  }
}

declare module "express-session" {
  export interface Session {
    user?: Object;
  }
}
