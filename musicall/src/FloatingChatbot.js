import { useState, useEffect, useRef } from 'react';
import './FloatingChatbot.css';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && messages.length > 0) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [isOpen, messages]);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]); // Remove data URL prefix
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const askAI = async () => {
    if (!input.trim() && !selectedImage) return;

    setLoading(true);
    
    const userMessage = { 
      role: 'user', 
      content: input,
      image: selectedImage ? URL.createObjectURL(selectedImage) : null
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    try {
      let requestBody = {
        message: input,
        conversationHistory: messages.filter(msg => !msg.image) // Remove images from history for now
      };

      // Add image data if present
      if (selectedImage) {
        const base64Image = await convertImageToBase64(selectedImage);
        requestBody.image = base64Image;
        requestBody.mimeType = selectedImage.type;
      }

      const response = await fetch('http://localhost:7071/api/getGeminiResponse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
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
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
                <p>📸 You can also upload images of sheet music, instruments, or anything music-related!</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`message ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}
                >
                  {msg.image && (
                    <img 
                      src={msg.image} 
                      alt="User uploaded" 
                      style={{ maxWidth: '200px', borderRadius: '8px', marginBottom: '8px' }}
                    />
                  )}
                  {msg.content}
                </div>
              ))
            )}
            {loading && (
              <div className="typing-indicator">
                Typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="chat-input-area">
            {/* Image preview */}
            {selectedImage && (
              <div style={{ padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '8px', margin: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img 
                    src={URL.createObjectURL(selectedImage)} 
                    alt="Selected" 
                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                  <span style={{ fontSize: '14px' }}>{selectedImage.name}</span>
                  <button 
                    onClick={removeImage}
                    style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

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
              
              {/* Image upload button */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="image-button"
                style={{ padding: '8px', marginRight: '4px', border: '1px solid #ddd', borderRadius: '4px', background: 'white' }}
                title="Upload image"
              >
                +
              </button>
              
              <button
                onClick={askAI}
                disabled={loading || (!input.trim() && !selectedImage)}
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