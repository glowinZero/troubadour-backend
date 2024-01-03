const cors = require("cors");
const bodyParser = require("body-parser");
const {Configuration, OpenAIApi} = require('openai-api');
require("dotenv").config();

require("./db");

const express = require("express");

const app = express();

app.use(bodyParser.json());

app.use(
    cors({
      origin: ["https://fabulous-gnome-6f4332.netlify.app/"],
    })
  );

require("./config")(app);

const config = new Configuration({
  apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(config);

const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const playlistRoutes = require('./routes/playlist.routes');
app.use("/api", playlistRoutes);

const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);

require("./error-handling")(app);

module.exports = app;
