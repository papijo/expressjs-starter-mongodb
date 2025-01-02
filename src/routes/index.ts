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
    this.router.get("/", (req: Request, res: Response): Response => {
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

    this.router.get("/session", (req: Request, res: Response) => {
      let user = { name: "Jonathan" };

      req.session.user = user;

      return res.status(200).json({ message: "test" });
    });

    this.router.get("/status", (req: Request, res: Response) => {
      console.log(req.session.id);
      return req.session.user
        ? res.status(200).send(req.session.user)
        : res.status(401).send({ msg: "not authenticated" });
    });

    // Error route
    this.router.use("*", () => {
      throw new NotFoundError(
        "API Endpoint does not exist or is still in construction",
      );
    });
  }
}

export default new Routes().router;
