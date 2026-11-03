import { tavily as Tavily} from "@tavily/core"


const tavily = Tavily({ 
    apiKey: process.env.TAVILY_API_KEY,
});

// tools will return result in form of string or number
export const searchInternet = async({ query, topic = "general" })=>{
    try{

        console.log("Searching:", query, "| topic:", topic);

        const options = {
            maxResults: 5,
            searchDepth: "basic",
            topic, // "general" or "news"
        };

        if (topic === "news") options.days = 30; // only news from the last 30 days;

        const results =  await tavily.search(query, options);
        console.log("Results found:", results.results?.length);

        // Send only what the model needs
        return JSON.stringify(
        results.results.map(({ title, url, content, publishedDate }) => ({
            title,
            url,
            content,
            publishedDate,
        }))
    );
    }catch (err) {
        console.error("Tavily search failed:", err.message);
        return "Internet search failed. Answer from your own knowledge and tell the user live search was unavailable.";
  }
};