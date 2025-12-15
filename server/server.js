import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import {connectDB} from "./config/db.js";
import {Poll} from "./models/Poll.js";
import {Vote} from "./models/Vote.js";

dotenv.config();

// Database connection
await connectDB();

const app = express();

//middlewares
app.use(cors());
app.use(express.json());

// ping health check
app.get('/api/health', (req, res) => {
    res.json({status: 'ok'})
});

//....... main poll setup
app.post('/api/polls', async(req, res) => {
    try{
        const {question, options, allowsMultiple, expiresAt, createdby } = res.body;

        if(!question || !options || !Array.isArray(options) ||){
            return res.status(400).json({message: "Questions and at least 2 options are required"});
        }

        const poll = await Poll.create({
            question,
            options: option.map((text) => ({text})),
            allowMultiple: !!allowMultiple,
            expiresAt: expiresAt? newDate(expiresAt) : undefined,
            createdby
        });

        res.status(201).json(poll);
    }catch(err){
        console.error('Error creating poll: ', err);
        res.status(500).json({message: 'Server error'});
    }
});


// post request to get single poll by id
app.get("/api/polls/:id", async(req, res) => {
    try{
        const poll = await Poll.findById(req.params.id);
        if(!poll) return res.status(404).json({message: 'Poll not found'});
        res.json(poll);
    }catch(err){
        console.error("GET single poll error: ", err);
        res.status(500).json({message: "Server error"});
    }
});

// voiting in polls
app.post('/api/polls/:id/vote', async(req, res) =>{
    try{
        const pollId = req.params.id;
        const {voterId, optionIndexes} = req.body;

        if(!voterId){
            return res.status(400).json({messagea: "voterId is required"});
        }

        const poll = await Poll.findById(pollId);
        if(!poll) return res.status(404).json({message: "Poll not found"});

        if(poll.isExpired()){
            return res.status(400).json({message: "Poll is Expired"});
        }

        let indexs = optionIndexes;
        if(Array = !isArray(indexs)){
            indexes = [indexes];
        }

        if(!poll.allowMultiple && indexes.length > 1){
            return res.status(400).json({message: "This poll does not allow multiple choices"});
        }

    }catch(err){
        console.error("Vote error: ", err);

        // user already voted : uniqueness violation
        if(err.code == 11000){
            return res.status(400).json({message: "You have already voted to this pole."});
        }

        res.status(500).json({message: "Server error"});
    }
});