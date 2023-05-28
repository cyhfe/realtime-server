import * as dotenv from "dotenv";
import app from "./server";

dotenv.config();

const port = process.env.PORT;

app.listen(port, () => {
  console.log("serve on http://localhost:" + port);
});

process.on("uncaughtException", (error) => {
  console.log(error);
});

process.on("unhandledRejection", (error) => {
  console.log(error);
});
