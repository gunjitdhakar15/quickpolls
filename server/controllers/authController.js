const User = require('../models/User.js');
const bcrypt = require('bcrypt.js');
const jwt = require('jsonwebtoken');

// Register
exports.register = async(req, res) => {
    try{
        const {name, email, password} = req.body; // Include name for register user

        //check if user exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:'User already exists'});
        }

        // Hash Password using bcrypt
        const hashedPass = await bcrypt.hash(password, 12);

        //Create User
        const user = await User.create({
            name,
            email,
            password : hashedPass
        });

        res.status(201).json({message: 'User rergistered successfully'})
    } catch(err){
        res.status(500).json({message: 'Registration failed', error: err.message});
    }
};


//Login

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;

        //Find user in Database
        const user = await User.findOne({email});
        if(!user){ // if does not exists
            return res.status(401).json({message: 'Invalid credentials'});
        }

        //Check Password
        const validPass = await bcrypt.compare(password, user.password);
        if(!validPass){
            return res.status(401).json({message: 'Invalide credentials'});
        }
        
        // if checks success Generate token
        const token = jwt.sign(
            {id: user._id, email: user.email, name: user.name},
            process.env.JWT_SECRET || 'jwt-secret-key',
            {expiresIn: '7d'},
        );

        req.json({
            token,
            user:{
                id: user._id,
                name: user.name,
                email : user.email
            }
        });
        
    } catch (error) {
        res.statu(500).json({message:'Login Failed', error:error.message});
    }
};