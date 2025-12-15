import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema(
    {
        text: 
        {
            type: String,
            required : true,
        },
        votes:
        {
            type: Number,
            default : 0,
          },
    },
    {_id :false}
);

const pollSchema = new mongoose.Schema(
    {
        question:{
            type : String,
            required : true,
            trim: true,
        },

        // options for each

        options:{
            type : [optionSchema],
            validate :
            {
                validator : (arr) => arr.length >= 2,
                message : "Poll must have at least 2 option" 
            }
        },
        allowMultiple: {
            type: Boolean,
            default: false,
        },
        expiresAt : {type : Date},
        createdby : {type: String},
        isActive : {
            type: Boolean,
            default: true
        }
    }, {timestamps: true}
);

pollSchema.methods.isExpired = function(){
    if(!this.expiresAt) return false;
    return new Date() > this.expiresAt;
}

export const Poll = mongoose.model("Poll", pollSchema);
    











const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true
    },
    options: {
        type: [{
            text: {
                type: String,
                required: true,
                trim: true
            },
            votes: {
                type: Number,
                default: 0
            }
        }],
        validate: {
            validator: (value) => Array.isArray(value) && value.length >= 2,
            message: 'Question and at least 2 options are required'
        }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    voters: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Poll', pollSchema);

