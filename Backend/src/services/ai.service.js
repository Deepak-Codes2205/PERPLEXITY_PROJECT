import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { createAgent } from "langchain";
import * as z from "zod";
import { searchInternet } from "./internet.service.js";


const MAX_HISTORY = 20;

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY
});


const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY
});


const searchInternetTool = tool(
    searchInternet,
    {
        name: "searchInternet",
        description: "Use this tool to get the latest information from the internet.",
        schema: z.object({
            query: z.string().describe("The search query to look up on the internet.")
        })
    }
)   


const agent = createAgent({
    model: geminiModel,
    tools: [ searchInternetTool ],
})

// Convert DB messages to LangChain messages (ignores unknown roles safely)
function toLangChainMessages(messages) {
  const converted = messages.slice(-MAX_HISTORY).flatMap((msg) => {
    if (msg.role === "user") return [new HumanMessage(msg.content)];
    if (msg.role === "ai" || msg.role === "assistant") return [new AIMessage(msg.content)];
    return [];
  });

  // History should start with a user message
  while (converted.length && converted[0] instanceof AIMessage) converted.shift();
  return converted;
}


export async function generateResponse(messages) {
    
       const response = await agent.invoke({
        messages: [
            new SystemMessage(`
                You are a helpful and precise assistant for answering questions.
                Today's date is ${new Date().toDateString()}.
                If you don't know the answer, say you don't know. 
                If the question requires up-to-date information, use the "searchInternet" tool 
                and answer based on the search results.            
                `),
                ...toLangChainMessages(messages),
            ]
        },
        { recursionLimit: 10 } // stops endless tool-calling loops
    );

    return response.messages[response.messages.length -1].text;
}

export async function generateChatTitle(message) {
    
    const response = await geminiModel.invoke([
        new SystemMessage(`
            You generate short chat titles. Given the first message of a chat,
            reply with ONLY a title of 2-4 words. No quotes, no extra text.
            `),
            new HumanMessage(`
            Generate a title for a chat conversation based on the following first message:
            "${message}"
            `)
    ])
    return response.text.replace(/["'*\n]/g, "").trim();    
}   
