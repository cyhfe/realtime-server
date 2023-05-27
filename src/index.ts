import * as dotenv from "dotenv";
dotenv.config();
import app from "./server";

const PORT = process.env.PORT ?? 3000;

app.listen(PORT ?? 3000, () => {
  console.log("serve on http://localhost:" + PORT);
});

process.on("uncaughtException", (error) => {
  console.log(error);
});

process.on("unhandledRejection", (error) => {
  console.log(error);
});
