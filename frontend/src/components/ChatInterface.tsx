import React, { useState, useEffect, useRef } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface Message {
  _id?: string;
  user: 'user' | 'assistant';
  message: string;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/chat`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessages(data.messages);
        }
      })
      .catch((err) => console.error('Error loading chat history:', err));
  }, []);

  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [...prev, data.userMessage, data.assistantMessage]);
      }
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] border rounded p-4">
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto mb-2 space-y-2 bg-gray-50 p-2 rounded"
      >
        {messages.length === 0 && <p className="text-gray-400 text-sm">Start chatting…</p>}
        {messages.map((msg, idx) => (
          <div
            key={msg._id || idx}
            className={`text-sm ${msg.user === 'user' ? 'text-blue-700' : 'text-green-700'}`}
          >
            <strong>{msg.user === 'user' ? 'You' : 'AI'}:</strong> {msg.message}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded px-2 py-1 text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
        />
        <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
