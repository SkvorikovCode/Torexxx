import React, { useState, useRef, useEffect } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import TerminalOutlinedIcon from '@mui/icons-material/TerminalOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import DiamondIcon from '@mui/icons-material/Diamond';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const TERMINAL_URL = 'http://127.0.0.1:8000/terminal';
const ASK_URL = 'http://127.0.0.1:8000/ask';
const RUN_URL = 'http://127.0.0.1:8000/run';

const HISTORY_KEY = 'terminal_history';
const FAVORITES_KEY = 'terminal_favorites';

const isLikelyCommand = (text: string) => {
  if (!text) return false;
  if (/^ОПАСНО:/i.test(text.trim())) return true;
  return /[a-zA-Z0-9\\-_/]+/.test(text) && !/[а-яА-Я]/.test(text) && text.length < 120;
};

const modelOptions = [
  { value: 'qwen-2.5-coder-32b', label: 'QWEN Coder', premium: true },
  // { value: 'deepseek-r1', label: 'deepseek-r1' },
  { value: 'llama-3.3-70b', label: 'LLAMA 3.3', premium: true },
  // { value: 'phi-3-mini', label: 'phi-3-mini' }, // Не работает
  { value: 'gemini-1.5-pro', label: 'GEMINI PRO', premium: true },
  { value: 'gpt-4.1-mini', label: 'GPT 4.1', premium: true },
  { value: 'gpt-4o-mini', label: 'GPT 4o mini', premium: false },
  { value: 'gpt-4o', label: 'GPT 4o', premium: true },
];

// Компонент выбора модели
const ModelDropdown: React.FC<{
  model: string;
  setModel: (m: string) => void;
  showModelDropdown: boolean;
  setShowModelDropdown: (v: boolean) => void;
}> = ({ model, setModel, showModelDropdown, setShowModelDropdown }) => (
  <div style={{ position: 'relative', minWidth: 220 }}>
    <button
      onClick={() => setShowModelDropdown(!showModelDropdown)}
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
          <DiamondIcon style={{ color: '#7dd3fc', fontSize: 18 }} />
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
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: 'linear-gradient(270deg, #facc15, #7dd3fc, #a3e635, #facc15)',
                backgroundSize: '400% 400%',
                padding: 1.5,
                animation: 'premium-gradient-anim 2.5s linear infinite',
                boxSizing: 'border-box',
                border: '1.5px solid transparent',
              }}>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: '#f9fafb',
                }}>
                  <WorkspacePremiumIcon style={{ color: '#eab308', fontSize: 15 }} />
                </span>
              </span>
            </a>
          ) :
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
        ))}
      </div>
    )}
  </div>
);

