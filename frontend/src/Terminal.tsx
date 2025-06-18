import React, { useState, useRef, useEffect } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import TerminalOutlinedIcon from '@mui/icons-material/TerminalOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import StarIcon from '@mui/icons-material/Star';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

const API_URL = 'http://127.0.0.1:8000/ask';
const RUN_URL = 'http://127.0.0.1:8000/run';

const isLikelyCommand = (text: string) => {
  if (!text) return false;
  if (/^ОПАСНО:/i.test(text.trim())) return true;
  return /[a-zA-Z0-9\\-_/]+/.test(text) && !/[а-яА-Я]/.test(text) && text.length < 120;
};

const modelOptions = [
  { value: 'qwen-2.5-coder-32b', label: 'qwen-2.5-coder-32b', premium: true },
  // { value: 'deepseek-r1', label: 'deepseek-r1' },
  { value: 'llama-3.3-70b', label: 'llama-3.3-70b', premium: true },
  // { value: 'phi-3-mini', label: 'phi-3-mini' }, // Не работает
  { value: 'gemini-1.5-pro', label: 'gemini-1.5-pro', premium: true },
  { value: 'gpt-4.1-mini', label: 'GPT 4.1', premium: true },
  { value: 'gpt-4o-mini', label: 'GPT 4o mini', premium: false },
  { value: 'gpt-4o', label: 'GPT 4o', premium: true },
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
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [cwd, setCwd] = useState<string>('');

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    // Получаем cwd при монтировании
    fetch('http://127.0.0.1:8000/cwd')
      .then(r => r.json())
      .then(data => setCwd(data.cwd || ''));
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
      if (data.cwd) setCwd(data.cwd);
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
      {/* Текущая директория */}
      <div style={{ width: '100%', maxWidth: 900, margin: '0 auto', padding: '10px 0 0 0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <FolderOpenIcon style={{ color: '#a3e635', fontSize: 20, marginRight: 4 }} />
        <span style={{ color: '#a3e635', fontWeight: 600, fontSize: 15, fontFamily: 'monospace', wordBreak: 'break-all' }}>{cwd}</span>
      </div>
      {/* Выбор модели */}
      <div style={{ width: '100%', maxWidth: 900, margin: '0 auto', padding: '18px 0 0 0', display: 'flex', alignItems: 'center', gap: 16, position: 'relative', zIndex: 10 }}>
        {/* <span style={{ color: '#7dd3fc', fontWeight: 600, fontSize: 15 }}>Модель:</span> */}
        <div style={{ position: 'relative', minWidth: 220 }}>
          <button
            onClick={() => setShowModelDropdown(v => !v)}
            style={{
              background: '#232526',
              color: '#e5e5e5',
              border: '1.5px solid #23272a',
              borderRadius: 6,
              fontSize: 15,
              padding: '6px 14px',
              fontFamily: 'monospace',
              fontWeight: 600,
              width: '100%',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
              position: 'relative',
              minHeight: 36,
            }}
          >
            <span>{modelOptions.find(opt => opt.value === model)?.label || model}</span>
            {modelOptions.find(opt => opt.value === model)?.premium && (
              <a
                href="https://t.me/JustFW"
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                style={{ display: 'flex', alignItems: 'center', marginLeft: 6 }}
                title="Премиум модель — узнать больше в Telegram"
              >
                <StarIcon style={{ color: '#facc15', fontSize: 18, marginRight: 2, verticalAlign: 'middle', filter: 'drop-shadow(0 0 2px #facc15)' }} />
              </a>
            )}
            <span style={{ marginLeft: 'auto', color: '#7dd3fc', fontSize: 16, fontWeight: 700, userSelect: 'none' }}>▼</span>
          </button>
          {showModelDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '110%',
                left: 0,
                width: '100%',
                background: '#18181b',
                border: '1.5px solid #23272a',
                borderRadius: 8,
                boxShadow: '0 4px 24px 0 rgba(31,38,135,0.18)',
                zIndex: 100,
                marginTop: 4,
                overflow: 'hidden',
              }}
            >
              {modelOptions.map(opt => (
                opt.premium ? (
                  <a
                    key={opt.value}
                    href="https://t.me/JustFW"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 16px',
                      fontSize: 15,
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      color: '#facc15',
                      background: model === opt.value ? 'rgba(125,211,252,0.08)' : 'transparent',
                      cursor: 'pointer',
                      opacity: 0.7,
                      position: 'relative',
                      userSelect: 'none',
                      textDecoration: 'none',
                    }}
                    title="Премиум модель — узнать больше в Telegram"
                    onClick={() => setShowModelDropdown(false)}
                  >
                    <span>{opt.label}</span>
                    <StarIcon style={{ color: '#facc15', fontSize: 18, marginRight: 2, verticalAlign: 'middle', filter: 'drop-shadow(0 0 2px #facc15)' }} />
                    <span style={{ fontSize: 13, color: '#facc15', marginLeft: 2, fontWeight: 500 }}>
                      Премиум
                    </span>
                  </a>
                ) : (
                  <div
                    key={opt.value}
                    onClick={() => {
                      setModel(opt.value);
                      setShowModelDropdown(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 16px',
                      fontSize: 15,
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      color: '#e5e5e5',
                      background: model === opt.value ? 'rgba(125,211,252,0.08)' : 'transparent',
                      cursor: 'pointer',
                      opacity: 1,
                      position: 'relative',
                      userSelect: 'none',
                    }}
                  >
                    <span>{opt.label}</span>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
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
            transition: 'background 0.3s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', color: '#7dd3fc', fontWeight: 600, fontSize: 15, marginBottom: 2 }}>
              <ChevronRightIcon style={{ fontSize: 18, marginRight: 2, color: '#7dd3fc' }} />
              <span style={{ color: '#bfc7d5', fontWeight: 400 }}>{item.prompt}</span>
            </div>
            <div style={{ color: '#a3e635', whiteSpace: 'pre-wrap', marginLeft: 16, display: 'flex', alignItems: 'center', fontSize: 16, fontWeight: 500 }}>
              <span>{item.response}</span>
              {isLikelyCommand(item.response) && (
                <button
                  style={{ marginLeft: 14, background: 'rgba(125,211,252,0.12)', color: '#7dd3fc', border: '1px solid #7dd3fc', borderRadius: 6, padding: '3px 14px', fontSize: 15, cursor: 'pointer', fontWeight: 600, transition: 'background 0.2s, color 0.2s', display: 'flex', alignItems: 'center', position: 'relative' }}
                  onClick={() => handleRun(idx)}
                  disabled={runLoading}
                  title="Выполнить команду в терминале"
                >
                  {runLoading && runIdx === idx ? (
                    <span className="loader" style={{ marginRight: 6, width: 16, height: 16, border: '2px solid #7dd3fc', borderTop: '2px solid transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
                  ) : (
                    <PlayArrowIcon style={{ fontSize: 18, marginRight: 6 }} />
                  )}
                  Выполнить
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
        {/* Анимация ожидания ответа */}
        {loading && (
          <div style={{ margin: '0 24px 18px 24px', minHeight: 32, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="blinking-cursor" style={{ width: 18, height: 18, background: '#7dd3fc', borderRadius: 4, opacity: 0.7, animation: 'blink 1s steps(2, start) infinite' }} />
            <span style={{ color: '#bfc7d5', fontSize: 16, fontFamily: 'monospace', opacity: 0.7 }}>Жду ответа...</span>
          </div>
        )}
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
        @keyframes blink {
          0% { opacity: 0.7; }
          50% { opacity: 0.1; }
          100% { opacity: 0.7; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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