import mongoose from 'mongoose';
const { Schema } = mongoose;

const messageSchema = new Schema(
    {
        chat: { 
            type: Schema.Types.ObjectId, 
            ref: 'Chat', 
            required: true 
        },
        content: {
            type: String, 
            required: true 
        },
        role: { 
            type: String, 
            enum: ['user', 'ai'], 
            default: 'user' 
        },
    }, 
    { timestamps: true }
);

const messageModel = mongoose.model('Message', messageSchema);

export default messageModel;
