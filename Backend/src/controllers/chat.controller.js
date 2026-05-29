import { generateResponse } from '../services/ai.service.js';

export async function sendMessage(req, res) {

    const { message } = req.body;
    
    const result = await generateResponse(message);

    res.status(200).json({
        aiMessage: result
    });
    
}