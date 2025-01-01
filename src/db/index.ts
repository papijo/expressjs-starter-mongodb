import mongoose, { Error } from "mongoose";
import config from "../config";

class DB {
  public connect(): void {
    mongoose
      .connect(config.MONGODB_URI)
      .then(() => {
        config.DEBUG(`connected to database`);
      })
      .catch((error: Error) => {
        config.DEBUG({
          name: error.name,
          message: error.message,
          stack: error.stack,
          date: new Date(),
        });
      });
  }
}

export default new DB();
