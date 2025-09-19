const { GoogleGenerativeAI } = require('@google/generative-ai');
const { app } = require('@azure/functions');

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
        const imageData = body?.image; // Base64 image data
        const mimeType = body?.mimeType; // Image mime type

        context.log('Received message:', message);
        context.log('Has image:', !!imageData);
        context.log('Gemini API Key exists:', !!process.env.GEMINI_API_KEY);

        if (!message.trim() && !imageData) {
            return {
                status: 400,
                headers: corsHeaders,
                body: { error: "Message or image is required" }
            };
        }

        // Choose model - use flash for both text and vision
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        let requestParts = [];

        if (imageData) {
            // Build prompt for image + text
            const contextPrompt = `You are Sato, a helpful music assistant. Help users with questions about learning piano, guitar, music theory, and practice tips. 

The user has shared an image. Please analyze the image and help them with their music-related question.`;

            requestParts = [
                { text: message ? `${contextPrompt}\n\nUser question: ${message}` : contextPrompt },
                {
                    inlineData: {
                        mimeType: mimeType || "image/jpeg",
                        data: imageData
                    }
                }
            ];
        } else {
            // Text-only prompt
            const conversationContext = `You are a helpful music assistant named Sato. Help users with questions about learning piano, guitar, music theory, and practice tips.

User: ${message}
Assistant:`;
            requestParts = [{ text: conversationContext }];
        }

        // Call Gemini API
        const result = await model.generateContent(requestParts);
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