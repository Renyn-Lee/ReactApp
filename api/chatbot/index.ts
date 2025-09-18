import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

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
    context.log('Gemini API Key exists:', !!process.env.GEMINI_API_KEY);

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
          // Gemini doesn't provide detailed usage like OpenAI
          // You can remove this or add custom tracking if needed
          total_tokens: "N/A"
        }
      }
    };

  } catch (error) {
    context.log.error('Full error details:', error);
    context.log.error('Error calling Gemini:', error);
    context.res = {
      status: 500,
      body: { error: "Failed to get response from AI" }
    };
  }
};

export default httpTrigger;