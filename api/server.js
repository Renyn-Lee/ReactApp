const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// YouTube search function
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

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ status: 'Gemini Chatbot API is running!' });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, image, mimeType = 'image/jpeg', history = [] } = req.body;

        console.log('Received message:', message);
        console.log('Has image:', !!image);
        console.log('History length:', history.length);

        if (!message?.trim() && !image) {
            return res.status(400).json({ error: "Message or image is required" });
        }

        // Same model as before — works for both text and vision
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        let reply;

        if (image) {
            // ✅ Correct way to pass image — using full contents array format
            const result = await model.generateContent({
                contents: [{
                    role: 'user',
                    parts: [
                        {
                            inlineData: {
                                data: image,        // base64 string, no data: prefix
                                mimeType: mimeType
                            }
                        },
                        {
                            text: `You are Sato, a helpful music assistant. Analyze this image and answer the user's question about it. Never say you cannot see the image.\n\nUser: ${message || 'Please describe what you see in this image and provide any relevant music guidance.'}`
                        }
                    ]
                }]
            });
            reply = result.response.text();

        } else {
            // Text-only path — exactly as original (was working)
            let fullPrompt = 'You are Sato, a helpful music assistant. Help users with questions about learning piano, guitar, music theory, and practice tips. Keep responses under 3 sentences unless providing step-by-step instructions.\n\n';

            if (history.length > 0) {
                fullPrompt += "Previous conversation:\n";
                history.forEach(msg => {
                    const role = msg.role === 'user' ? 'User' : 'Assistant';
                    fullPrompt += role + ': ' + msg.parts[0].text + '\n';
                });
                fullPrompt += "\n";
            }

            fullPrompt += 'User: ' + message + '\nAssistant:';

            const result = await model.generateContent(fullPrompt);
            reply = result.response.text();
        }

        // YouTube recommendations — unchanged from original
        const videoKeywords = ['video', 'youtube', 'tutorial', 'lesson', 'watch', 'show me', 'demonstrate', 'examples'];
        const wantsVideo = videoKeywords.some(keyword =>
            message?.toLowerCase().includes(keyword)
        );

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
                        reply += (index + 1) + '. **' + video.title + '**\n';
                        reply += '   By: ' + video.channel + '\n';
                        reply += '   Watch: ' + video.url + '\n\n';
                    });
                }
            } catch (error) {
                console.log('Error fetching YouTube videos:', error);
            }
        } else if (wantsVideo && !process.env.YOUTUBE_API_KEY) {
            reply += "\n\nFor video tutorials, I recommend searching YouTube for:\n";
            if (message.toLowerCase().includes('piano')) {
                reply += "- PianoVideoLessons\n- HDpiano\n- Piano Video Lessons\n";
            } else if (message.toLowerCase().includes('guitar')) {
                reply += "- JustinGuitar\n- Marty Music\n- GuitarLessons365\n";
            } else {
                reply += "- Music theory tutorials\n- Beginner music lessons\n- Practice techniques\n";
            }
        }

        res.json({
            reply: reply,
            usage: { total_tokens: "N/A" }
        });

    } catch (error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        res.status(500).json({
            error: "Sorry I'm a little busy right now please repeat what you said in a moment"
        });
    }
});

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});