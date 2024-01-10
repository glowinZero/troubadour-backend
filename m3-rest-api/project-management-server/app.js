const cors = require("cors");
require("dotenv").config();

require("./db");

const express = require("express");

const app = express();

app.use(
    cors({
      origin: ["https://fabulous-gnome-6f4332.netlify.app", "http://localhost:5173"],
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
