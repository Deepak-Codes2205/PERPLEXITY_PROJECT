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
            required: true 
        },
    }, 
    { timestamps: true }
);

const messageModel = mongoose.model('Message', messageSchema);

export default messageModel;
