import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
// Use gemini-1.5-flash instead - it has better free tier support
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const httpTrigger = async (context: any, req: any): Promise<void> => {
  context.log('HTTP trigger function processed a request.');

  // Enable CORS for your React app
  context.res = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    }
  };

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    context.res.status = 200;
    return;
  }

  if (req.method !== "POST") {
    context.res = {
      status: 405,
      body: "Method not allowed. Use POST."
    };
    return;
  }

  try {
    const body = req.body as any;
    const message: string = body?.message || '';
    const conversationHistory: any[] = body?.conversationHistory || body?.history || [];
    context.log('Received message:', message);

    if (!message) {
      context.res = {
        status: 400,
        body: { error: "Message is required" }
      };
      return;
    }

    // UPDATED: Enhanced system prompt with strict rules about YouTube links
    let conversationContext = `You are Sato, a helpful music assistant specializing in piano, guitar, music theory, and practice tips.

⚠️ ABSOLUTE RULES - NO EXCEPTIONS:

MUSIC EDUCATION TOPICS (YouTube links OK):
✅ Learning to play instruments (piano, guitar, drums, violin, etc.)
✅ Music theory (scales, chords, rhythm, notation)
✅ Practice techniques and tips
✅ Vocal training and singing techniques
✅ Reading sheet music

NON-MUSIC TOPICS (NO YOUTUBE LINKS EVER):
❌ Video games (Minecraft, Fortnite, Undertale, Zelda, etc.) - even if they have music in them
❌ Movies and TV shows - even soundtracks
❌ Cooking, sports, science, history, etc.
❌ Game soundtracks or game-related music (this is entertainment, not education)
❌ Memes or viral videos

🚨 CRITICAL INSTRUCTION FOR NON-MUSIC TOPICS:
When someone asks about games, movies, or other non-music topics:
1. Say you can't help with that topic
2. Offer to help with music education instead
3. STOP THERE - DO NOT add "Here are some videos"
4. DO NOT create numbered lists
5. DO NOT include any YouTube links whatsoever
6. DO NOT try to connect their request to music

EXAMPLES:

User: "Show me Minecraft videos"
❌ WRONG: "I can't help with Minecraft. Here are some YouTube videos: 1. ..."
✅ CORRECT: "I focus on music education rather than game content. Would you like to learn piano, guitar, or music theory instead?"

User: "Minecraft note blocks"
❌ WRONG: "While I can't help with Minecraft, here are some videos..."
✅ CORRECT: "I specialize in teaching real instruments and music theory, not game-related content. Can I help you learn to play an actual instrument?"

User: "Teach me C major scale on piano"
✅ CORRECT: "Here's a great tutorial: Watch: https://www.youtube.com/watch?v=..."

REMEMBER: 
- If it's about games/movies → Decline and stop (NO videos, NO lists)
- If it's about learning instruments → Provide helpful videos
- Never ever provide game/movie videos, even as alternatives

Conversation history:\n\n`;
    
    // Add conversation history
    conversationHistory.forEach((msg: any) => {
      if (msg.role === 'user') {
        conversationContext += `User: ${msg.parts?.[0]?.text || msg.content}\n`;
      } else if (msg.role === 'model' || msg.role === 'assistant') {
        conversationContext += `Assistant: ${msg.parts?.[0]?.text || msg.content}\n`;
      }
    });
    
    // Add current message
    conversationContext += `User: ${message}\nAssistant:`;

    // Call Gemini API
    const result = await model.generateContent(conversationContext);
    const response = await result.response;
    let reply = response.text();

    // NUCLEAR OPTION: Check for blocked topics and replace ENTIRE response
    const blockedTopics = [
      'minecraft', 'fortnite', 'roblox', 'undertale', 'zelda',
      'game', 'gaming', 'video game', 'videogame',
      'movie', 'film', 'tv show', 'series', 'anime', 'cartoon',
      'meme', 'tiktok', 'viral', 'trending',
      'cooking', 'recipe', 'sport', 'football', 'basketball',
      'science', 'math', 'history', 'geography'
    ];
    
    const lowerMessage = message.toLowerCase();
    const lowerReply = reply.toLowerCase();
    
    // Check if user question contains blocked topics
    const userAskedBlockedTopic = blockedTopics.some(topic => lowerMessage.includes(topic));
    
    // Check if AI response mentions blocked topics
    const aiMentionsBlockedTopic = blockedTopics.some(topic => lowerReply.includes(topic));
    
    // Check if response contains YouTube links (shouldn't be there for blocked topics)
    const hasYouTubeLinks = /youtube\.com|youtu\.be|Watch:/i.test(reply);
    
    // If blocked topic detected OR (refusing + has links), replace ENTIRE response
    if (userAskedBlockedTopic || (aiMentionsBlockedTopic && hasYouTubeLinks)) {
      context.log('🚫 BLOCKED TOPIC - Replacing entire response');
      context.log('User asked blocked:', userAskedBlockedTopic);
      context.log('AI mentioned blocked + has links:', aiMentionsBlockedTopic && hasYouTubeLinks);
      
      // Just use a clean, hardcoded response - don't try to parse the AI's response
      reply = "I'm Sato, your music education assistant! I specialize in helping with piano, guitar, and music theory - not entertainment content like games or movies. Would you like help learning to play an instrument or understanding music theory?";
    }

    context.res = {
      status: 200,
      body: {
        reply: reply,
        usage: {
          total_tokens: "N/A"
        }
      }
    };

  } catch (error: any) {
    context.log.error('Full error details:', error);
    
    // Check if it's a rate limit error (429)
    if (error.status === 429) {
      const retryDelay = error.errorDetails?.find((detail: any) => 
        detail['@type'] === 'type.googleapis.com/google.rpc.RetryInfo'
      )?.retryDelay || '60s';
      
      context.log.error('Rate limit exceeded. Retry after:', retryDelay);
      
      context.res = {
        status: 429,
        body: { 
          error: "Too many requests. The AI service is temporarily unavailable. Please try again in a minute.",
          retryAfter: parseInt(retryDelay) || 60
        }
      };
      return;
    }

    // Check if it's an API key error
    if (error.status === 401 || error.status === 403) {
      context.log.error('API authentication error');
      context.res = {
        status: 503,
        body: { error: "AI service is temporarily unavailable. Please try again later." }
      };
      return;
    }

    // Generic error
    context.log.error('Error calling Gemini:', error.message || error);
    context.res = {
      status: 500,
      body: { 
        error: "Unable to connect to AI service. Please try again later."
      }
    };
  }
};

export default httpTrigger;