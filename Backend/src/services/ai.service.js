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

// ---------- Tool 1: Internet search ----------
const searchInternetTool = tool(
    searchInternet,
    {
        name: "searchInternet",
        description: "Search the internet for latest information. Use topic 'news' for news, recent events or headlines. Use 'general' for everything else.",
        schema: z.object({
            query: z.string().describe("The search query to look up on the internet."),
            topic: z
      .enum(["general", "news"])
      .optional()
      .describe("Use 'news' for latest news and recent events. Otherwise use 'general'."),
  }),
});


// ---------- Tool 2: Current date and time ----------
const getCurrentTimeTool = tool(
  async ({ timeZone }) => {
    try {
      return new Intl.DateTimeFormat("en-IN", {
        timeZone,
        dateStyle: "full",
        timeStyle: "long",
      }).format(new Date());
    } catch {
      return "Invalid time zone. Use an IANA name like Asia/Kolkata.";
    }
  },
  {
    name: "getCurrentTime",
    description: "Get the current date and time of any city or country.",
    schema: z.object({
      timeZone: z
        .string()
        .describe(
          "IANA time zone name. Example: Asia/Kolkata for India (Dehradun, Delhi), America/New_York for New York."
        ),
    }),
  }
);


const agent = createAgent({
    model: geminiModel,
    tools: [ searchInternetTool, getCurrentTimeTool ],
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
            For news, latest updates or anything recent, ALWAYS use the "searchInternet" tool with topic "news".
            For questions about people, websites, companies or any other facts you are not sure about,
            use the "searchInternet" tool with topic "general".
            For current time or date in any place, ALWAYS use the "getCurrentTime" tool.
            When you give news, mention the published date of each item.
            Never refuse a request without first trying the tools.
            If the first search gives poor results, search again with a different query.
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
