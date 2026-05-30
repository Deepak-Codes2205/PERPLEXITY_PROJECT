import { generateResponse, generateChatTitle } from '../services/ai.service.js';
import chatModel from '../models/chat.model.js';
import messageModel from '../models/message.model.js';

export async function sendMessage(req, res) {

    const { message, chat: chatId } = req.body;

    //Generates response for the user message
    

    //Generates title for the chat based on the first message of the user if chatId is not provided(first chat), 
    // if chatId is provided then it means chat is already created and title is also generated
    let title = null, chat=null;
    if(!chatId) {

        title = await generateChatTitle(message);
        
        //Stores chat in DB
        chat = await chatModel.create({
            user: req.user.id,
            title
        });
    }

    //Stores Users current message in DB 
    const userMessage = await messageModel.create({
        chat: chatId || chat._id,
        content: message,
        role: "user"
    });

    //Entire chat till current message given to AI 
    const allMessages = await messageModel.find({ chat: chatId || chat._id });
    

    //Generates AI's response based on all the messages of the chat till now including user's current message
    const result = await generateResponse(allMessages);

    //Stores AI's message in DB
    const aiMessage = await messageModel.create({
        chat: chatId || chat._id,
        content: result,
        role: "ai"
    });



    res.status(201).json({
        title,
        chat,
        userMessage,
        aiMessage
    });
    
}


export async function getChats(req, res) {

    const user = req.user;

    const chats = await chatModel.find({ user : user.id })
    res.status(200).json({
        message: "Chats retrieved successfully",
        chats
    });
}   


export async function getMessages(req, res) {

    const { chatId } = req.params;

    const chat = await chatModel.findById({
        _id:chatId,
        user: req.user.id
    });

    if(!chat) {
        return res.status(404).json({
            message: "Chat not found",
        });
    }

    const messages = await messageModel.find({ chat: chatId });

    res.status(200).json({
        message: "Messages retrieved successfully",
        messages
    });
}


export async function deleteChat(req, res) {

    const { chatId } = req.params;

    const chat = await chatModel.findOneAndDelete({
        _id: chatId,
        user: req.user.id
    });

    await messageModel.deleteMany({
        chat: chatId
    })

    if(!chat){
        return res.status(404).json({
            message:"Chat not found"
        })
    }

    res.status(200).json({
        message: "Chat deleted Succesfully"
    })
}