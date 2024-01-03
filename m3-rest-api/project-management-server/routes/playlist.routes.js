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


router.put("/playlists/:playlistId", (req, res) => {
    const { playlistId } = req.params;
    const {title, deadline, status, user: userId} = req.body; 
  
    Playlist.findByIdAndUpdate(playlistId, {title, deadline, status, user: userId}, { new: true })
      .then(() => {
        res.json({ message: "Playlist Updated!" });
      })
      .catch(() => {
        res.json({ message: "Failed to Update Playlist." });
      });
  });

router.post("/playlist", (req, res) => {
    const {title, deadline, status, user: userId} = req.body; 

    Playlist.create({title, deadline, status, user: userId})
      .then((response) => res.json(response))
      .catch((error) => res.json(error));
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