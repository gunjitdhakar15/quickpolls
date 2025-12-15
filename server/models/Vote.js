import mongoose from "mongoose";

const voteSchema =  new mongoose.Schema(
    {
        poll:{
            type : mongoose.Schema.Types.ObjectId,
            ref : "Poll",
            required: true,
        },
        voterId:{
            type: String,
            required : true,
        },
        optionIndexes:{
            type: [Number],
            required : true,
        }
    },
    {timestamps: true}
);

// check
voteSchema.index({poll: 1, voterId:1}, {unique: true});

export const vote = mongoose.model("Vote", voteSchema);