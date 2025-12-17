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
        const imageData = body?.image; // Base64 image data
        const mimeType = body?.mimeType; // Image mime type
        const conversationHistory = body?.history || []; // Get conversation history

        context.log('Received message:', message);
        context.log('Has image:', !!imageData);
        context.log('History length:', conversationHistory.length);

        if (!message.trim() && !imageData) {
            return {
                status: 400,
                headers: corsHeaders,
                body: { error: "Message or image is required" }
            };
        }

        // Use gemini-pro (stable model)
     const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        let result;
        let reply;

        if (imageData) {
            // For images, gemini-pro doesn't support images, so we'll just process text
            // If you need image support, you'll need gemini-pro-vision
            const contextPrompt = `You are Sato, a helpful music assistant. Help users with questions about learning piano, guitar, music theory, and practice tips.

User question: ${message}

If they ask for video recommendations or tutorials, mention that you can provide YouTube video suggestions.`;

            result = await model.generateContent(contextPrompt);
            const response = await result.response;
            reply = response.text();
        } else {
            // For text-only with conversation history
            // Build the full context with history
            let fullPrompt = `You are Sato, a helpful music assistant. Help users with questions about learning piano, guitar, music theory, and practice tips. Keep responses under 3 sentences unless providing step-by-step instructions.\n\n`;
            
            // Add conversation history
            if (conversationHistory.length > 0) {
                fullPrompt += "Previous conversation:\n";
                conversationHistory.forEach(msg => {
                    const role = msg.role === 'user' ? 'User' : 'Assistant';
                    fullPrompt += `${role}: ${msg.parts[0].text}\n`;
                });
                fullPrompt += "\n";
            }
            
            fullPrompt += `User: ${message}\nAssistant:`;

            result = await model.generateContent(fullPrompt);
            const response = await result.response;
            reply = response.text();
        }

        // Check if user wants video recommendations
        const videoKeywords = ['video', 'youtube', 'tutorial', 'lesson', 'watch', 'show me', 'demonstrate', 'examples'];
        const wantsVideo = videoKeywords.some(keyword => 
            message.toLowerCase().includes(keyword)
        );

        if (wantsVideo && process.env.YOUTUBE_API_KEY) {
            try {
                // Create search query based on user message
                let searchQuery = message;
                
                // Add music context if not already present
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
                reply += "\n\nI'd love to suggest some YouTube videos, but I'm having trouble accessing them right now. Try searching for tutorials related to your question!";
            }
        } else if (wantsVideo && !process.env.YOUTUBE_API_KEY) {
            // Fallback when no YouTube API key
            reply += "\n\nFor video tutorials, I recommend searching YouTube for:\n";
            if (message.toLowerCase().includes('piano')) {
                reply += "- PianoVideoLessons\n- HDpiano\n- Piano Video Lessons\n";
            } else if (message.toLowerCase().includes('guitar')) {
                reply += "- JustinGuitar\n- Marty Music\n- GuitarLessons365\n";
            } else {
                reply += "- Music theory tutorials\n- Beginner music lessons\n- Practice techniques\n";
            }
        }

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