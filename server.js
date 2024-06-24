const express = require("express");
const { connecting } = require("./config/connexion");
const routerUser = require("./routers/route");
const app = express();
const port = 9876;

// Place these middlewares before your route definitions
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/v1", routerUser);

connecting("mongodb://127.0.0.1:27017/", (error) => {
  if (error) {
    console.log("Failed connexion database...");
    console.error(error);
    process.exit(-1);
  } else {
    console.log("Connecting...");
    app.listen(port, () => {
      console.log(
        `You are Connecting the Server on port http://localhost:${port}`
      );
    });
  }
});
