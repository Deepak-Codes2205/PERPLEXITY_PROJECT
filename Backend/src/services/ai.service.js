//   model: "gemini-1.5-flash",
// const response = await model.invoke("Hello");
// console.log(response.content);

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";

//HumanMessage for sending message to model and SystemMessage for giving instructions to model
// AIMessage for getting response from model in structured way 
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";

//Gemini for message response
const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY
});

//Mistral for generating chat title
const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY
});



// We will test/run this from server.js file but on production we will not this, In production this function will not be created
export async function generateResponse(messages) {
    
    //First creating an array of message through mapping and then invoking it to get the responce from the model

    const response = await geminiModel.invoke(messages.map(msg => {
        if(msg.role === "user") {
            return new HumanMessage(msg.content);
        }
        else if(msg.role === "ai") {
            return new AIMessage(msg.content);
        }
    }));

    return response.text;
}

export async function generateChatTitle(message) {
    
    const response = await mistralModel.invoke([
        new SystemMessage(`You are a helpful assistant that generates concise and descriptive titles for chat conversations.
            User will provide you with the first message of a chat conversation, and you will generate a title that captures
            the essence of the conversation in 2-4 words. The title should be clear, relevant, and engaging, giving users a 
            quick understanding of the chat's topic.    
        `),
        new HumanMessage(`
            Generate a title for a chat conversation based on the following first message:
            "${message}"
            `)
    ])
    return response.text;
}   

