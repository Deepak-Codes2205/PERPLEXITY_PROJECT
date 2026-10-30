import { tavily as Tavily} from "@tavily/core"


const tavily = Tavily({ 
    apiKey: process.env.TAVILY_API_KEY,
});

// tools will return result in form of string or number
export const searchInternet = async({ query })=>{
    try{
        const results =  await tavily.search(query,{
            maxResults: 5,
            searchDepth: "basic"
            
        })

        // Send only what the model needs
        return JSON.stringify(
            results.results.map(({ title, url, content }) => ({ title, url, content }))
        );
    }catch (err) {
    console.error("Tavily search failed:", err.message);
    return "Internet search failed. Answer from your own knowledge and tell the user live search was unavailable.";
  }
};