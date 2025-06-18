import React, { useState, useRef, useEffect } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import TerminalOutlinedIcon from '@mui/icons-material/TerminalOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const API_URL = 'http://127.0.0.1:8000/ask';
const RUN_URL = 'http://127.0.0.1:8000/run';

const isLikelyCommand = (text: string) => {
  if (!text) return false;
  if (/^ОПАСНО:/i.test(text.trim())) return true;
  return /[a-zA-Z0-9\\-_/]+/.test(text) && !/[а-яА-Я]/.test(text) && text.length < 120;
};

const modelOptions = [
  // { value: 'gpt-4o-mini', label: 'OpenAI 4o mini' },
  { value: 'qwen-2.5-coder-32b', label: 'qwen-2.5-coder-32b' },
  { value: 'deepseek-r1', label: 'deepseek-r1' },
  { value: 'llama-3.3-70b', label: 'llama-3.3-70b' },
  { value: 'phi-3-mini', label: 'phi-3-mini' },
  { value: 'gemini-1.5-pro', label: 'gemini-1.5-pro' },
  { value: 'gpt-4.1-mini', label: 'OpenAI 4.1' },
  { value: 'gpt-4o', label: 'OpenAI 4o' },
];

const Terminal: React.FC = () => {
  const [history, setHistory] = useState<
    { prompt: string; response: string; runResult?: { stdout: string; stderr: string; returncode: number } | null }[]
  >([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [runIdx, setRunIdx] = useState<number | null>(null); // индекс для модалки
  const [runLoading, setRunLoading] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [model, setModel] = useState('gpt-4o-mini');

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
        body: JSON.stringify({ prompt, model }),
      });
      const data = await res.json();
      setHistory((h) => [...h, { prompt, response: data.response || data.error || 'Ошибка' }]);
    } catch {
      setHistory((h) => [...h, { prompt, response: 'Ошибка соединения с backend' }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      handleSend();
    }
  };

  const handleRun = (idx: number) => {
    setRunIdx(idx);
    setRunError(null);
  };

  const handleRunConfirm = async () => {
    if (runIdx === null) return;
    setRunLoading(true);
    setRunError(null);
    const cmd = history[runIdx].response;
    try {
      const res = await fetch(RUN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd }),
      });
      const data = await res.json();
      setHistory((h) =>
        h.map((item, idx) =>
          idx === runIdx ? { ...item, runResult: data } : item
        )
      );
      setRunIdx(null);
      setTimeout(() => { inputRef.current?.focus(); }, 0);
    } catch {
      setRunError('Ошибка выполнения команды');
    }
    setRunLoading(false);
  };

  const handleRunCancel = () => {
    setRunIdx(null);
    setRunError(null);
    setTimeout(() => { inputRef.current?.focus(); }, 0);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #18181b 0%, #232526 100%)',
      color: '#e5e5e5',
      fontFamily: 'monospace',
      display: 'flex',
      flexDirection: 'column',
      padding: 0,
      margin: 0,
    }}>
      {/* Выбор модели */}
      <div style={{ width: '100%', maxWidth: 900, margin: '0 auto', padding: '18px 0 0 0', display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ color: '#7dd3fc', fontWeight: 600, fontSize: 15 }}>Модель:</span>
        <select
          value={model}
          onChange={e => setModel(e.target.value)}
          style={{ background: '#232526', color: '#e5e5e5', border: '1.5px solid #23272a', borderRadius: 6, fontSize: 15, padding: '6px 14px', fontFamily: 'monospace', fontWeight: 600 }}
        >
          {modelOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      {/* История */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '38px 0 0 0',
        width: '100%',
        maxWidth: 900,
        margin: '0 auto',
        transition: 'background 0.3s',
        boxSizing: 'border-box',
      }}>
        {history.map((item, idx) => (
          <div key={idx} style={{
            marginBottom: 18,
            animation: 'fadeIn 0.5s',
            borderRadius: 0,
            background: 'rgba(36,37,46,0.18)',
            boxShadow: 'none',
            padding: '0 24px',
            wordBreak: 'break-word',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', color: '#7dd3fc', fontWeight: 600, fontSize: 15, marginBottom: 2 }}>
              <ChevronRightIcon style={{ fontSize: 18, marginRight: 2, color: '#7dd3fc' }} />
              <span style={{ color: '#bfc7d5', fontWeight: 400 }}>{item.prompt}</span>
            </div>
            <div style={{ color: '#a3e635', whiteSpace: 'pre-wrap', marginLeft: 16, display: 'flex', alignItems: 'center', fontSize: 16, fontWeight: 500 }}>
              <span>{item.response}</span>
              {isLikelyCommand(item.response) && (
                <button
                  style={{ marginLeft: 14, background: 'rgba(125,211,252,0.12)', color: '#7dd3fc', border: '1px solid #7dd3fc', borderRadius: 6, padding: '3px 14px', fontSize: 15, cursor: 'pointer', fontWeight: 600, transition: 'background 0.2s, color 0.2s', display: 'flex', alignItems: 'center' }}
                  onClick={() => handleRun(idx)}
                  disabled={runLoading}
                  title="Выполнить команду в терминале"
                >
                  <PlayArrowIcon style={{ fontSize: 18, marginRight: 6 }} /> Выполнить
                </button>
              )}
            </div>
            {item.runResult && (
              <div style={{ background: 'rgba(163,230,53,0.08)', color: '#e5e5e5', fontSize: 14, marginTop: 10, padding: 10, borderRadius: 6, marginLeft: 16, boxShadow: '0 1px 4px 0 rgba(163,230,53,0.08)' }}>
                <div><b style={{ color: '#a3e635' }}>stdout:</b> <pre style={{ display: 'inline', color: '#a3e635' }}>{item.runResult.stdout || '-'}</pre></div>
                <div><b style={{ color: '#f87171' }}>stderr:</b> <pre style={{ display: 'inline', color: '#f87171' }}>{item.runResult.stderr || '-'}</pre></div>
                <div style={{ color: '#888' }}>Код возврата: {item.runResult.returncode}</div>
              </div>
            )}
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
      {/* Input */}
      <div style={{
        display: 'flex',
        borderTop: '1.5px solid #23272a',
        padding: 22,
        background: 'rgba(24,24,27,0.92)',
        width: '100%',
        maxWidth: 900,
        margin: '0 auto',
        boxSizing: 'border-box',
      }}>
        <TerminalOutlinedIcon style={{ color: '#7dd3fc', fontSize: 22, marginRight: 10, marginTop: 2 }} />
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          style={{
            flex: 1,
            background: 'rgba(24,24,27,0.92)',
            border: '1.5px solid #23272a',
            outline: 'none',
            color: '#e5e5e5',
            fontSize: 18,
            fontFamily: 'monospace',
            borderRadius: 8,
            padding: '8px 14px',
            boxShadow: '0 1px 4px 0 rgba(31,38,135,0.08)',
            transition: 'border 0.2s, box-shadow 0.2s',
            minWidth: 0,
          }}
          autoFocus
          placeholder={loading ? 'Жду ответа...' : 'Введите команду...'}
        />
      </div>
      {/* Модалка подтверждения */}
      {runIdx !== null && (
        <div style={{
          position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.35)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ background: 'rgba(24,24,27,0.98)', padding: 28, borderRadius: 14, minWidth: 340, boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)', border: '1.5px solid rgba(120,120,140,0.18)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
            <div style={{ marginBottom: 18, color: '#e5e5e5', fontSize: 17, display: 'flex', alignItems: 'center' }}>
              <PlayArrowIcon style={{ color: '#a3e635', fontSize: 22, marginRight: 8 }} />
              <b>Выполнить команду?</b>
            </div>
            <div style={{ marginTop: 10, color: '#a3e635', fontFamily: 'monospace', fontSize: 16 }}>{history[runIdx].response}</div>
            {runError && <div style={{ color: '#f87171', marginBottom: 10 }}>{runError}</div>}
            <div style={{ display: 'flex', gap: 16, marginTop: 18 }}>
              <button onClick={handleRunConfirm} disabled={runLoading} style={{ background: '#a3e635', color: '#232323', border: 'none', borderRadius: 6, padding: '8px 22px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 1px 4px 0 rgba(163,230,53,0.12)', display: 'flex', alignItems: 'center' }}>
                <PlayArrowIcon style={{ fontSize: 18, marginRight: 6 }} /> Выполнить
              </button>
              <button onClick={handleRunCancel} disabled={runLoading} style={{ background: 'rgba(125,211,252,0.12)', color: '#7dd3fc', border: '1px solid #7dd3fc', borderRadius: 6, padding: '8px 22px', fontSize: 16, cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <CloseIcon style={{ fontSize: 18, marginRight: 6 }} /> Отмена
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Адаптивные стили и анимация */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 700px) {
          div[style*='maxWidth: 900px'] {
            max-width: 100vw !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          input {
            font-size: 16px !important;
            padding: 7px 8px !important;
          }
        }
        @media (max-width: 480px) {
          div[style*='maxWidth: 900px'] {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          input {
            font-size: 15px !important;
            padding: 6px 4px !important;
          }
          span[style*='font-size: 20px'] {
            font-size: 16px !important;
            margin-right: 6px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Terminal; 