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
    voters: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    }
}, { timestamps: true });

module.exports = mongoose.model('Poll', pollSchema);

