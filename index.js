const express = require("express");
const app = express();
const dotenv = require("dotenv");

dotenv.config();
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) =>
{
  res.render("index");
});

const port = process.env["PEB_LISTENING_PORT"] || 3000;
app.listen(port, () =>
{
    console.log(`Server listening on http://localhost:${port}`);
});