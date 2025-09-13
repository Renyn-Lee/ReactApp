import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    if (!message) {
      context.res = {
        status: 400,
        body: { error: "Message is required" }
      };
      return;
    }

    // Prepare messages for OpenAI
    const messages = [
      { role: "system", content: "You are a helpful music assistant. Help users with questions about learning piano, guitar, music theory, and practice tips." },
      ...conversationHistory,
      { role: "user", content: message }
    ];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content;

    context.res = {
      status: 200,
      body: {
        reply: reply,
        usage: completion.usage
      }
    };

  } catch (error) {
    context.log.error('Error calling OpenAI:', error);
    context.res = {
      status: 500,
      body: { error: "Failed to get response from AI" }
    };
  }
};

export default httpTrigger;