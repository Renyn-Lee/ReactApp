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
    const conversationHistory: any[] = body?.conversationHistory || [];
    context.log('Received message:', message);

    if (!message) {
      context.res = {
        status: 400,
        body: { error: "Message is required" }
      };
      return;
    }

    // Build conversation context for Gemini
    let conversationContext = "You are a helpful music assistant. Help users with questions about learning piano, guitar, music theory, and practice tips.\n\n";
    
    // Add conversation history
    conversationHistory.forEach((msg: any) => {
      if (msg.role === 'user') {
        conversationContext += `User: ${msg.content}\n`;
      } else if (msg.role === 'assistant') {
        conversationContext += `Assistant: ${msg.content}\n`;
      }
    });
    
    // Add current message
    conversationContext += `User: ${message}\nAssistant:`;

    // Call Gemini API
    const result = await model.generateContent(conversationContext);
    const response = await result.response;
    const reply = response.text();

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