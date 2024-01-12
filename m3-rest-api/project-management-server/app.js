const cors = require("cors");
require("dotenv").config();

require("./db");

const express = require("express");

const app = express();

const corsOptions = {
    origin: "*",
    methods: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
    allowedHeaders: '*',
    credentials: true,
  };
  
// Enable CORS for all routes
app.use(cors(corsOptions));

require("./config")(app);

const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const playlistRoutes = require('./routes/playlist.routes');
app.use("/api", playlistRoutes);

const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);

require("./error-handling")(app);

module.exports = app;
