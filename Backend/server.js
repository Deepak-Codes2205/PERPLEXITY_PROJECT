import  "dotenv/config";
import app from "./src/app.js";
import { connectDB } from "./src/config/database.js";
import { testAi } from "./src/services/ai.service.js";

const PORT = process.env.PORT || 8000;
//console.log(process.env.MONGO_URI);

testAi(); // We will test the AI service here, In production we will not this, In production this function will not be created
// Here it is just to check the AI service is working fine or not
connectDB()
    .catch((err) => {
        console.error("Failed to connect to the database:", err);
        process.exit(1);
    });
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});