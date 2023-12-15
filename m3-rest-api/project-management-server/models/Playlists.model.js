const mongoose = require('mongoose');
const {Schema, model } = mongoose; 

const playlistSchema = new Schema({
    title: { type: String, required: true }, 
    mood: { type: String, required: true},
    url: { type: String, required: true},
    user: { type: String, required: true },
})

module.exports = model("Playlist", playlistSchema); 