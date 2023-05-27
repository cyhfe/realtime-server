import * as dotenv from "dotenv";
import app from "./server";

dotenv.config();

const port = process.env.PORT;
console.log(port);

app.listen(port, () => {
  console.log("serve on http://localhost:" + port);
});
