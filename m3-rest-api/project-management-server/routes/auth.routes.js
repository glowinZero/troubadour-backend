const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User.model');

const {isAuthenticated} = require('../middleware/jwt.middleware');

const router = express.Router();

const saltRounds = 10; 

router.post('/signup', (req,res)=>{
    const {email, password, username, playlists} = req.body; 

    if(email === '' || password === '' || username === '' || playlists === ''){
        res.status(400).json({message: "Provide email, password and name."})
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    if(!emailRegex.test(email)){
        res.status(400).json({message: 'Provide a valid e-mail.'})
        return; 
    }


    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if(!passwordRegex.test(password)){
        res.status(400).json({message: 'Password must have at least 6 characters and contain 1 lowercase letter, 1 uppercase letter, 1 number'}); 
        return; 
    }

    User.findOne({email})
        .then((foundUser)=>{
            if(foundUser){
                res.status(400).json({message: 'User already exists'});
                return;
            }


            const salt = bcrypt.genSaltSync(saltRounds); 
            const hashedPassword = bcrypt.hashSync(password, salt);

            return User.create({email, password: hashedPassword, username, playlists});
        }).then((createdUser)=>{
            const {email, username, _id, } = createdUser;

            const user = {email, username, _id};

            res.status(201).json({user});
        })
        .catch((error)=>{
            console.log(error);
            res.status(500).json({message: 'Internal Server Error'})
        })
});


router.post('/login', (req, res)=>{
    const {email, password} = req.body; 


    if(email === '' || password === ''){
        res.status(400).json({message: 'Provide email and password.'}); 
        return;
    }

    User.findOne({email})
        .then((foundUser)=>{

            if(!foundUser){
                res.status(400).json({message: 'User not found'});
                return; 
            }

            const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

            if(passwordCorrect){
                const {_id, email, name} = foundUser; 

                const payload = {_id, email, name};

                const authToken = jwt.sign(
                    payload, process.env.TOKEN_SECRET, {algorithm: 'HS256', expiresIn: '6h'}
                )
                return res.status(200).json({authToken: authToken});
            }

            else{
                return res.status(400).json({message: 'Password not found'});
            }
        })
        .catch(()=> res.status(500).json({message: 'User not found.'}))
}); 


router.get('/verify', isAuthenticated, (req,res)=>{
    res.status(200).json(req.payload);
})

router.get("/users", (req, res) => {

    User.find()
      .then((user) => res.json(user))
      .catch((error) => res.json(error));
});

router.get("/users/:userId", (req, res) => {
    const { userId } = req.params;
    
    User.findById(userId)
      .then((user) => res.json(user))
      .catch((error) => res.json(error));
});

router.put("/users/:userId", (req, res) => {
    const { userId } = req.params;
    const {email, password, username, playlists} = req.body; 
  
    User.findByIdAndUpdate(userId, {email, password, username, playlists}, { new: true })
      .then(() => {
        res.json({ message: "User Updated!" });
      })
      .catch(() => {
        res.json({ message: "Failed to Update User." });
      });
});

router.put("/users/:userId", async (req, res) => {
    const { userId } = req.params;
    const {email, password, username, playlists} = req.body; 

    try {

        const existingUser = await User.findById(userId);

        if (!existingUser) {
            return res.status(404).json({ message: "User not found." });
        }


        if (email) existingUser.email = email;
        if (password) {

            const isCurrentPasswordValid = await bcrypt.compare(password, existingUser.password);
            if (!isCurrentPasswordValid) {
                return res.status(401).json({ message: "Current password is not valid." });
            }


            const salt = bcrypt.genSaltSync(saltRounds);
            const hashedPassword = bcrypt.hashSync(password, salt);
            existingUser.password = hashedPassword;
        }
        if (username) existingUser.firstName = firstName;
        if (playlists) existingUser.lastName = lastName;


        await existingUser.save();

        res.json({ message: "User Updated!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to Update User." });
    }
});

router.delete("/users/:userId", (req, res) => {
    const {userId} = req.params;

    User.findByIdAndDelete(userId)
        .then(()=>{
            res.json({message: 'User deleted'});
        })
        .catch(()=>{
            res.json({error: 'Failed to delete a User'});
        })
});


module.exports = router; 