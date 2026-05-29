//   model: "gemini-1.5-flash",
// const response = await model.invoke("Hello");
// console.log(response.content);

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY
});


// We will test/run this from server.js file but on production we will not this, In production this function will not be created
export async function generateResponse(message) {
    
    const response = await model.invoke([
        new HumanMessage(message)
    ]);
    return response.text;
}