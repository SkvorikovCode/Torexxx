import React, { useState, useRef, useEffect } from 'react';

const API_URL = 'http://127.0.0.1:8000/ask';

const Terminal: React.FC = () => {
  const [history, setHistory] = useState<{ prompt: string; response: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const prompt = input;
    setInput('');
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setHistory((h) => [...h, { prompt, response: data.response || data.error || 'Ошибка' }]);
    } catch (e) {
      setHistory((h) => [...h, { prompt, response: 'Ошибка соединения с backend' }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      handleSend();
    }
  };

  return (
    <div style={{
      background: '#18181b', color: '#e5e5e5', fontFamily: 'monospace', height: '100vh', padding: 0, margin: 0, display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 16px 0 16px' }}>
        {history.map((item, idx) => (
          <div key={idx} style={{ marginBottom: 16 }}>
            <div><span style={{ color: '#7dd3fc' }}>&gt; </span>{item.prompt}</div>
            <div style={{ color: '#a3e635', whiteSpace: 'pre-wrap', marginLeft: 16 }}>{item.response}</div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
      <div style={{ display: 'flex', borderTop: '1px solid #27272a', padding: 16 }}>
        <span style={{ color: '#7dd3fc', fontWeight: 700, fontSize: 18, marginRight: 8 }}>&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#e5e5e5',
            fontSize: 18,
            fontFamily: 'monospace',
          }}
          autoFocus
          placeholder={loading ? 'Жду ответа...' : 'Введите команду...'}
        />
      </div>
    </div>
  );
};

export default Terminal; 