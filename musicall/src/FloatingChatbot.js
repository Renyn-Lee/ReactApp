import { useState, useEffect, useRef, useCallback } from 'react';
import './FloatingChatbot.css';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Keep a ref to isTyping so we can cancel safely in clearConversation
  const isTypingRef = useRef(false);
  useEffect(() => { isTypingRef.current = isTyping; }, [isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && messages.length > 0) setTimeout(scrollToBottom, 100);
  }, [isOpen, messages]);

  useEffect(() => {
    return () => { if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl); };
  }, [imagePreviewUrl]);

  const getYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const parseYouTubeVideos = (text) => {
    const videoRegex = /Watch: (https:\/\/www\.youtube\.com\/watch\?v=[a-zA-Z0-9_-]+)/g;
    const videos = [];
    let match;
    while ((match = videoRegex.exec(text)) !== null) {
      const videoId = getYouTubeVideoId(match[1]);
      if (videoId) videos.push({ url: match[1], videoId });
    }
    return videos;
  };

  const convertToGeminiHistory = (msgs) => {
    return msgs
      .filter((msg) => msg && !msg.imageUrl)
      .map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content || '' }],
      }));
  };

  // FIX 1: typewriterEffect accepts a stable messageId instead of an index.
  // We look up the message by id, so stale-closure index mismatches can't crash.
  const typewriterEffect = useCallback((text, messageId, skipVideos = false) => {
    return new Promise((resolve) => {
      let currentText = '';
      let charIndex = 0;

      const typeNextChar = () => {
        // If the timeout was cleared (e.g. conversation was cleared), stop silently
        if (!typingTimeoutRef.current && charIndex > 0) {
          resolve();
          return;
        }

        if (charIndex < text.length) {
          currentText += text[charIndex];
          charIndex++;

          setMessages((prev) => {
            // Guard: if messages were cleared, prev may not contain our message
            const idx = prev.findIndex((m) => m.id === messageId);
            if (idx === -1) return prev; // message was cleared — don't touch state
            const updated = [...prev];
            updated[idx] = { ...updated[idx], content: currentText, isTyping: true };
            return updated;
          });

          typingTimeoutRef.current = setTimeout(typeNextChar, Math.random() * 10 + 5);
          scrollToBottom();
        } else {
          const videos = skipVideos ? [] : parseYouTubeVideos(currentText);
          setMessages((prev) => {
            const idx = prev.findIndex((m) => m.id === messageId);
            if (idx === -1) return prev;
            const updated = [...prev];
            updated[idx] = { ...updated[idx], isTyping: false, videos };
            return updated;
          });
          setIsTyping(false);
          resolve();
        }
      };

      typeNextChar();
    });
  }, []);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Please select an image file.'); return; }
    if (file.size > 4 * 1024 * 1024) { alert('Image must be under 4 MB.'); return; }
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setSelectedImage(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  const removeImage = () => {
    if (imagePreviewUrl) { URL.revokeObjectURL(imagePreviewUrl); setImagePreviewUrl(null); }
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const convertImageToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = () => reject(new Error('Failed to read image'));
      reader.readAsDataURL(file);
    });

  const askAI = async () => {
    if (!input.trim() && !selectedImage) return;
    if (isTyping || loading) return;

    setLoading(true);

    const snapshotImageUrl = imagePreviewUrl;
    const snapshotImageFile = selectedImage;
    const snapshotInput = input;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: snapshotInput,
      imageUrl: snapshotImageUrl || null,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    setInput('');
    setSelectedImage(null);
    setImagePreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    try {
      const geminiHistory = convertToGeminiHistory(messages);
      const requestBody = {
        message: snapshotInput,
        history: geminiHistory,
      };

      if (snapshotImageFile) {
        const base64Image = await convertImageToBase64(snapshotImageFile);
        requestBody.image = base64Image;
        requestBody.mimeType = snapshotImageFile.type;
        console.log('📎 Image attached:', snapshotImageFile.name, snapshotImageFile.type);
      }

      const response = await fetch('https://reactapp-h8um.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok && data.reply) {
        // Give the AI message a stable id so typewriter can find it even after re-renders
        const aiId = `ai-${Date.now()}`;
        const aiMessage = { id: aiId, role: 'assistant', content: '', isTyping: true, videos: [] };
        setMessages([...newMessages, aiMessage]);
        setIsTyping(true);
        await typewriterEffect(data.reply, aiId, !!data.isBlocked);
      } else {
        setMessages([
          ...newMessages,
          {
            id: `ai-${Date.now()}`,
            role: 'assistant',
            content: data.error || 'Sorry, I had trouble processing that. Please try again.',
          },
        ]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setLoading(false);
      setMessages([
        ...newMessages,
        { id: `ai-${Date.now()}`, role: 'assistant', content: "Sorry, I'm having connection issues. Please try again later." },
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isTyping && !loading) askAI();
  };

  // FIX 1 (continued): cancel any in-flight typewriter before wiping messages
  const clearConversation = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    setIsTyping(false);
    setLoading(false);
    setMessages([]);
    removeImage();
  };

  useEffect(() => {
    return () => { if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current); };
  }, []);

  const chatWindowStyle = {
    width: isExpanded ? '540px' : '340px',
    height: isExpanded ? '600px' : '400px',
    transition: 'all 0.3s ease-in-out',
  };

  return (
    <>
      <button className="chat-button" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '×' : '♪'}
      </button>

      {isOpen && (
        <div className="chat-window" style={chatWindowStyle}>

          <div className="chat-header">
            <button
              onClick={clearConversation}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '12px' }}
            >
              Clear
            </button>
            <span>Sato 🎵</span>
            <button
              className="expand-button"
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? '↙' : '↗'}
            </button>
          </div>

          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="welcome-message">
                <p>👋 Hi I'm Sato! I'm here to help you with any music related questions!</p>
                <p>Ask me about:</p>
                <ul>
                  <li>Help with Piano?</li>
                  <li>Guitar techniques?</li>
                  <li>Music theory?</li>
                  <li>Practice tips?</li>
                </ul>
              </div>
            ) : (
              messages.map((msg) => {
                // Safety guard — skip any undefined entries
                if (!msg) return null;
                return (
                  <div
                    key={msg.id}
                    className={`message ${msg.role === 'user' ? 'user-message' : 'ai-message'}${msg.isTyping ? ' typing' : ''}`}
                  >
                    {msg.imageUrl && (
                      <img
                        src={msg.imageUrl}
                        alt="User upload"
                        style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', marginBottom: '6px', display: 'block' }}
                      />
                    )}
                    <span>
                      {msg.content}
                      {msg.isTyping && <span className="typing-cursor">|</span>}
                    </span>
                    {msg.videos && msg.videos.length > 0 && (
                      <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {msg.videos.map((video, i) => (
                          <iframe
                            key={i}
                            width="100%"
                            height="180"
                            src={`https://www.youtube.com/embed/${video.videoId}`}
                            title={`Video ${i + 1}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{ borderRadius: '8px' }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {loading && <div className="typing-indicator">Thinking...</div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            {imagePreviewUrl && (
              <div style={{ padding: '6px 8px', backgroundColor: '#f0f4ff', borderRadius: '8px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src={imagePreviewUrl} alt="Preview" style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />
                <span style={{ fontSize: '12px', color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                  {selectedImage?.name}
                </span>
                <button onClick={removeImage} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#888', lineHeight: 1, flexShrink: 0 }} title="Remove image">
                  ×
                </button>
              </div>
            )}

            <div className="input-container">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isTyping ? 'Sato is typing…' : imagePreviewUrl ? 'Ask about this image…' : 'Ask me anything…'}
                className="chat-input"
                disabled={loading || isTyping}
              />
              <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/jpeg,image/png,image/gif,image/webp" style={{ display: 'none' }} />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="image-button"
                disabled={loading || isTyping}
                title="Attach image"
                style={{
                  border: `1px solid ${imagePreviewUrl ? '#007bff' : '#ddd'}`,
                  borderRadius: '4px',
                  background: imagePreviewUrl ? '#e8f0fe' : 'white',
                  cursor: loading || isTyping ? 'not-allowed' : 'pointer',
                }}
              >
                📎
              </button>
              <button
                onClick={askAI}
                disabled={loading || (!input.trim() && !selectedImage) || isTyping}
                className="send-button"
              >
                {loading ? 'Sending…' : 'Send'}
              </button>
            </div>
          </div>

        </div>
      )}
    </>
  );
};

export default FloatingChatbot;