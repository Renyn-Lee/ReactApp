import { useState, useEffect, useRef } from 'react';
import './FloatingChatbot.css';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
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

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Parse YouTube videos from AI response
  const parseYouTubeVideos = (text) => {
    const videoRegex = /Watch: (https:\/\/www\.youtube\.com\/watch\?v=[a-zA-Z0-9_-]+)/g;
    const videos = [];
    let match;
    
    while ((match = videoRegex.exec(text)) !== null) {
      const videoId = getYouTubeVideoId(match[1]);
      if (videoId) {
        videos.push({
          url: match[1],
          videoId: videoId
        });
      }
    }
    return videos;
  };

  // NEW: Convert messages to Gemini history format
  const convertToGeminiHistory = (msgs) => {
    return msgs
      .filter(msg => !msg.image) // Exclude messages with images for now
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));
  };

  // Typewriter effect function
  const typewriterEffect = (text, messageIndex) => {
    return new Promise((resolve) => {
      let currentText = '';
      let charIndex = 0;
      
      const typeNextChar = () => {
        if (charIndex < text.length) {
          currentText += text[charIndex];
          charIndex++;
          
          setMessages(prevMessages => {
            const newMessages = [...prevMessages];
            newMessages[messageIndex] = {
              ...newMessages[messageIndex],
              content: currentText,
              isTyping: true
            };
            return newMessages;
          });
          
          const typingSpeed = Math.random() * 10 + 5; // Fast typing
          typingTimeoutRef.current = setTimeout(typeNextChar, typingSpeed);
          
          scrollToBottom();
        } else {
          // Finished typing - parse for videos
          const videos = parseYouTubeVideos(currentText);
          setMessages(prevMessages => {
            const newMessages = [...prevMessages];
            newMessages[messageIndex] = {
              ...newMessages[messageIndex],
              isTyping: false,
              videos: videos
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
    if (isTyping) return;

    setLoading(true);
    
    const userMessage = { 
      role: 'user', 
      content: input,
      image: selectedImage ? URL.createObjectURL(selectedImage) : null
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    try {
      // UPDATED: Convert conversation history to Gemini format
      const geminiHistory = convertToGeminiHistory(messages);

      let requestBody = {
        message: input,
        history: geminiHistory  // Changed from conversationHistory to history
      };

      if (selectedImage) {
        const base64Image = await convertImageToBase64(selectedImage);
        requestBody.image = base64Image;
        requestBody.mimeType = selectedImage.type;
      }

      // DEBUG LOGS - Add these
      console.log('🔵 Sending to URL:', 'https://reactapp-h8um.onrender.com');
      console.log('🔵 Request body:', requestBody);
      console.log('🔵 History length:', geminiHistory.length);

      const response = await fetch('https://reactapp-h8um.onrender.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      setLoading(false);
      
      if (response.ok) {
        const aiMessage = { 
          role: 'assistant', 
          content: '', 
          isTyping: true 
        };
        const messagesWithAI = [...newMessages, aiMessage];
        setMessages(messagesWithAI);
        
        setIsTyping(true);
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

  // NEW: Clear conversation function
  const clearConversation = () => {
    setMessages([]);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Dynamic styling based on expanded state
  const chatWindowStyle = {
    width: isExpanded ? '540px' : '340px',
    height: isExpanded ? '600px' : '400px',
    transition: 'all 0.3s ease-in-out'
  };

  return (
    <>
      <button 
        className="chat-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '×' : '♪'}
      </button>

      {isOpen && (
        <div className="chat-window" style={chatWindowStyle}>
          <div className="chat-header" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            fontWeight: 'bold',
            borderRadius: '12px 12px 0 0',
            position: 'relative'
          }}>
            <button 
              onClick={clearConversation}
              style={{
                position: 'absolute',
                left: '16px',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '12px',
                cursor: 'pointer',
                color: 'white'
              }}
              title="Clear chat"
            >
              Clear
            </button>
            <span style={{ textAlign: 'center', flex: 1 }}>Sato 🎵</span>
            <button 
              className="expand-button"
              onClick={() => setIsExpanded(!isExpanded)}
              style={{
                position: 'absolute',
                right: '16px',
                background: 'none',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer',
                padding: '4px',
                color: 'white'
              }}
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? '↙' : '↗'}
            </button>
          </div>

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
                  
                  {/* YouTube Mini Players */}
                  {msg.videos && msg.videos.length > 0 && (
                    <div className="youtube-videos" style={{ marginTop: '10px' }}>
                      {msg.videos.map((video, videoIndex) => (
                        <div key={videoIndex} className="youtube-player" style={{ 
                          marginBottom: '10px', 
                          borderRadius: '8px', 
                          overflow: 'hidden',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                          <iframe
                            width="100%"
                            height="200"
                            src={`https://www.youtube.com/embed/${video.videoId}`}
                            title={`YouTube video ${videoIndex + 1}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{ display: 'block' }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
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

          <div className="chat-input-area">
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
                +
              </button>
              
              <button
                onClick={askAI}
                disabled={loading || (!input.trim() && !selectedImage) || isTyping}
                className="send-button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px 16px',
                  backgroundColor: loading || (!input.trim() && !selectedImage) || isTyping ? '#6c757d' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: loading || (!input.trim() && !selectedImage) || isTyping ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  minWidth: '60px',
                  height: '36px',
                  transition: 'background-color 0.3s ease'
                }}
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