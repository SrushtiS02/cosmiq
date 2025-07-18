import React, { useState } from 'react';
import './Chatbot.css';

export default function Chatbot() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = { from: 'user', text: input.trim() };
    setHistory(h => [...h, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text }),
      });
      const { reply } = await res.json();
      setHistory(h => [...h, { from: 'bot', text: reply }]);
    } catch (err) {
      setHistory(h => [...h, { from: 'bot', text: '❌ Error: could not reach AI.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chat-history">
        {history.map((m, i) => (
          <div key={i} className={`chat-message ${m.from}`}>
            {m.text}
          </div>
        ))}
        {loading && <div className="chat-message bot">…thinking…</div>}
      </div>
      <div className="chat-input">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask me about this image…"
        />
        <button onClick={send} disabled={loading || !input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}
