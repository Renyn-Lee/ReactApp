const { GoogleGenerativeAI } = require('@google/generative-ai');
const { app } = require('@azure/functions');

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function getGeminiResponse(request, context) {
    context.log('HTTP trigger function processed a request.');

    // Enable CORS for your React app
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    // Handle preflight OPTIONS request
    if (request.method === "OPTIONS") {
        return { status: 200, headers: corsHeaders };
    }

    if (request.method !== "POST") {
        return {
            status: 405,
            headers: corsHeaders,
            body: "Method not allowed. Use POST."
        };
    }

    try {
        const body = await request.json();
        const message = body?.message || '';

        context.log('Received message:', message);
        context.log('Gemini API Key exists:', !!process.env.GEMINI_API_KEY);

        if (!message) {
            return {
                status: 400,
                headers: corsHeaders,
                body: { error: "Message is required" }
            };
        }

        // Build conversation context for Gemini
        const conversationContext = `You are a helpful music assistant named Sato. Help users with questions about learning piano, guitar, music theory, and practice tips.

User: ${message}
Assistant:`;

        // Call Gemini API
        const result = await model.generateContent(conversationContext);
        const response = await result.response;
        const reply = response.text();

        return {
            status: 200,
            headers: corsHeaders,
            jsonBody: {
                reply: reply,
                usage: { total_tokens: "N/A" }
            }
        };

    } catch (error) {
        context.log('Full error details:', error);
        context.log('Error calling Gemini:', error.message);
        return {
            status: 500,
            headers: corsHeaders,
            jsonBody: { error: "Sorry I'm a little busy right now please repeat what you said in a moment" }
        };
    }
}

app.http('getGeminiResponse', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: getGeminiResponse
});