const Terminal: React.FC = () => {
  const [history, setHistory] = useState<
    { prompt: string; response: string; runResult?: { stdout: string; stderr: string; returncode: number } | null }[]
  >([]);
  const [favorites, setFavorites] = useState<
    { prompt: string; response: string }[]
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
  const [manualMode, setManualMode] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [showLogin, setShowLogin] = useState(false);
  const [mode, setMode] = useState<'terminal' | 'chat'>('terminal');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    // Получаем cwd при монтировании
    fetch('http://127.0.0.1:8000/cwd')
      .then(r => r.json())
      .then(data => setCwd(data.cwd || ''));
    // Загрузка истории и избранного из localStorage при монтировании
    const savedHistory = localStorage.getItem(HISTORY_KEY);
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    const savedFav = localStorage.getItem(FAVORITES_KEY);
    if (savedFav) setFavorites(JSON.parse(savedFav));
  }, []);

  useEffect(() => {
    // Не сохраняем результаты выполнения в localStorage, чтобы избежать проблем с размером
    const historyToSave = history.map(({ /*runResult,*/ ...rest }) => rest);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(historyToSave));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const prompt = input;
    setInput('');
    try {
      if (manualMode) {
        // Ручной режим: отправляем команду напрямую
        const res = await fetch(RUN_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: prompt, cwd }),
        });
        const data = await res.json();
        if(data.cwd) setCwd(data.cwd); // Обновляем CWD
        setHistory((h) => [
          ...h,
          {
            prompt,
            response: `(Ручной ввод)`,
            runResult: data,
          },
        ]);
      } else {
        // AI режим: получаем команду от AI
        const res = await fetch(TERMINAL_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            model,
            mode: 'ai', // Явно указываем режим
            cwd, // Передаем CWD для контекста
          }),
        });
        const data = await res.json();
        setHistory((h) => [...h, { prompt, response: data.response || data.error }]);
      }
    } catch (error) {
      setHistory((h) => {
        const newHistory = [...h, { prompt, response: 'Ошибка соединения с backend' }];
        return newHistory.slice(-10);
      });
      console.error(error);
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
    const commandToRun = history[runIdx].response;

    try {
      const res = await fetch(RUN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: commandToRun, cwd }), // Передаем CWD
      });
      const data = await res.json();
      if (data.error) {
        setRunError(data.error);
      } else {
        // Обновляем историю с результатом выполнения
        setHistory((h) =>
          h.map((item, index) => (index === runIdx ? { ...item, runResult: data } : item))
        );
        if (data.cwd) setCwd(data.cwd); // Обновляем CWD
        setRunIdx(null); // Закрываем модальное окно
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setRunError(errorMsg);
    } finally {
      setRunLoading(false);
    }
  };

  const handleRunCancel = () => {
    setRunIdx(null);
    setRunError(null);
    setTimeout(() => { inputRef.current?.focus(); }, 0);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isFavorite = (item: { prompt: string; response: string }) => {
    return favorites.some(f => f.prompt === item.prompt && f.response === item.response);
  };

  const handleToggleFavorite = (item: { prompt: string; response: string }) => {
    if (isFavorite(item)) {
      setFavorites(favs => favs.filter(f => !(f.prompt === item.prompt && f.response === item.response)));
    } else {
      setFavorites(favs => [...favs, { prompt: item.prompt, response: item.response }]);
    }
  };

  const handleRunFavorite = (item: { prompt: string; response: string }) => {
    setInput(item.response);
    setManualMode(true);
    inputRef.current?.focus();
  };

  // Функция отправки сообщения в чат
  async function handleChatSend() {
    if (!chatInput.trim()) return;
    const prompt = chatInput;
    setChatInput('');
    setChatHistory((h) => [...h, { role: 'user', text: prompt }]);
    setLoading(true);
    try {
      const res = await fetch(ASK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          model,
          // Тут можно передать другой system_prompt для чата, если нужно
        }),
      });
      const data = await res.json();
      setChatHistory((h) => [...h, { role: 'ai', text: data.response || data.error }]);
    } catch (error) {
      setChatHistory(h => [...h, { role: 'ai', text: 'Ошибка соединения с backend' }]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (mode === 'chat') {
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
        {/* Верхняя панель с кнопкой возврата и выбором модели */}
        <div style={{ position: 'absolute', top: 18, left: 32, zIndex: 110, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Button
            variant="text"
            aria-label="Back to terminal"
            onClick={() => setMode('terminal')}
            style={{
              minWidth: 0,
              minHeight: 0,
              padding: 0,
              borderRadius: '50%',
              background: 'rgba(36,37,46,0.18)',
              border: '1.5px solid #23272a',
              color: '#7dd3fc',
              boxShadow: '0 1px 4px 0 rgba(31,38,135,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.18s, border 0.18s',
            }}
            onMouseOver={e => (e.currentTarget.style.background = 'rgba(125,211,252,0.10)')}
            onMouseOut={e => (e.currentTarget.style.background = 'rgba(36,37,46,0.18)')}
          >
            <TerminalOutlinedIcon style={{ fontSize: 22, color: '#7dd3fc' }} />
          </Button>
          <span style={{ fontWeight: 700, fontSize: 20, color: '#7dd3fc', letterSpacing: 1 }}>Чат с нейросетью</span>
        </div>
        <div style={{ position: 'absolute', top: 18, right: 32, zIndex: 100, minWidth: 220, display: 'flex', alignItems: 'center', gap: 16 }}>
          <ModelDropdown model={model} setModel={setModel} showModelDropdown={showModelDropdown} setShowModelDropdown={setShowModelDropdown} />
        </div>
        {/* История чата */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '80px 0 0 0',
          width: '100%',
          maxWidth: 700,
          margin: '0 auto',
          transition: 'background 0.3s',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {chatHistory.length === 0 && (
            <div style={{ color: '#bfc7d5', opacity: 0.7, textAlign: 'center', marginTop: 60, fontSize: 18 }}>Начните диалог с нейросетью…</div>
          )}
          {chatHistory.map((msg, idx) => (
            <div key={idx} style={{
              margin: '12px 0',
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}>
              <div style={{
                background: msg.role === 'user' ? 'rgba(125,211,252,0.12)' : 'rgba(163,230,53,0.10)',
                color: msg.role === 'user' ? '#7dd3fc' : '#a3e635',
                borderRadius: 10,
                padding: '10px 18px',
                maxWidth: 420,
                fontSize: 16,
                fontWeight: 500,
                boxShadow: '0 1px 4px 0 rgba(31,38,135,0.08)',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
              }}>{msg.text}</div>
            </div>
          ))}
        </div>
        {/* Ввод чата */}
        <div style={{
          display: 'flex',
          borderTop: '1.5px solid #23272a',
          padding: 22,
          background: 'rgba(24,24,27,0.92)',
          width: '100%',
          maxWidth: 700,
          margin: '0 auto',
          boxSizing: 'border-box',
        }}>
          <input
            type="text"
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && chatInput.trim()) handleChatSend(); }}
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
            placeholder={'Введите сообщение...'}
          />
          <button
            onClick={handleChatSend}
            disabled={!chatInput.trim()}
            style={{
              marginLeft: 12,
              background: '#7dd3fc',
              color: '#232526',
              border: 'none',
              borderRadius: 8,
              padding: '8px 22px',
              fontWeight: 700,
              fontSize: 16,
              cursor: chatInput.trim() ? 'pointer' : 'not-allowed',
              boxShadow: '0 1px 4px 0 rgba(125,211,252,0.12)',
              transition: 'background 0.18s, color 0.18s',
            }}
          >Отправить</button>
        </div>
      </div>
    );
  }

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
      {/* Кнопка входа теперь иконка-меню */}
      <div style={{ position: 'absolute', top: 18, left: 32, zIndex: 110 }}>
        <Button
          variant="text"
          aria-label="User menu"
          onClick={handleMenuClick}
          style={{
            minWidth: 0,
            minHeight: 0,
            padding: 0,
            borderRadius: '50%',
            background: 'rgba(36,37,46,0.18)',
            border: '1.5px solid #23272a',
            color: '#7dd3fc',
            boxShadow: '0 1px 4px 0 rgba(31,38,135,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.18s, border 0.18s',
          }}
          onMouseOver={e => (e.currentTarget.style.background = 'rgba(125,211,252,0.10)')}
          onMouseOut={e => (e.currentTarget.style.background = 'rgba(36,37,46,0.18)')}
        >
          <AccountCircleIcon style={{ fontSize: 24, color: '#7dd3fc' }} />
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          PaperProps={{
            style: {
              background: '#232526',
              color: '#e5e5e5',
              minWidth: 160,
              borderRadius: 14,
              boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)',
              fontFamily: 'monospace',
              fontSize: 16,
              padding: '8px 0',
              animation: open ? 'fadeInMenu 0.25s' : undefined,
            },
          }}
        >
          <MenuItem
            onClick={() => { handleMenuClose(); setShowLogin(true); }}
            style={{
              color: '#7dd3fc',
              fontWeight: 700,
              borderRadius: 10,
              margin: '4px 12px',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontSize: 17,
              background: 'rgba(36,37,46,0.12)',
              transition: 'background 0.18s, color 0.18s',
            }}
            onMouseOver={e => (e.currentTarget.style.background = 'rgba(125,211,252,0.10)')}
            onMouseOut={e => (e.currentTarget.style.background = 'rgba(36,37,46,0.12)')}
          >
            <AccountCircleIcon style={{ color: '#7dd3fc', fontSize: 22, marginRight: 2 }} />
            <span style={{ fontWeight: 700, letterSpacing: 0.5 }}>Sign in</span>
          </MenuItem>
        </Menu>
      </div>
      {/* Выбор модели */}
      <div style={{
        position: 'absolute',
        top: 18,
        right: 32,
        zIndex: 100,
        minWidth: 220,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}>
        <ModelDropdown model={model} setModel={setModel} showModelDropdown={showModelDropdown} setShowModelDropdown={setShowModelDropdown} />
        {/* Кнопка чата */}
        <button
          onClick={() => setMode('chat')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(36,37,46,0.18)',
            border: '1.5px solid #23272a',
            borderRadius: '50%',
            width: 38,
            height: 38,
            marginLeft: 6,
            color: '#7dd3fc',
            transition: 'background 0.18s, border 0.18s, color 0.18s',
            boxShadow: '0 1px 4px 0 rgba(31,38,135,0.08)',
            textDecoration: 'none',
            fontSize: 0,
            cursor: 'pointer',
          }}
          title="Чат с нейросетью"
          onMouseOver={e => (e.currentTarget.style.background = 'rgba(125,211,252,0.10)')}
          onMouseOut={e => (e.currentTarget.style.background = 'rgba(36,37,46,0.18)')}
        >
          <ChatBubbleOutlineIcon style={{ fontSize: 22, color: '#7dd3fc' }} />
        </button>
      </div>
      {/* Избранные команды */}
      {favorites.length > 0 && (
        <div style={{
          maxWidth: 900,
          margin: '24px auto 0 auto',
          background: 'rgba(36,37,46,0.22)',
          borderRadius: 10,
          padding: '14px 24px',
          boxShadow: '0 1px 4px 0 rgba(125,211,252,0.08)',
          color: '#facc15',
          fontFamily: 'monospace',
          fontSize: 15,
        }}>
          <div style={{ fontWeight: 700, marginBottom: 8, color: '#facc15', display: 'flex', alignItems: 'center', gap: 8 }}>
            <StarIcon style={{ color: '#facc15', fontSize: 20 }} /> Избранные команды
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {favorites.map((fav, idx) => (
              <div key={idx} style={{ background: 'rgba(250,204,21,0.08)', border: '1px solid #facc15', borderRadius: 7, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#facc15', fontWeight: 600 }}>{fav.response}</span>
                <button onClick={() => handleRunFavorite(fav)} style={{ background: 'none', border: 'none', color: '#a3e635', cursor: 'pointer', fontWeight: 700, fontSize: 15, marginLeft: 6 }}>Запустить</button>
                <button onClick={() => handleToggleFavorite(fav)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 18, marginLeft: 2 }} title="Удалить из избранного"><StarIcon /></button>
              </div>
            ))}
          </div>
        </div>
      )}
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
              <button onClick={() => handleToggleFavorite(item)} style={{ background: 'none', border: 'none', marginLeft: 8, cursor: 'pointer' }} title={isFavorite(item) ? 'Убрать из избранного' : 'В избранное'}>
                {isFavorite(item) ? <StarIcon style={{ color: '#facc15', fontSize: 18 }} /> : <StarBorderIcon style={{ color: '#bfc7d5', fontSize: 18 }} />}
              </button>
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
      {/* Минималистичное отображение текущей директории */}
      <div style={{
        width: 'fit-content',
        minWidth: 120,
        maxWidth: 900,
        margin: '18px auto 0 auto',
        background: 'rgba(36,37,46,0.18)',
        borderRadius: 8,
        padding: '4px 12px 4px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 13,
        color: '#a3e535',
        fontFamily: 'monospace',
        boxShadow: '0 1px 4px 0 rgba(163,230,53,0.06)',
        userSelect: 'text',
        wordBreak: 'break-all',
      }}>
        <FolderOpenIcon style={{ color: '#a3e635', fontSize: 16, marginRight: 2 }} />
        <span style={{ color: '#a3e635', fontWeight: 500, fontSize: 13 }}>{cwd}</span>
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
        {/* Минималистичный переключатель AI/ручной терминал */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginRight: 16,
            cursor: 'pointer',
            userSelect: 'none',
            transition: 'color 0.2s',
            minWidth: 32,
            minHeight: 32,
            justifyContent: 'center',
          }}
          onClick={() => setManualMode(m => !m)}
          title={manualMode ? 'Ручной терминал' : 'AI-ассистент'}
        >
          {manualMode ? (
            <TerminalOutlinedIcon style={{ color: '#7dd3fc', fontSize: 22, transition: 'color 0.2s, transform 0.2s', transform: 'scale(1.08)' }} />
          ) : (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: 'linear-gradient(270deg, #facc15, #7dd3fc, #a3e635, #facc15)',
              backgroundSize: '400% 400%',
              padding: 1.5,
              animation: 'premium-gradient-anim 2.5s linear infinite',
              boxSizing: 'border-box',
              border: '1.5px solid transparent',
            }}>
              <span style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: '#f9fafb',
              }}>
                <WorkspacePremiumIcon style={{ color: '#eab308', fontSize: 15 }} />
              </span>
            </span>
          )}
        </div>
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
          placeholder={loading ? 'Жду ответа...' : manualMode ? 'Ручной терминал...' : 'Введите запрос к AI...'}
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
      {/* Модальное окно входа */}
      <Dialog open={showLogin} onClose={() => setShowLogin(false)} PaperProps={{
        style: {
          background: 'rgba(24,24,27,0.98)',
          borderRadius: 14,
          minWidth: 340,
          boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)',
          border: '1.5px solid rgba(120,120,140,0.18)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          color: '#e5e5e5',
          fontFamily: 'monospace',
        }
      }}>
        <DialogTitle style={{ color: '#7dd3fc', fontWeight: 700, fontSize: 22, textAlign: 'center', letterSpacing: 1 }}>Вход</DialogTitle>
        <DialogContent style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 8 }}>
          <TextField
            autoFocus
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            InputLabelProps={{ style: { color: '#bfc7d5', fontFamily: 'monospace' } }}
            InputProps={{ style: { color: '#e5e5e5', fontFamily: 'monospace', background: 'rgba(36,37,46,0.18)' } }}
          />
          <TextField
            label="Пароль"
            type="password"
            fullWidth
            variant="outlined"
            InputLabelProps={{ style: { color: '#bfc7d5', fontFamily: 'monospace' } }}
            InputProps={{ style: { color: '#e5e5e5', fontFamily: 'monospace', background: 'rgba(36,37,46,0.18)' } }}
          />
        </DialogContent>
        <DialogActions style={{ justifyContent: 'space-between', padding: '18px 24px 18px 24px' }}>
          <Button onClick={() => setShowLogin(false)} style={{ color: '#7dd3fc', fontWeight: 600 }}>Отмена</Button>
          <Button variant="contained" style={{ background: '#7dd3fc', color: '#232526', fontWeight: 700, borderRadius: 8, boxShadow: '0 1px 4px 0 rgba(125,211,252,0.12)' }} onClick={() => setShowLogin(false)}>
            Войти
          </Button>
        </DialogActions>
      </Dialog>
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
        @keyframes premium-gradient-anim {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        @keyframes fadeInMenu {
          from { opacity: 0; transform: translateY(-10px); }
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