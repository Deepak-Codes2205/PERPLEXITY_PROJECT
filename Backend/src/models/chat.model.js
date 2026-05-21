import mongoose from 'mongoose';
const { Schema } = mongoose;

const chatSchema = new Schema(
     {
        user: { 
            type: Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
        title: { 
            type: String, 
            default: 'Untitled' 
        },
    }, 
    { timestamps: true }
);

const chatModel = mongoose.model('Chat', chatSchema);

export default chatModel;
