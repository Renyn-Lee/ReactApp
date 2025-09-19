import { useState, useEffect, useRef } from 'react';
import './FloatingChatbot.css';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

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

  // Typewriter thingy
  const typewriterEffect = (text, messageIndex) => {
    return new Promise((resolve) => {
      let currentText = '';
      let charIndex = 0;
      
      const typeNextChar = () => {
        if (charIndex < text.length) {
          currentText += text[charIndex];
          charIndex++;
          
          // Update the message in real-time
          setMessages(prevMessages => {
            const newMessages = [...prevMessages];
            newMessages[messageIndex] = {
              ...newMessages[messageIndex],
              content: currentText,
              isTyping: true
            };
            return newMessages;
          });
          
          // Random typing speed between 20-50ms for more natural feel
          const typingSpeed = Math.random() * 15 + 10;
          typingTimeoutRef.current = setTimeout(typeNextChar, typingSpeed);
          
          // Auto-scroll as text appears
          scrollToBottom();
        } else {
          // Finished typing
          setMessages(prevMessages => {
            const newMessages = [...prevMessages];
            newMessages[messageIndex] = {
              ...newMessages[messageIndex],
              isTyping: false
            };
            return newMessages;
          });
          setIsTyping(false);
          resolve();
        }
      };
      
      typeNextChar();
    });
  };

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
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const askAI = async () => {
    if (!input.trim() && !selectedImage) return;
    if (isTyping) return; // Prevent new requests while typing

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
        conversationHistory: messages.filter(msg => !msg.image)
      };

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
      setLoading(false);
      
      if (response.ok) {
        // Add empty AI message first
        const aiMessage = { 
          role: 'assistant', 
          content: '', 
          isTyping: true 
        };
        const messagesWithAI = [...newMessages, aiMessage];
        setMessages(messagesWithAI);
        
        setIsTyping(true);
        
        // Start typewriter effect
        await typewriterEffect(data.reply, messagesWithAI.length - 1);
        
      } else {
        const errorMessage = { 
          role: 'assistant', 
          content: 'Sorry, I had trouble processing that. Please try again.' 
        };
        setMessages([...newMessages, errorMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
      const errorMessage = { 
        role: 'assistant', 
        content: 'Sorry, I\'m having connection issues. Please try again later.' 
      };
      setMessages([...newMessages, errorMessage]);
    }

    setInput('');
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isTyping) {
      askAI();
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

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
                  className={`message ${msg.role === 'user' ? 'user-message' : 'ai-message'} ${msg.isTyping ? 'typing' : ''}`}
                >
                  {msg.image && (
                    <img 
                      src={msg.image} 
                      alt="User uploaded" 
                      style={{ maxWidth: '200px', borderRadius: '8px', marginBottom: '8px' }}
                    />
                  )}
                  <span>{msg.content}</span>
                  {msg.isTyping && <span className="typing-cursor">|</span>}
                </div>
              ))
            )}
            {loading && (
              <div className="typing-indicator">
                Thinking...
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
                placeholder={isTyping ? "Sato is typing..." : "Ask me anything..."}
                className="chat-input"
                disabled={loading || isTyping}
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
                disabled={isTyping}
                style={{ 
                  padding: '8px', 
                  marginRight: '4px', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px', 
                  background: isTyping ? '#f0f0f0' : 'white',
                  cursor: isTyping ? 'not-allowed' : 'pointer'
                }}
                title="Upload image"
              >
                ╋
              </button>
              
              <button
                onClick={askAI}
                disabled={loading || (!input.trim() && !selectedImage) || isTyping}
                className="send-button"
              >
                {loading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;