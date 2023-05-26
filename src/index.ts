import * as dotenv from "dotenv";
dotenv.config();
import app from "./server";

app.listen(process.env.PORT ?? 3000, () => {
  console.log("serve on http://localhost:3001");
});

process.on("uncaughtException", (error) => {
  console.log(error);
});

process.on("unhandledRejection", (error) => {
  console.log(error);
});
