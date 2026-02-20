import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const httpTrigger = async (context: any, req: any): Promise<void> => {
  context.log('HTTP trigger function processed a request.');

  // Enable CORS
  context.res = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    }
  };

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

    // EXPANDED BLOCKLIST
    const blockedKeywords = [
      'game', 'gaming', 'video game', 'videogame', 'gameplay',
      'minecraft', 'fortnite', 'roblox', 'league of legends', 'lol', 'valorant',
      'undertale', 'zelda', 'pokemon', 'mario', 'sonic', 'call of duty', 'cod',
      'gta', 'grand theft auto', 'fifa', 'madden', 'apex', 'overwatch',
      'counter strike', 'csgo', 'dota', 'pubg', 'warzone', 'halo',
      'destiny', 'diablo', 'skyrim', 'fallout', 'witcher', 'cyberpunk',
      'among us', 'fall guys', 'rocket league', 'hearthstone', 'osu',
      'movie', 'film', 'tv show', 'series', 'anime', 'cartoon', 'netflix',
      'meme', 'tiktok', 'viral', 'trending',
      'cooking', 'recipe', 'sport', 'football', 'basketball', 'soccer'
    ];

    const lowerMessage = message.toLowerCase();
    const isBlockedTopic = blockedKeywords.some(keyword => lowerMessage.includes(keyword));

    let reply: string;
    let isBlocked = false;

    if (isBlockedTopic) {
      context.log('🚫 BLOCKED:', message);
      reply = "I'm Sato, your music education assistant! I specialize in teaching piano, guitar, and music theory - not entertainment content like games, movies, or sports. Would you like to learn about playing an instrument or understanding music theory instead?";
      isBlocked = true;
    } else {
      context.log('✅ ALLOWED');
      
      let conversationContext = `You are Sato, a helpful music assistant specializing in piano, guitar, music theory, and practice tips.

You help users learn instruments and understand music. When suggesting resources, you can include YouTube video links in this format: "Watch: [full YouTube URL]"

Only provide YouTube links for music education topics like:
- How to play instruments (piano, guitar, drums, etc.)
- Music theory lessons
- Practice techniques
- Vocal training

Be friendly and encouraging!

Conversation history:\n\n`;

      conversationHistory.forEach((msg: any) => {
        if (msg.role === 'user') {
          conversationContext += `User: ${msg.parts?.[0]?.text || msg.content}\n`;
        } else if (msg.role === 'model' || msg.role === 'assistant') {
          conversationContext += `Assistant: ${msg.parts?.[0]?.text || msg.content}\n`;
        }
      });
      
      conversationContext += `User: ${message}\nAssistant:`;

      const result = await model.generateContent(conversationContext);
      const response = await result.response;
      reply = response.text();
    }

    context.res = {
      status: 200,
      body: {
        reply: reply,
        isBlocked: isBlocked
      }
    };

  } catch (error: any) {
    context.log.error('Error:', error);
    
    if (error.status === 429) {
      context.res = {
        status: 429,
        body: { error: "Too many requests. Please try again in a minute." }
      };
      return;
    }

    if (error.status === 401 || error.status === 403) {
      context.res = {
        status: 503,
        body: { error: "AI service temporarily unavailable." }
      };
      return;
    }

    context.res = {
      status: 500,
      body: { error: "Unable to connect to AI service." }
    };
  }
};

export default httpTrigger;