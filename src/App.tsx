import { Game } from './components/Game';
import { useGameStore } from './store';
import { useAuthStore } from './store/auth';
import { useMultiplayerStore } from './store/multiplayer';
import { useI18nStore } from './store/i18n';
import { memo, useEffect, useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, Play, User, LogOut, Loader2, LogIn, UserPlus, Ghost, AlertCircle, Users, Copy, ArrowLeft, Coins, Star, Bell, X, RotateCcw, Target } from 'lucide-react';
import { useProfileStore } from './store/profile';
import { supabase } from './lib/supabase';
import { UserProfile } from './components/UserProfile';
import { Shop } from './components/Shop';
import { audio } from './utils/audio';
import { ErrorBoundary } from './components/ErrorBoundary';

const TimerBar = memo(() => {
  const barRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const maxTime = useGameStore(state => state.maxTime);
  const gameState = useGameStore(state => state.gameState);

  useFrame(() => {
    if (gameState !== 'playing' && gameState !== 'elimination') return;
    
    const store = useGameStore.getState();
    const timeLeft = store.timeLeft;
    const progress = Math.max(0, timeLeft / maxTime) * 100;

    if (barRef.current) {
      barRef.current.style.width = `${progress}%`;
      // Update color manually to avoid state transition overhead
      if (timeLeft < 1.5) {
        barRef.current.style.backgroundColor = '#ef4444'; // red-500
      } else if (timeLeft < 3) {
        barRef.current.style.backgroundColor = '#eab308'; // yellow-500
      } else {
        barRef.current.style.backgroundColor = '#22c55e'; // green-500
      }
    }
    
    if (textRef.current) {
      textRef.current.innerText = gameState === 'playing' ? `${timeLeft.toFixed(1)}s` : '0.0s';
    }
  });

  return (
    <div className="w-full max-w-lg mt-4 flex flex-col items-center">
      <div className="w-full h-8 bg-black/40 rounded-full overflow-hidden border-2 border-white/20 shadow-inner relative">
        <div
          ref={barRef}
          className="h-full transition-colors duration-200 shadow-[0_0_15px_rgba(255,255,255,0.5)]"
          style={{ width: '100%', backgroundColor: '#22c55e' }}
        />
        <div 
          ref={textRef}
          className="absolute top-0 left-0 w-full h-full flex items-center justify-center font-mono font-black text-xl text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
        >
          {maxTime.toFixed(1)}s
        </div>
      </div>
    </div>
  );
});

const FloatingBlocks = memo(() => {
  const blocks = Array.from({ length: 20 });
  const colors = ['bg-indigo-500', 'bg-pink-500', 'bg-emerald-500', 'bg-yellow-400', 'bg-red-500', 'bg-cyan-500'];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {blocks.map((_, i) => {
        const size = Math.random() * 80 + 30;
        const color = colors[Math.floor(Math.random() * colors.length)];
        return (
          <motion.div
            key={i}
            className={`absolute rounded-2xl ${color} border-[6px] border-black/20 shadow-[6px_8px_0_rgba(0,0,0,0.2)] opacity-80`}
            style={{ width: size, height: size }}
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 150,
              rotate: Math.random() * 360
            }}
            animate={{
              y: -150,
              rotate: Math.random() * 720
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5
            }}
          />
        );
      })}
    </div>
  );
});

