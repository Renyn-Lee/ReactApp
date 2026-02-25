const { GoogleGenerativeAI } = require('@google/generative-ai');
const { app } = require('@azure/functions');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const searchYouTube = async (query) => {
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&q=${encodeURIComponent(query)}&type=video&key=${process.env.YOUTUBE_API_KEY}`
        );
        const data = await response.json();
        if (data.items) {
            return data.items.map(item => ({
                title: item.snippet.title,
                channel: item.snippet.channelTitle,
                videoId: item.id.videoId,
                url: `https://www.youtube.com/watch?v=${item.id.videoId}`
            }));
        }
        return [];
    } catch (error) {
        console.error('YouTube API error:', error);
        return [];
    }
};

async function getGeminiResponse(request, context) {
    context.log('HTTP trigger function processed a request.');

    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (request.method === "OPTIONS") return { status: 200, headers: corsHeaders };
    if (request.method !== "POST") return { status: 405, headers: corsHeaders, body: "Method not allowed." };

    try {
        const body = await request.json();
        const message = body?.message || '';
        const imageData = body?.image;
        const mimeType = body?.mimeType || 'image/jpeg';
        const conversationHistory = body?.history || [];

        context.log('Received message:', message);
        context.log('Has image:', !!imageData, '| mimeType:', mimeType);

        if (!message.trim() && !imageData) {
            return { status: 400, headers: corsHeaders, body: { error: "Message or image is required" } };
        }

        // Use systemInstruction — this is the correct Gemini API field for system prompts.
        // Putting the system prompt inside promptParts as a text block can be ignored by the model.
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            systemInstruction: `You are Sato, a friendly and knowledgeable music assistant.
You have full multimodal vision capabilities. When the user sends an image, you WILL analyze it directly and describe what you see.
You help users with piano, guitar, music theory, reading sheet music, chord charts, hand positioning, and practice tips.
If an image is provided, always start by describing what you see in it, then give relevant music advice.
NEVER claim you cannot see images. NEVER refuse to analyze an image. You can always see them.
Keep responses concise (under 3 sentences) unless giving step-by-step instructions.`,
        });

        // Build conversation history for multi-turn context
        const historyForChat = conversationHistory
            .filter(msg => msg && msg.parts && msg.parts[0])
            .map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.parts[0].text }],
            }));

        // Build the current user message parts
        const currentParts = [];

        // If there's an image, add it first (Gemini multimodal: image before text)
        if (imageData) {
            currentParts.push({
                inlineData: {
                    data: imageData,
                    mimeType: mimeType,
                }
            });
            context.log('Image part added, size (chars):', imageData.length);
        }

        // Add the text prompt
        const textPrompt = imageData
            ? `Please analyze this image and ${message ? message : 'describe what you see and provide any relevant music guidance.'}`
            : message;

        currentParts.push({ text: textPrompt });

        // Use startChat for proper multi-turn support
        const chat = model.startChat({ history: historyForChat });
        const result = await chat.sendMessage(currentParts);
        const response = await result.response;
        let reply = response.text();

        context.log('Gemini reply length:', reply.length);

        // YouTube video recommendations
        const videoKeywords = ['video', 'youtube', 'tutorial', 'lesson', 'watch', 'show me', 'demonstrate', 'examples'];
        const wantsVideo = videoKeywords.some(keyword => message.toLowerCase().includes(keyword));

        if (wantsVideo && process.env.YOUTUBE_API_KEY) {
            try {
                let searchQuery = message;
                if (!message.toLowerCase().includes('music') &&
                    !message.toLowerCase().includes('piano') &&
                    !message.toLowerCase().includes('guitar')) {
                    searchQuery += ' music tutorial';
                }
                const videos = await searchYouTube(searchQuery);
                if (videos.length > 0) {
                    reply += "\n\nHere are some YouTube videos that might help:\n\n";
                    videos.forEach((video, index) => {
                        reply += `${index + 1}. **${video.title}**\n`;
                        reply += `   By: ${video.channel}\n`;
                        reply += `   Watch: ${video.url}\n\n`;
                    });
                }
            } catch (error) {
                context.log('YouTube error:', error);
                reply += "\n\nI'd love to suggest some YouTube videos, but I'm having trouble right now.";
            }
        } else if (wantsVideo && !process.env.YOUTUBE_API_KEY) {
            reply += "\n\nFor video tutorials, I recommend searching YouTube for channels like JustinGuitar or HDpiano!";
        }

        return {
            status: 200,
            headers: corsHeaders,
            jsonBody: {
                reply: reply,
                usage: { total_tokens: response.usageMetadata?.totalTokenCount || "N/A" }
            }
        };

    } catch (error) {
        context.log('Error details:', error.message, error.stack);
        return {
            status: 500,
            headers: corsHeaders,
            jsonBody: { error: "Sato is having trouble processing that. Please try again!" }
        };
    }
}

app.http('getGeminiResponse', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: getGeminiResponse
});