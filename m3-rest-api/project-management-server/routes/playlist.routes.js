const express = require('express');
const axios = require('axios');
const mongoose = require("mongoose");
const router = express.Router();
const Playlist = require('../models/Playlists.model');


//**chatgpt integration */

router.post('/openai', async (req, res) => {
  // Extracting the message from the request body if you want dynamic content
  const userMessage = req.body.prompt || "i am happy but also a bit exhausted";
  console.log(userMessage);

  try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: "gpt-4",
          messages: [{
              role: "system",
              content: `Analyze my mood and give a response of only one word: ${userMessage}`
          }]
      }, {
          headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // Replace with your API key
              'Content-Type': 'application/json'
          }
      });

      // Sending back the response from OpenAI to the client
      res.json(response.data.choices[0].message.content);
  } catch (error) {
      console.error("Error with OpenAI API:", error.response ? error.response.data : error);
      console.error("Error with OpenAI API:", error.response ? error.response.status : error);
      console.error("Error with OpenAI API:", error.response ? error.response.headers : error);
      res.status(500).send('Error with OpenAI API');
  }
});

module.exports = router;

//chatgpt integration end

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