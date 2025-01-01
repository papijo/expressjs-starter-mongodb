import express, { Application } from "express";
import { Server as HttpServer } from "http";
import cors from "cors";
import config from "./config";
import db from "./db";
import compression from "compression";
import { ServerEnvOptions } from "./enums/config.enum";
import helmet from "helmet";
import morgan from "morgan";
import fs from "fs";
import * as rfs from "rotating-file-stream";
import customMiddleware from "./middlewares/custom.middleware";

class Server {
  public app: Application;
  public server: HttpServer;
  public port: number;
  private corsOptions: cors.CorsOptions;

  constructor() {
    this.app = express();
    this.port = config.PORT;
    this.corsOptions = {
      origin: config.ALLOWED_ORIGINS.split(","),
    };

    this.initializeDB();
    this.initializeSystemMiddlewares();
    // initialize routes
    // initialize error handling

    ["SIGINT", "SIGUSR1", "SIGUSR2", "SIGTERM"].forEach((signal) => {
      process.on(signal, async (error) => {
        config.DEBUG(
          `\nReceived signal (${signal}) to terminate the application ${JSON.stringify(error)}`,
        );
        await this.shutDown();
      });
    });
  }

  private initializeDB(): void {
    db.connect();
  }

  private initializeSystemMiddlewares(): void {
    this.app.use(compression());

    // Cors
    if (config.NODE.ENV === ServerEnvOptions.PRODUCTION) {
      this.app.use(cors(this.corsOptions));
    } else {
      this.app.use(cors());
    }

    // Parse JSON Request Body
    this.app.use(express.json({ limit: "5mb" }));
    // parse urlencoded request body
    this.app.use(express.urlencoded({ limit: "5mb", extended: true }));
    // Security Management Middleware (Headers)
    this.app.use(helmet());

    // Morgan Logging Middleware
    if (config.NODE.ENV !== ServerEnvOptions.TESTING) {
      this.app.use(morgan("dev"));

      if (
        [
          ServerEnvOptions.STAGING,
          ServerEnvOptions.PRODUCTION,
          ServerEnvOptions.DEVELOPMENT,
        ].includes(config.NODE.ENV)
      ) {
        if (!fs.existsSync("logs/morgan")) {
          fs.mkdirSync("logs/morgan", { recursive: true });
        }

        this.app.use(
          morgan("combined", {
            stream: fs.createWriteStream("logs/morgan/requests.log", {
              flags: "a",
            }),
          }),
        );
      }
    }

    // Winston Logger Middleware
    this.app.use(customMiddleware.logger);
  }

  private routes(): void {}

  private errorHandlingMiddleware(): void {}

  public start(): void {
    // Start express server
    this.server = this.app
      .listen(this.port, () => {
        config.DEBUG(
          `server running on http://localhost:${this.port} in ${config.NODE.ENV} mode. \nPress ctrl-c to stop.`,
        );
      })
      .on("error", (error: Error) => {
        if (error.name === "EADDRIUSE") {
          config.DEBUG(
            `Error: Port ${this.port} is already in use.  Trying next port....`,
          );
        }
        this.port++;
        this.start();
      });
  }

  private async shutDown(): Promise<void> {}
}

const server = new Server();
server.start();
