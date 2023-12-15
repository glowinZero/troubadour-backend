const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: { type: String, required: true},
    password: { type: String, required:true}, 
    username: {type: String, required: true},
    playlists: [{ type: Schema.Types.ObjectId, ref:'Playlist' }]
  }
);

const User = model("User", userSchema);

module.exports = User;
