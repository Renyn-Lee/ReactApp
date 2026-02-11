const { GoogleGenerativeAI } = require('@google/generative-ai');
const { app } = require('@azure/functions');

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// YouTube search function
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
        const imageData = body?.image; // Base64 image data (ensure this is just the base64 string, no prefix)
        const mimeType = body?.mimeType || 'image/jpeg'; // Default to jpeg if not provided
        const conversationHistory = body?.history || []; // Get conversation history

        context.log('Received message:', message);
        context.log('Has image:', !!imageData);

        if (!message.trim() && !imageData) {
            return {
                status: 400,
                headers: corsHeaders,
                body: { error: "Message or image is required" }
            };
        }

        // Use gemini-1.5-flash for stable multimodal support
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Prepare the content parts for Multimodal input
        let promptParts = [];

        // 1. Add System Instructions and History as text
        let contextPrefix = `You are Sato, a helpful music assistant. Help users with piano, guitar, music theory, and practice tips. Keep responses under 3 sentences unless providing step-by-step instructions.\n\n`;
        
        if (conversationHistory.length > 0) {
            contextPrefix += "Previous conversation:\n";
            conversationHistory.forEach(msg => {
                const role = msg.role === 'user' ? 'User' : 'Assistant';
                contextPrefix += `${role}: ${msg.parts[0].text}\n`;
            });
            contextPrefix += "\n";
        }
        
        promptParts.push({ text: contextPrefix + `User: ${message}` });

        // 2. Add the Image part if it exists
        if (imageData) {
            promptParts.push({
                inlineData: {
                    data: imageData,
                    mimeType: mimeType
                }
            });
        }

        // Generate content using the parts array
        const result = await model.generateContent(promptParts);
        const response = await result.response;
        let reply = response.text();

        // Check if user wants video recommendations
        const videoKeywords = ['video', 'youtube', 'tutorial', 'lesson', 'watch', 'show me', 'demonstrate', 'examples'];
        const wantsVideo = videoKeywords.some(keyword => 
            message.toLowerCase().includes(keyword)
        );

        if (wantsVideo && process.env.YOUTUBE_API_KEY) {
            try {
                let searchQuery = message;
                if (!message.toLowerCase().includes('music') && 
                    !message.toLowerCase().includes('piano') && 
                    !message.toLowerCase().includes('guitar')) {
                    searchQuery += ' music tutorial';
                }

                context.log('Searching YouTube for:', searchQuery);
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
                context.log('Error fetching YouTube videos:', error);
                reply += "\n\nI'd love to suggest some YouTube videos, but I'm having trouble accessing them right now.";
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
        context.log('Error details:', error);
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