export default function App() {
  const { user, isLoading, initializeAuth, signOut } = useAuthStore();

  const targetColor = useGameStore(state => state.targetColor);
  const roundsSurvived = useGameStore(state => state.roundsSurvived);
  // REMOVED timeLeft and maxTime from here to prevent re-renders every frame
  const gameState = useGameStore(state => state.gameState);
  const setUsername = useGameStore(state => state.setUsername);
  const aliveBots = useGameStore(state => state.aliveBots);
  const isPaused = useGameStore(state => state.isPaused);
  const togglePause = useGameStore(state => state.togglePause);
  const [showProfile, setShowProfile] = useState(false);
  const [showShop, setShowShop] = useState(false);

  // Economy & Notifications State (Must be called before ANY early return!)
  const sessionCoins = useGameStore(state => state.sessionCoins);
  const profile = useProfileStore(state => state.profile);
  const notifications = useProfileStore(state => state.notifications);

  const [inputName, setInputName] = useState(username);

  // Multiplayer State
  const { lobbyId, isHost, players, isLoading: mpLoading, error: mpError, createLobby, joinLobby, leaveLobby } = useMultiplayerStore();
  const [joinCode, setJoinCode] = useState('');
  const [showJoinInput, setShowJoinInput] = useState(false);

  // I18N
  const { t, language, setLanguage } = useI18nStore();

  // Auth Form State
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Economy & Notifications State
  // (Moved to top)

  // Responsive Scaling Logic per Desktop Grandi (2K, 4K)
  const getUiScale = () => {
    if (typeof window === 'undefined') return 1;
    if (window.innerWidth > 1400 || window.innerHeight > 850) {
      const scaleW = (window.innerWidth * 0.95) / 1400;
      const scaleH = (window.innerHeight * 0.90) / 850;
      return Math.max(1, Math.min(scaleW, scaleH));
    }
    return 1;
  };

  const [uiScale, setUiScale] = useState(getUiScale());

  useEffect(() => {
    const handleResize = () => setUiScale(getUiScale());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (user && user.email) {
      import('./store/profile').then(m => {
        // slight delay to let the profile load from supabase after auth resolves
        setTimeout(() => {
          const profile = m.useProfileStore.getState().profile;
          if (profile?.username) {
            setInputName(profile.username);
          } else {
            setInputName(user.email!.split('@')[0] || t('player'));
          }
        }, 500);
      });
    }
  }, [user]);

  useEffect(() => {
    if (gameState === 'victory') {
      // Massive confetti burst on win
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const interval: any = setInterval(function () {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } }));
      }, 250);

      return () => clearInterval(interval);
    } else if (roundsSurvived > 0) {
      // Small confetti burst on surviving a round
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#FF3333', '#3333FF', '#33FF33', '#FFFF33', '#9933FF', '#FF9933']
      });
    }
  }, [roundsSurvived, gameState]);

  const handleStartGameWithUser = () => {
    // Local Game Start
    const finalName = inputName.trim() || (user ? (user.email?.split('@')[0] || t('player')) : t('guest'));
    setUsername(finalName);
    startGame();
  };

  const handleCreateMultiplayer = () => {
    const finalName = inputName.trim() || (user ? (user.email?.split('@')[0] || t('player')) : t('guest'));
    setUsername(finalName);
    createLobby(finalName, user?.id);
  };

  const handleJoinMultiplayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim() || joinCode.length !== 5) return;

    const finalName = inputName.trim() || (user ? (user.email?.split('@')[0] || t('player')) : t('guest'));
    setUsername(finalName);
    joinLobby(joinCode.trim(), finalName, user?.id);
  };

  useEffect(() => {
    if (mpError) {
      alert(`Errore Lobby: ${mpError}`);
    }
  }, [mpError]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      if (isLoginMode) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setAuthError(err.message || 'Errore di autenticazione');
    } finally {
      setAuthLoading(false);
    }
  };

  // ESC Key listener for Pause Menu
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (gameState === 'playing' || gameState === 'waiting' || gameState === 'elimination')) {
        togglePause();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [gameState, togglePause]);

  return (
    <div className="w-full h-screen relative overflow-hidden bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600">
      {isLoading && (
        <div className="absolute inset-0 bg-sky-200 flex items-center justify-center z-[99999]">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        </div>
      )}

      <ErrorBoundary name="Game Canvas">
        <Game />
      </ErrorBoundary>
      {gameState === 'menu' && <FloatingBlocks />}
      {user && <UserProfile user={user} />}
      {user && <Shop isOpen={showShop} onClose={() => setShowShop(false)} />}

      {/* UI Overlay */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col justify-between p-6 z-40">

        {/* Top Bar */}
        <AnimatePresence>
          {gameState !== 'menu' && (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex justify-between items-start"
            >
              <div className="flex flex-col gap-2">
                <div className="bg-slate-900/80 backdrop-blur-md text-white px-3 md:px-5 py-2 md:py-3 rounded-2xl font-black text-sm md:text-xl shadow-lg border-b-4 border-slate-700 flex items-center gap-2 md:gap-3 uppercase tracking-wider">
                  <Trophy size={24} className="text-yellow-400 drop-shadow-sm w-5 h-5 md:w-6 md:h-6" />
                  {t('round')}: {roundsSurvived}
                </div>
                <div className="bg-slate-900/80 backdrop-blur-md text-white px-3 md:px-5 py-2 md:py-3 rounded-2xl font-black text-sm md:text-xl shadow-lg border-b-4 border-slate-700 flex items-center gap-2 md:gap-3 uppercase tracking-wider">
                  <User size={22} className="text-blue-400 drop-shadow-sm w-5 h-5 md:w-6 md:h-6" />
                  {t('alive')}: {aliveBots.length + (gameState === 'gameover' ? 0 : 1)}/12
                </div>
              </div>

              {(gameState === 'playing' || gameState === 'elimination') && targetColor && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, y: -20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  key={roundsSurvived} // Re-animate on new round
                  className="flex-1 flex flex-col items-center justify-start pt-2 pointer-events-none"
                >
                  <div className="bg-slate-900/40 backdrop-blur-sm p-4 rounded-[2.5rem] border-2 border-white/20 shadow-xl flex flex-col items-center gap-2">
                    {/* Compact Color Indicator Rectangle */}
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-24 h-12 md:w-32 md:h-16 rounded-2xl shadow-inner border-4 border-white/30"
                      style={{ backgroundColor: targetColor.hex }}
                    />
                    {/* Color Name below */}
                    <div
                      className="text-xl md:text-3xl font-black uppercase tracking-[0.2em] drop-shadow-sm"
                      style={{ color: targetColor.hex }}
                    >
                      {t(targetColor.name.toLowerCase())}
                    </div>
                  </div>
                  <TimerBar />
                </motion.div>
              )}

              <div className="flex items-center gap-2">
                {/* Live Coin HUD moved to Top Right */}
                {(gameState === 'playing' || gameState === 'elimination') && (
                  <div className="bg-amber-400 text-slate-900 px-3 sm:px-4 py-2 sm:py-3 rounded-2xl font-black text-sm sm:text-lg shadow-lg border-b-4 border-amber-600 flex items-center gap-2">
                    <Coins size={20} className="text-white drop-shadow-sm" />
                    <span className="tabular-nums">{sessionCoins} PB</span>
                  </div>
                )}
                <div className="bg-slate-900/80 backdrop-blur-md text-white px-3 sm:px-5 py-2 sm:py-3 rounded-2xl font-black text-sm sm:text-lg shadow-lg border-b-4 border-slate-700 flex items-center gap-2 sm:gap-3 max-w-[120px] sm:max-w-[200px]">
                  <User size={20} className="text-indigo-400 shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="truncate">{username || (user?.email?.split('@')[0] || t('player'))}</span>
                </div>
                {user && (
                  <button
                    onClick={async () => {
                      await signOut();
                    }}
                    className="bg-red-500 hover:bg-red-400 text-white p-3.5 rounded-2xl shadow-lg border-b-4 border-red-700 active:border-b-0 active:translate-y-1 transition-all"
                    title={t('sign_out')}
                  >
                    <LogOut size={20} className="stroke-[3px]" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center Messages */}
        <div className="flex-1 flex items-center justify-center relative">

          {/* Language Selector */}
          {gameState === 'menu' && !lobbyId && (
            <div className="absolute top-0 right-4 md:right-8 bg-white/80 backdrop-blur-md rounded-2xl flex p-1.5 gap-1.5 shadow-lg border-2 border-indigo-100 pointer-events-auto z-50">
              {(['en', 'it', 'ru'] as const).map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`w-10 h-10 rounded-xl font-black text-sm uppercase transition-all flex items-center justify-center ${language === lang
                      ? 'bg-indigo-500 text-white shadow-md scale-105'
                      : 'bg-transparent text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                    }`}
                >
                  {lang === 'en' ? '🇬🇧' : lang === 'it' ? '🇮🇹' : '🇷🇺'}
                </button>
              ))}
            </div>
          )}

          {/* Dedicated Shop Button (PB) - Menu Only */}
          <AnimatePresence>
            {gameState === 'menu' && !lobbyId && user && (
              <motion.div
                initial={{ scale: 0, opacity: 0, x: 20 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                exit={{ scale: 0, opacity: 0, x: 20 }}
                className="absolute top-36 right-2 md:top-48 md:right0 z-[100] pointer-events-auto"
              >
                <div className="flex flex-col items-center gap-2">
                  <motion.button
                    animate={{
                      scale: [1, 1.15, 1],
                      rotate: [0, -2, 2, 0],
                      boxShadow: [
                        "0 0 10px rgba(251,191,36,0.3)",
                        "0 0 30px rgba(251,191,36,0.8)",
                        "0 0 10px rgba(251,191,36,0.3)"
                      ]
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowShop(true)}
                    className="relative w-16 h-16 md:w-20 md:h-20 bg-amber-400 rounded-full border-[6px] border-slate-900 shadow-[2px_6px_0_#b45309] flex items-center justify-center group overflow-hidden"
                  >
                    {/* Interior Shine Animation */}
                    <motion.div
                      animate={{ left: ['-100%', '200%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', repeatDelay: 0.5 }}
                      className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 z-0"
                    />

                    <Coins size={36} className="text-white drop-shadow-[0_2px_0_#d97706] relative z-10 filter" strokeWidth={2.5} />

                    {/* "SHOP" pulse tag */}
                    <div className="absolute -bottom-1 bg-rose-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full border-2 border-slate-900 z-20 shadow-md">
                      SHOP
                    </div>
                  </motion.button>

                  {/* PB Amount Bubble under button */}
                  <motion.div
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border-2 border-slate-900 shadow-sm flex items-center gap-1.5"
                  >
                    <Coins size={12} className="text-amber-500" />
                    <span className="font-black text-[10px] text-slate-800 tabular-nums">
                      {profile?.coins.toLocaleString() || 0}
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {gameState === 'menu' && !lobbyId && (
              <motion.div
                key="menu"
                initial={{ scale: 0.5 * uiScale, opacity: 0, y: 50 }}
                animate={{ scale: 1 * uiScale, opacity: 1, y: 0 }}
                exit={{ scale: 0.8 * uiScale, opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className={`bg-white border-[8px] border-slate-900 p-6 sm:p-10 md:p-12 rounded-[3.5rem] shadow-[12px_16px_0_#1e1b4b] text-center pointer-events-auto w-[95vw] md:w-full flex flex-col ${!user ? 'md:flex-row gap-6 md:gap-12 md:max-w-5xl' : 'gap-8 md:max-w-xl'} max-h-[95vh] overflow-y-auto overflow-x-hidden relative z-10 mx-auto`}
                style={{ scrollbarWidth: 'none', willChange: 'transform, opacity' }}
              >
                {/* Left Side: Title & Guest Play */}
                <div className={`flex-1 flex flex-col justify-center items-center text-center shrink-0 min-w-0 w-full ${!user ? 'md:items-start md:text-left md:w-1/2' : 'max-w-full mx-auto'}`}>
                  <motion.div
                    animate={{ y: [-5, 5, -5], rotate: [-2, 2, -2] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="shrink-0 mb-8"
                    style={{ willChange: 'transform' }}
                  >
                    <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-yellow-300 uppercase tracking-widest leading-[1.1] drop-shadow-[0_6px_0_#b45309] break-words text-balance w-full" style={{ WebkitTextStroke: '3px #78350f' }}>
                      {t('app_title')}
                    </h1>
                    <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-pink-500 uppercase tracking-widest leading-[1.1] drop-shadow-[0_8px_0_#be185d] break-words text-balance w-full" style={{ WebkitTextStroke: '4px #831843' }}>
                      {t('app_subtitle')}
                    </h1>
                  </motion.div>

                  {!user && (
                    <p className="font-black text-slate-700 mb-8 text-base sm:text-xl md:text-2xl max-w-[280px] sm:max-w-md uppercase bg-yellow-100 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl border-4 border-yellow-400 transform -rotate-3 shadow-[4px_4px_0_#ca8a04] break-words text-center md:text-left leading-tight mt-[-1rem]">
                      {t('tagline')}
                    </p>
                  )}

                  {/* Auth and Guest Options */}
                  {user ? (
                    <div className="w-full space-y-5 shrink-0 mt-auto max-w-sm mx-auto">
                      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-800 p-4 rounded-3xl border-2 border-indigo-200 flex items-center justify-between gap-4 shadow-sm w-full">
                        <div className="flex items-center gap-4 text-left overflow-hidden">
                          <div className="shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-black text-xl shadow-md border-2 border-indigo-300">
                            {(user.email?.[0] || 'P').toUpperCase()}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">{t('account_connected')}</span>
                            <span className="font-black text-lg text-indigo-900 leading-none truncate">{user.email?.split('@')[0]}</span>
                          </div>
                        </div>
                        <button
                          onClick={async () => {
                            await signOut();
                          }}
                          className="shrink-0 bg-red-100 hover:bg-red-200 text-red-600 p-3 rounded-2xl transition-colors border-2 border-red-200 hover:border-red-300 active:scale-95"
                          title={t('sign_out')}
                        >
                          <LogOut size={20} strokeWidth={2.5} />
                        </button>
                      </div>

                      <div className="relative group mt-2">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-2xl blur opacity-0 group-focus-within:opacity-30 transition duration-500" style={{ willChange: 'opacity' }}></div>
                        <User className="absolute left-5 top-1/2 transform -translate-y-1/2 text-indigo-400 group-focus-within:text-indigo-600 transition-colors z-10" size={20} />
                        <input
                          type="text"
                          placeholder={t('choose_nickname')}
                          value={inputName}
                          onChange={(e) => setInputName(e.target.value)}
                          className="w-full relative pl-14 pr-4 py-4 rounded-3xl border-4 border-slate-900 focus:border-indigo-500 outline-none transition-all text-xl font-black bg-white text-slate-900 placeholder:text-slate-400 shadow-[4px_4px_0_#1e293b] focus:translate-y-1 focus:shadow-[0px_0px_0_#1e293b]"
                          onKeyDown={(e) => e.key === 'Enter' && handleStartGameWithUser()}
                        />
                      </div>

                      <div className="flex flex-col gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleStartGameWithUser}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-black py-4 px-4 sm:px-6 rounded-3xl text-sm sm:text-lg transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] flex items-center justify-center gap-2 sm:gap-3 relative overflow-hidden border-4 border-slate-900 border-b-[8px] active:border-b-4 active:translate-y-1 whitespace-nowrap text-ellipsis text-center"
                        >
                          <Play fill="currentColor" size={24} /> <span className="tracking-wide">{t('singleplayer_bots') || 'SINGLEPLAYER (VS BOTS)'}</span>
                        </motion.button>

                        <div className="flex flex-col sm:flex-row w-full gap-3">
                          <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleCreateMultiplayer}
                            disabled={mpLoading}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white font-black py-3 sm:py-4 px-2 rounded-3xl text-xs sm:text-sm lg:text-base transition-all flex items-center justify-center gap-1 sm:gap-2 border-4 border-slate-900 border-b-[8px] active:border-b-4 active:translate-y-1 whitespace-nowrap overflow-hidden text-ellipsis text-center"
                          >
                            {mpLoading ? <Loader2 className="animate-spin" /> : <><Users size={20} className="shrink-0" /> {t('create_room')}</>}
                          </motion.button>

                          {showJoinInput ? (
                            <form onSubmit={handleJoinMultiplayer} className="flex-1 relative flex">
                              <input
                                autoFocus
                                type="text"
                                maxLength={5}
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                placeholder={t('room_code_placeholder')}
                                className="w-full text-center font-black tracking-widest bg-white text-slate-900 border-4 border-slate-900 shadow-[4px_4px_0_#1e293b] rounded-3xl focus:outline-none uppercase text-lg sm:text-xl placeholder:text-slate-400 min-w-0"
                              />
                            </form>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.02, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setShowJoinInput(true)}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                              className="flex-1 bg-teal-500 hover:bg-teal-400 text-white font-black py-3 sm:py-4 px-2 rounded-3xl text-xs sm:text-sm lg:text-base transition-all flex items-center justify-center gap-1 sm:gap-2 border-4 border-slate-900 border-b-[8px] active:border-b-4 active:translate-y-1 whitespace-nowrap overflow-hidden text-ellipsis text-center"
                            >
                              {t('join_with_code')}
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full space-y-4 shrink-0 mt-auto">
                      {/* Priority Guest Options on Left */}
                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-400 to-fuchsia-500 rounded-2xl blur opacity-0 group-focus-within:opacity-30 transition duration-500" style={{ willChange: 'opacity' }}></div>
                        <User className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors z-10" size={20} />
                        <input
                          type="text"
                          placeholder={t('choose_nickname')}
                          value={inputName}
                          onChange={(e) => setInputName(e.target.value)}
                          className="w-full relative pl-14 pr-4 py-5 rounded-3xl border-4 border-slate-900 focus:border-violet-500 outline-none transition-all text-xl font-black bg-white text-slate-900 placeholder:text-slate-400 shadow-[4px_4px_0_#1e293b] focus:translate-y-1 focus:shadow-[0px_0px_0_#1e293b]"
                          onKeyDown={(e) => e.key === 'Enter' && handleStartGameWithUser()}
                        />
                      </div>

                      <div className="flex flex-col gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleStartGameWithUser}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          className="w-full bg-violet-600 hover:bg-violet-500 text-white font-black py-4 px-4 sm:px-6 rounded-3xl text-sm sm:text-lg transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] flex items-center justify-center gap-2 sm:gap-3 border-4 border-slate-900 border-b-[8px] active:border-b-4 active:translate-y-1 whitespace-nowrap overflow-hidden text-ellipsis text-center"
                        >
                          <Play fill="currentColor" className="shrink-0 w-6 h-6" />
                          <span className="tracking-wide truncate">{t('play_as_guest')}</span>
                        </motion.button>

                        <div className="flex flex-col sm:flex-row w-full gap-3">
                          <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleCreateMultiplayer}
                            disabled={mpLoading}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white font-black py-3 sm:py-4 px-2 rounded-3xl text-xs sm:text-sm lg:text-base transition-all flex items-center justify-center gap-1 sm:gap-2 border-4 border-slate-900 border-b-[8px] active:border-b-4 active:translate-y-1 whitespace-nowrap overflow-hidden text-ellipsis text-center"
                          >
                            {mpLoading ? <Loader2 className="animate-spin" /> : <><Users size={20} className="shrink-0" /> {t('create_room')}</>}
                          </motion.button>

                          {showJoinInput ? (
                            <form onSubmit={handleJoinMultiplayer} className="flex-1 relative flex">
                              <input
                                autoFocus
                                type="text"
                                maxLength={5}
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                placeholder={t('room_code_placeholder')}
                                className="w-full text-center font-black tracking-widest bg-white text-slate-900 border-4 border-slate-900 shadow-[4px_4px_0_#1e293b] rounded-3xl focus:outline-none uppercase text-lg sm:text-xl placeholder:text-slate-400 min-w-0"
                              />
                            </form>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.02, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setShowJoinInput(true)}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                              className="flex-1 bg-teal-500 hover:bg-teal-400 text-white font-black py-3 sm:py-4 px-2 rounded-3xl text-xs sm:text-sm lg:text-base transition-all flex items-center justify-center gap-1 sm:gap-2 border-4 border-slate-900 border-b-[8px] active:border-b-4 active:translate-y-1 whitespace-nowrap overflow-hidden text-ellipsis text-center"
                            >
                              {t('join_with_code')}
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Side: Divider & Auth Form (Only show if not logged in) */}
                {!user && (
                  <>
                    {/* Vertical Divider for Desktop, Horizontal for Mobile */}
                    <div className="md:w-px md:h-auto h-px w-full bg-gradient-to-b md:bg-gradient-to-b bg-gradient-to-r from-transparent via-slate-200 to-transparent shrink-0 my-4 md:my-0 relative flex items-center justify-center">
                      <div className="absolute bg-white px-3 py-1 text-[10px] font-black tracking-widest text-slate-300 uppercase rounded-full border border-slate-100">
                        {t('or_save_data')}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center shrink-0 w-full md:max-w-sm min-w-0">
                      <form onSubmit={handleAuthSubmit} className="bg-white p-6 sm:p-8 rounded-[3rem] border-[6px] border-slate-900 shadow-[8px_12px_0_#1e1b4b] relative overflow-hidden group w-full">


                        {authLoading && (
                          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex items-center justify-center rounded-[2rem]">
                            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                          </div>
                        )}

                        <div className="relative z-10">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <h3 className="font-black text-slate-800 text-lg sm:text-xl tracking-tight flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
                              {isLoginMode ? t('welcome_back') : t('create_account')}
                            </h3>
                            <button
                              type="button"
                              onClick={() => {
                                setIsLoginMode(!isLoginMode);
                                setAuthError(null);
                              }}
                              className="text-xs font-black text-indigo-600 hover:text-white hover:bg-indigo-500 bg-indigo-50 px-4 py-2 rounded-full transition-all tracking-wider shadow-sm shrink-0 whitespace-normal break-words text-center leading-tight max-w-[150px]"
                            >
                              {isLoginMode ? t('register_btn_switch') : t('login_btn_switch')}
                            </button>
                          </div>

                          <AnimatePresence>
                            {authError && (
                              <motion.div
                                initial={{ opacity: 0, height: 0, y: -10 }}
                                animate={{ opacity: 1, height: 'auto', y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -10 }}
                                className="bg-red-50 border-2 border-red-100 text-red-600 p-3 rounded-xl mb-5 flex items-start gap-2 text-sm font-bold shadow-sm"
                              >
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
                                <p className="text-left leading-tight mt-0.5">{authError}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          <div className="space-y-4">
                            <div>
                              <p className="text-left text-xs font-bold text-slate-400 uppercase tracking-widest pl-2 mb-1.5">{t('email_address')}</p>
                              <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-4 rounded-2xl border-4 border-slate-900 focus:border-indigo-500 outline-none transition-all text-lg font-black bg-white text-slate-900 placeholder:text-slate-400 shadow-[4px_4px_0_#1e293b] focus:translate-y-1 focus:shadow-none"
                                placeholder="player@email.com"
                              />
                            </div>
                            <div>
                              <p className="text-left text-xs font-bold text-slate-400 uppercase tracking-widest pl-2 mb-1.5">{t('password')}</p>
                              <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-4 rounded-2xl border-4 border-slate-900 focus:border-indigo-500 outline-none transition-all text-lg font-black bg-white text-slate-900 placeholder:text-slate-400 shadow-[4px_4px_0_#1e293b] focus:translate-y-1 focus:shadow-none"
                                placeholder={t('password_placeholder')}
                                minLength={6}
                              />
                            </div>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={authLoading}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            className="w-full mt-6 bg-indigo-500 hover:bg-indigo-400 text-white font-black py-4 px-4 sm:px-6 rounded-3xl text-sm sm:text-base transition-all flex items-center justify-center gap-2 sm:gap-3 border-4 border-slate-900 border-b-[8px] active:border-b-4 active:translate-y-1 whitespace-nowrap overflow-hidden text-ellipsis"
                          >
                            {isLoginMode ? (
                              <><LogIn className="w-5 h-5 shrink-0 group-hover:-translate-x-1 transition-transform" /> <span className="truncate">{t('enter_server')}</span></>
                            ) : (
                              <><UserPlus className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" /> <span className="truncate">{t('register_now')}</span></>
                            )}
                          </motion.button>
                        </div>
                      </form>
                    </div>
                  </>
                )}


              </motion.div>
            )}

            {gameState === 'menu' && lobbyId && (
              <motion.div
                key="lobby"
                initial={{ scale: 0.8 * uiScale, opacity: 0, boxShadow: "0px 0px 0px rgba(0,0,0,0)" }}
                animate={{ scale: 1 * uiScale, opacity: 1, boxShadow: "0px 25px 50px -12px rgba(0,0,0,0.25)" }}
                exit={{ scale: 0.8 * uiScale, opacity: 0 }}
                className="bg-white p-8 sm:p-10 rounded-[3rem] w-full max-w-2xl border-[8px] border-slate-900 shadow-[12px_16px_0_#1e1b4b] flex flex-col items-center pointer-events-auto relative z-10"
              >
                <div className="flex justify-between w-full items-center mb-6 border-b-4 border-slate-200 pb-4">
                  <button
                    onClick={leaveLobby}
                    className="flex items-center gap-1 sm:gap-2 text-slate-500 hover:text-red-500 font-black transition-all border-b-4 border-transparent hover:border-red-200 active:border-b-0 active:translate-y-1 px-2 sm:px-3 py-2 rounded-xl text-sm sm:text-base break-words leading-tight shrink-0"
                  >
                    <ArrowLeft className="stroke-[3px] w-4 h-4 sm:w-5 sm:h-5" /> <span className="hidden sm:inline">{t('leave_room')}</span>
                  </button>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 font-bold uppercase tracking-widest text-sm">{t('room_code')}</span>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95, y: 0 }}
                      className="bg-emerald-100 text-emerald-800 font-black text-2xl tracking-[0.2em] px-5 py-3 rounded-2xl flex items-center gap-3 cursor-pointer transition-colors border-4 border-slate-900 border-b-[8px] active:border-b-4 shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                      onClick={() => navigator.clipboard.writeText(lobbyId)}
                      title="Copy to clipboard"
                    >
                      {lobbyId}
                      <Copy size={22} className="text-emerald-500 stroke-[4px]" />
                    </motion.div>
                  </div>
                </div>

                <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-emerald-400 uppercase tracking-widest drop-shadow-[0_4px_0_#064e3b] mb-4 sm:mb-8 text-center break-words text-balance leading-tight w-full" style={{ WebkitTextStroke: '2px #022c22' }}>{t('waiting_room')}</h2>

                <div className="w-full bg-slate-50 rounded-2xl p-4 border-2 border-slate-100 mb-8 min-h-[200px]">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {players.map(p => (
                      <div key={p.id} className="bg-white border-2 border-emerald-100 p-3 rounded-xl flex items-center justify-between shadow-sm">
                        <span className="font-bold text-slate-700 truncate">{p.name}</span>
                        {p.isHost && <Trophy size={16} className="text-yellow-500" />}
                      </div>
                    ))}
                    {/* Empty Slots */}
                    {Array.from({ length: Math.max(0, 12 - players.length) }).map((_, i) => (
                      <div key={`empty-${i}`} className="border-4 border-dashed border-slate-200 bg-slate-50 p-2 sm:p-3 rounded-2xl flex items-center justify-center">
                        <span className="font-black text-slate-300 uppercase tracking-wider text-xs sm:text-sm text-center break-words leading-tight">{t('waiting_players')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {isHost ? (
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      useGameStore.getState().startGame();
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3 sm:py-5 px-4 rounded-2xl text-sm sm:text-lg transition-colors shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 sm:gap-3 border-b-6 border-emerald-700 active:border-b-0 active:translate-y-1 text-center whitespace-nowrap overflow-hidden text-ellipsis"
                  >
                    <Play fill="currentColor" className="shrink-0 w-6 h-6 sm:w-7 sm:h-7" /> <span className="truncate">{t('start_game')} ({players.length}/12)</span>
                  </motion.button>
                ) : (
                  <div className="w-full bg-amber-50 border-4 border-amber-200 text-amber-700 font-black py-4 sm:py-5 px-4 rounded-2xl text-sm sm:text-xl flex items-center justify-center gap-2 sm:gap-3 shadow-inner text-center break-words leading-tight">
                    <Loader2 className="animate-spin shrink-0 w-6 h-6 sm:w-7 sm:h-7" /> <span className="truncate">{t('waiting_for_host')}</span>
                  </div>
                )}
              </motion.div>
            )}

            {gameState === 'gameover' && (
              <motion.div
                key="gameover"
                initial={{ scale: 0.5 * uiScale, opacity: 0, rotate: -10 }}
                animate={{ scale: 1 * uiScale, opacity: 1, rotate: 0 }}
                className="bg-white p-8 sm:p-10 rounded-[3rem] text-center pointer-events-auto max-w-xl w-[95%] border-[8px] border-slate-900 shadow-[12px_16px_0_#1e1b4b] relative z-10 mx-auto"
              >
                <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-red-500 uppercase tracking-widest drop-shadow-[0_6px_0_#7f1d1d] mb-4 break-words text-balance leading-[1.1] w-full" style={{ WebkitTextStroke: '2px #450a0a' }}>
                  {t('eliminated')}
                </h1>
                <div className="my-8">
                  <p className="text-gray-500 text-lg font-medium uppercase tracking-widest mb-1">{t('final_score')}</p>
                  <p className="text-6xl font-black text-indigo-600 drop-shadow-sm">
                    {roundsSurvived}
                  </p>
                  <p className="text-gray-500 text-md font-medium mt-1">{t('rounds_survived')}</p>
                </div>
                <div className="text-center mt-3 bg-amber-100 border border-amber-300 rounded-xl p-2 max-w-xs mx-auto">
                  <p className="text-amber-800 font-bold text-sm flex items-center justify-center gap-1">
                    <Coins size={14} className="text-amber-500" />
                    {t('earned')} <span className="font-black">{(roundsSurvived * 10) + 5 + sessionCoins} PB</span>
                  </p>
                </div>

                <div className="flex flex-col gap-3 max-w-sm mx-auto w-full mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      scale: [1, 1.03, 1],
                      boxShadow: [
                        "0px 0px 0px 0px rgba(99,102,241,0.4)",
                        "0px 0px 30px 10px rgba(129,140,248,0.8)",
                        "0px 0px 0px 0px rgba(99,102,241,0.4)"
                      ]
                    }}
                    transition={{
                      scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
                      boxShadow: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                    }}
                    onClick={() => {
                      audio.playCoinSound();
                      useProfileStore.getState().addReward(roundsSurvived, true, sessionCoins);
                      // Visual feedback
                      confetti({
                        particleCount: 150,
                        spread: 100,
                        origin: { y: 0.6 }
                      });
                    }}
                    className="relative w-full overflow-hidden text-white font-black py-4 sm:py-5 px-6 rounded-3xl text-lg sm:text-xl transition-all shadow-lg flex items-center justify-center gap-2 border-4 border-slate-900 border-b-[8px] active:border-b-4 active:translate-y-1 group"
                  >
                    {/* Animated colorful gradient background */}
                    <motion.div
                      animate={{
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 z-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-[length:200%_200%]"
                    />

                    {/* Hero Shine / Shimmer effect */}
                    <motion.div
                      animate={{ left: ['-100%', '200%'] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
                      className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 z-0"
                    />

                    <div className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] w-full">
                      <Play fill="currentColor" size={24} className="text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]" />
                      <span className="tracking-wide uppercase text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] whitespace-nowrap overflow-hidden text-ellipsis w-full max-w-[90%]">
                        {t('double_pb')}
                      </span>
                    </div>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={startGame}
                    className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-black py-4 sm:py-5 px-6 rounded-3xl text-lg sm:text-xl transition-all shadow-[0_4px_14px_rgba(250,204,21,0.4)] flex items-center justify-center gap-2 border-4 border-slate-900 border-b-[8px] active:border-b-4 active:translate-y-1"
                  >
                    <RotateCcw strokeWidth={3} /> {t('try_again')}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* PAUSE MENU OVERLAY */}
            {isPaused && (gameState === 'playing' || gameState === 'waiting' || gameState === 'elimination') && (
              <motion.div
                key="pause"
                initial={{ opacity: 0, scale: 0.9 * uiScale, y: 10 }}
                animate={{ opacity: 1, scale: 1 * uiScale, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 * uiScale, y: 10 }}
                transition={{ type: "spring", bounce: 0.4 }}
                className="bg-indigo-900 p-10 rounded-[3rem] text-center pointer-events-auto max-w-sm w-full border-[8px] border-slate-900 shadow-[12px_16px_0_#1e1b4b] flex flex-col items-center z-50 absolute"
              >
                <h2 className="font-display text-4xl sm:text-5xl text-yellow-300 uppercase tracking-widest drop-shadow-[0_6px_0_#b45309] mb-8 break-words text-balance leading-tight w-full" style={{ WebkitTextStroke: '2px #78350f' }}>
                  {t('pause_title')}
                </h2>

                <div className="w-full space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={togglePause}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black py-4 rounded-2xl text-sm sm:text-base md:text-lg transition-colors shadow-lg shadow-emerald-500/20 border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 whitespace-nowrap overflow-hidden text-ellipsis px-4"
                  >
                    {t('resume')}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      togglePause(); // Unpause
                      leaveLobby(); // Disconnect multiplayer
                      // Soft reload to menu
                      window.location.reload();
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="w-full bg-slate-800 hover:bg-red-500 hover:text-white text-slate-300 font-bold py-4 rounded-2xl text-sm sm:text-base transition-colors border-2 border-slate-700 border-b-4 border-b-slate-900 hover:border-red-600 hover:border-b-red-800 active:border-b-2 active:translate-y-0.5 group flex items-center justify-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis px-4"
                  >
                    <LogOut className="group-hover:-translate-x-1 transition-transform shrink-0 w-5 h-5" />
                    <span className="truncate">{t('abandon')}</span>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {gameState === 'victory' && (
              <motion.div
                key="victory"
                initial={{ scale: 0.5 * uiScale, opacity: 0, y: -50 }}
                animate={{ scale: 1 * uiScale, opacity: 1, y: 0 }}
                className="bg-white p-10 rounded-[3rem] text-center pointer-events-auto max-w-md w-full border-[8px] border-slate-900 shadow-[12px_16px_0_#1e1b4b] relative overflow-hidden z-10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/50 to-orange-200/50 pointer-events-none" />
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2 uppercase tracking-tight drop-shadow-md relative z-10 whitespace-nowrap leading-[1.1] w-full px-2" style={{ WebkitTextStroke: '2px white' }}>
                  {t('victory')}
                </h1>
                <p className="text-sm sm:text-xl text-yellow-800 font-bold mb-6 relative z-10 bg-yellow-100 py-2 px-4 rounded-xl border-2 border-yellow-200 inline-block text-balance break-words leading-tight max-w-[90%] mx-auto">
                  {t('winner_subtitle')}
                </p>
                <div className="my-8 relative z-10">
                  <Trophy size={80} className="mx-auto text-yellow-500 drop-shadow-[0_10px_10px_rgba(0,0,0,0.2)] mb-4" />
                  <p className="text-gray-500 text-lg font-bold uppercase tracking-widest mb-1">{t('rounds_survived')}</p>
                  <p className="text-7xl font-black text-indigo-600 drop-shadow-sm">
                    {roundsSurvived}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startGame}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-black py-4 px-4 sm:px-8 rounded-2xl text-sm sm:text-lg transition-colors shadow-xl flex items-center justify-center gap-2 relative z-10 border-b-6 border-orange-600 active:border-b-0 active:translate-y-1 whitespace-nowrap overflow-hidden text-ellipsis text-center"
                >
                  <Play fill="currentColor" className="shrink-0" /> <span className="truncate">{t('try_again')}</span>
                </motion.button>
              </motion.div>
            )}

            {gameState === 'elimination' && (
              <motion.div
                key="cleared"
                initial={{ scale: 0.5 * uiScale, opacity: 0, y: 50 }}
                animate={{ scale: 1 * uiScale, opacity: 1, y: 0 }}
                exit={{ scale: 1.5 * uiScale, opacity: 0 }}
                className="text-6xl font-black text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] uppercase tracking-widest"
                style={{ WebkitTextStroke: '2px black' }}
              >
                {t('safe')}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mission Notifications */}
        <div className="fixed bottom-8 left-8 z-[200] flex flex-col gap-3 pointer-events-none max-w-xs w-full">
          <AnimatePresence>
            {notifications.map((notif) => (
              <motion.div
                key={notif.id}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                className="bg-indigo-600 text-white p-4 rounded-2xl border-4 border-slate-900 shadow-[6px_6px_0_#1e1b4b] flex items-center gap-3 pointer-events-auto"
              >
                <div className="bg-yellow-400 p-2 rounded-xl shadow-inner border border-yellow-300">
                  <Star size={20} className="fill-white text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-black text-sm leading-tight uppercase">{notif.message}</p>
                </div>
                <button
                  onClick={() => useProfileStore.getState().dismissNotification(notif.id)}
                  className="hover:scale-110 active:scale-95 transition-transform"
                >
                  <X size={20} strokeWidth={3} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
