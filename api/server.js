const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased for images

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// YouTube search function
const searchYouTube = async (query) => {
    if (!process.env.YOUTUBE_API_KEY) {
        return [];
    }
    
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
    const { message, image, mimeType, history = [] } = req.body;

    console.log('Received message:', message);
    console.log('Has image:', !!image);
    console.log('History length:', history.length);

    if (!message.trim() && !image) {
      return res.status(400).json({ error: "Message or image is required" });
    }

    // Use gemini-2.5-flash (same as your Azure Function)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    let result;
    let reply;

    if (image) {
      // For images
      const contextPrompt = 'Your name is Sato, a helpful music assistant. Help users with questions about learning piano, guitar, music theory, and practice tips.\n\nUser question: ' + message + '\n\nIf they ask for video recommendations or tutorials, mention that you can provide YouTube video suggestions.';

      result = await model.generateContent(contextPrompt);
      const response = await result.response;
      reply = response.text();
    } else {
      // For text-only with conversation history
      let fullPrompt = 'You are Sato, a helpful music assistant. Help users with questions about learning piano, guitar, music theory, and practice tips. Keep responses under 3 sentences unless providing step-by-step instructions.\n\n';
      
      // Add conversation history
      if (history.length > 0) {
        fullPrompt += "Previous conversation:\n";
        history.forEach(msg => {
          const role = msg.role === 'user' ? 'User' : 'Assistant';
          fullPrompt += role + ': ' + msg.parts[0].text + '\n';
        });
        fullPrompt += "\n";
      }
      
      fullPrompt += 'User: ' + message + '\nAssistant:';

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
        let searchQuery = message;
        
        // Add music context if not already present
        if (!message.toLowerCase().includes('music') && 
            !message.toLowerCase().includes('piano') && 
            !message.toLowerCase().includes('guitar')) {
          searchQuery += ' music tutorial';
        }

        console.log('Searching YouTube for:', searchQuery);
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

    res.json({
      reply: reply,
      usage: { total_tokens: "N/A" }
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: "Sorry I'm a little busy right now please repeat what you said in a moment"
    });
  }
});

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});