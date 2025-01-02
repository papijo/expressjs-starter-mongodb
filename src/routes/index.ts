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
        req.t("messages.home"),
        data,
      );
    });

    // Error route
    this.router.use("*", (req: Request) => {
      throw new NotFoundError(req.t("errors.routeNotFound"));
    });
  }
}

export default new Routes().router;
