require("dotenv").config();
const express = require("express");
const webhookRoutes = require("./routes");

const app = express();

app.use(express.static("public"));

app.use(express.json());

app.use("/", webhookRoutes);

app.listen(3000, () => {
  console.log("Server is up on port 3000.");
});
