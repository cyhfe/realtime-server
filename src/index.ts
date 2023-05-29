import * as dotenv from "dotenv";
import httpServer from "./server";

dotenv.config();

const port = process.env.PORT;

httpServer.listen(port, () => {
  console.log("serve on http://localhost:" + port);
});

process.on("uncaughtException", (error) => {
  console.log(error);
});

process.on("unhandledRejection", (error) => {
  console.log(error);
});
