const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// gemini-1.5-flash is the reliable vision model — 2.5-flash is text-only preview
const VISION_MODEL = 'gemini-1.5-flash';

const SATO_SYSTEM_INSTRUCTION = `You are Sato, a friendly music assistant mid-conversation.
NEVER greet the user or say hello — the conversation is already in progress.
You have full vision capabilities and CAN see and analyze images.
When an image is provided, describe what you see and give music-related guidance.
Help with piano, guitar, music theory, sheet music, chord charts, and practice tips.
Keep responses under 3 sentences unless giving step-by-step instructions.`;

const searchYouTube = async (query) => {
    if (!process.env.YOUTUBE_API_KEY) return [];
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
                url: 'https://www.youtube.com/watch?v=' + item.id.videoId
            }));
        }
        return [];
    } catch (error) {
        console.error('YouTube API error:', error);
        return [];
    }
};

app.get('/', (req, res) => {
    res.json({ status: 'Sato Music Assistant API is running!' });
});

app.post('/api/chat', async (req, res) => {
    try {
        const { message, image, mimeType = 'image/jpeg', history = [] } = req.body;

        console.log('Message:', message);
        console.log('Has image:', !!image, '| mimeType:', mimeType);
        console.log('History length:', history.length);

        if (!message?.trim() && !image) {
            return res.status(400).json({ error: "Message or image is required" });
        }

        const model = genAI.getGenerativeModel({
            model: VISION_MODEL,
            systemInstruction: SATO_SYSTEM_INSTRUCTION,
        });

        // Build chat history — filter out any image messages since Gemini
        // history only supports text parts in prior turns
        const chatHistory = history
            .filter(msg => msg?.parts?.[0]?.text)
            .map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.parts[0].text }],
            }));

        // Build the current message parts
        const currentParts = [];

        if (image) {
            // Image MUST come before text for Gemini multimodal
            currentParts.push({
                inlineData: {
                    data: image,        // raw base64, no "data:image/..." prefix
                    mimeType: mimeType,
                }
            });
            console.log('Image size (chars):', image.length);
        }

        currentParts.push({
            text: image
                ? `Please analyze this image. ${message || 'Describe what you see and provide music guidance.'}`
                : message
        });

        const chat = model.startChat({ history: chatHistory });
        const result = await chat.sendMessage(currentParts);
        const response = await result.response;
        let reply = response.text();

        console.log('Reply preview:', reply.substring(0, 120));

        // YouTube recommendations
        const videoKeywords = ['video', 'youtube', 'tutorial', 'lesson', 'watch', 'show me', 'demonstrate', 'examples'];
        const wantsVideo = videoKeywords.some(k => message?.toLowerCase().includes(k));

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
                    videos.forEach((video, i) => {
                        reply += `${i + 1}. **${video.title}**\n`;
                        reply += `   By: ${video.channel}\n`;
                        reply += `   Watch: ${video.url}\n\n`;
                    });
                }
            } catch (err) {
                console.log('YouTube error:', err);
            }
        } else if (wantsVideo) {
            reply += "\n\nFor video tutorials, I recommend searching YouTube for channels like JustinGuitar or HDpiano!";
        }

        res.json({
            reply,
            usage: { total_tokens: response.usageMetadata?.totalTokenCount || "N/A" }
        });

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({
            error: "Sorry, I'm having trouble right now. Please try again in a moment."
        });
    }
});

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});