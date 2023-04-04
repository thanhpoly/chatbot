require("dotenv").config();
const express = require("express");
const webhookRoutes = require("./routes");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.json());

app.use("/", webhookRoutes);

app.listen(4000, () => {
  console.log("Server is up on port 3000.");
});
