require("dotenv").config();

const OpenAI = require('openai');
const { apiKey } = process.env.API_KEY;
const openai = new OpenAI({
  apiKey: "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",
});

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
