const express = require('express');
const mongoose = require("mongoose");

const router = express.Router();

const Playlist = require('../models/Playlists.model');

router.get("/playlists/:userId", (req, res)=>{
  const {userId} = req.params;
  Playlist.find({ user: userId })
  .then((playlists) => {
    res.json(playlists);
  })
  .catch((error) => {
    console.error("Error fetching Playlist:", error);
    res.status(500).json({ message: "Internal Server Error" });
  });
})

router.get("/playlists", (req, res) => {
    Playlist.find()
      .then((allPlaylists) => res.json(allPlaylists))
      .catch((error) => res.json(error));
});


router.put("/playlists/:playlistId", (req, res) => { //not using the put route as of now
    const { playlistId } = req.params;
    const {title, mood, url, user: userId} = req.body; 
  
    Playlist.findByIdAndUpdate(playlistId, {title, mood, url, user: userId}, { new: true })
      .then(() => {
        res.json({ message: "Playlist Updated!" });
      })
      .catch(() => {
        res.json({ message: "Failed to Update Playlist." });
      });
  });

router.post("/playlist", (req, res) => {
    const {title, mood, url, user: userId} = req.body; 

    Playlist.create({title, mood, url, user: userId})
      .then((response) => res.json(response))
      .catch((error) => res.json(error));
});

app.post ("playlist/chatgpt", async (req,res)=>{ //need to update route "/chat" so it works with the front end
  const {prompt} = req.body;

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    max_tokens: 512,
    temperature: 0.5,
    prompt: `analyze the following paragraph and assign one of the following moods to it. Give only one word as an answer: happy, sad, angry, calm, excited, scared, bored, confused, focused, motivated, driven, grounded, melancholic, nostalgic, balanced, relaxed. : ${prompt}`,
  });
  res.send (completion.data.choices[0].text);
});

router.delete("/playlists/:playlistId", (req, res) => {
    const {playlistId} = req.params;

    Playlist.findByIdAndDelete(playlistId)
        .then(()=>{
            res.json({message: 'Playlist deleted'});
        })
        .catch(()=>{
            res.json({error: 'Failed to delete a Playlist'});
        })
});


module.exports = router;