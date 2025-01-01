import express, { Application } from "express";
import { Server as HttpServer } from "http";
import cors from "cors";
import config from "./config";

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

    // initialiseDB
    // initialize systems middleare
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

  private initializeDB(): void {}

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
