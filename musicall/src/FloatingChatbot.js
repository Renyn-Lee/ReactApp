import { useState, useEffect, useRef } from 'react';
import './FloatingChatbot.css';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom when messages change or chat opens
  useEffect(() => {
    if (isOpen && messages.length > 0) {
      // Small delay to ensure DOM is rendered
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [isOpen, messages]);

  const askAI = async () => {
    if (!input.trim()) return;

    setLoading(true);
    
    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    try {
      const response = await fetch('http://localhost:7071/api/getGeminiResponse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          conversationHistory: messages
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        const aiMessage = { role: 'assistant', content: data.reply };
        setMessages([...newMessages, aiMessage]);
      } else {
        const errorMessage = { role: 'assistant', content: 'Sorry, I had trouble processing that. Please try again.' };
        setMessages([...newMessages, errorMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { role: 'assistant', content: 'Sorry, I\'m having connection issues. Please try again later.' };
      setMessages([...newMessages, errorMessage]);
    }

    setLoading(false);
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      askAI();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button 
        className="chat-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '×' : '♪'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          {/* Chat Header */}
          <div className="chat-header">
            Sato 🎵
          </div>

          {/* Messages Area */}
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="welcome-message">
                <p>👋 Hi Im Sato! I'm here to help you with any music related questions!</p>
                <p>Ask me about:</p>
                <ul>
                  <li>Help with Piano?</li>
                  <li>Guitar techniques?</li>
                  <li>Music theory?</li>
                  <li>Practice tips?</li>
                </ul>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`message ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}
                >
                  {msg.content}
                </div>
              ))
            )}
            {loading && (
              <div className="typing-indicator">
                Typing...
              </div>
            )}
            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="chat-input-area">
            <div className="input-container">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="chat-input"
                disabled={loading}
              />
              <button
                onClick={askAI}
                disabled={loading || !input.trim()}
                className="send-button"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;