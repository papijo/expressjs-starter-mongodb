import express, { Request, Response, Router } from "express";
import apiResponse from "../utils/apiResponse";
import { NotFoundError } from "../utils/errors";

class Routes {
  public router: Router;

  constructor() {
    this.router = express.Router();
    this.routes();
  }

  routes(): void {
    this.router.get("/", (req: Request, res: Response) => {
      const data: object = {
        owner: "Ebhota Jonathan",
        developer: "Ebhota Jonathan",
        version: "1.0.0",
        serverStatus: "Healthy",
      };

      return apiResponse.successResponse(
        res,
        200,
        "NodeJs/ExpressJS with MongoDB Template Home",
        data,
      );
    });

    // Error route
    this.router.use("*", () => {
      throw new NotFoundError(
        "API Endpoint does not exist or is currently in construction",
      );
    });
  }
}

export default new Routes().router;
