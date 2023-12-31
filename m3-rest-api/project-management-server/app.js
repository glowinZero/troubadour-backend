require("dotenv").config();

const cors = require("cors");
const bodyParser = require("body-parser");
require("./db");

const express = require("express");

const app = express();

app.use(bodyParser.json());

app.use(
    cors({
      origin: "*",
    })
  );

require("./config")(app);

const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const playlistRoutes = require('./routes/playlist.routes');
app.use("/api", playlistRoutes);

const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);

require("./error-handling")(app);

module.exports = app;
