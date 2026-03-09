import { Game } from './components/Game';
import { useGameStore } from './store';
import { memo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, Play, User } from 'lucide-react';

const TimerDisplay = memo(() => {
  const timeLeft = useGameStore(state => state.timeLeft);
  const maxTime = useGameStore(state => state.maxTime);
  const gameState = useGameStore(state => state.gameState);
  
  const progress = Math.max(0, timeLeft / maxTime) * 100;

  // Determine color based on time left
  let barColor = 'bg-green-500';
  if (timeLeft < 1.5) {
    barColor = 'bg-red-500';
  } else if (timeLeft < 3) {
    barColor = 'bg-yellow-500';
  }

  return (
    <div className="w-full max-w-lg mt-4 flex flex-col items-center">
      <div className="w-full h-8 bg-black/40 rounded-full overflow-hidden border-2 border-white/20 shadow-inner relative">
        <motion.div 
          className={`h-full ${barColor} shadow-[0_0_15px_rgba(255,255,255,0.5)]`}
          initial={{ width: '100%' }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear", duration: 0.1 }}
        />
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center font-mono font-black text-xl text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          {gameState === 'playing' ? `${timeLeft.toFixed(1)}s` : '0.0s'}
        </div>
      </div>
    </div>
  );
});

export default function App() {
  const gameState = useGameStore(state => state.gameState);
  const targetColor = useGameStore(state => state.targetColor);
  const roundsSurvived = useGameStore(state => state.roundsSurvived);
  const startGame = useGameStore(state => state.startGame);
  const username = useGameStore(state => state.username);
  const setUsername = useGameStore(state => state.setUsername);
  const aliveBots = useGameStore(state => state.aliveBots);

  const [inputName, setInputName] = useState(username);

  useEffect(() => {
    if (gameState === 'victory') {
      // Massive confetti burst on win
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const interval: any = setInterval(function() {
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

  const handleStart = () => {
    if (inputName.trim()) {
      setUsername(inputName.trim());
    }
    startGame();
  };

  return (
    <div className="w-full h-screen relative overflow-hidden bg-sky-200">
      <Game />

      {/* UI Overlay */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col justify-between p-6">
        
        {/* Top Bar */}
        <AnimatePresence>
          {gameState !== 'menu' && (
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex justify-between items-start"
            >
              <div className="flex flex-col gap-2">
                <div className="bg-black/50 text-white px-4 py-2 rounded-xl font-mono text-xl shadow-lg border border-white/10 flex items-center gap-2">
                  <Trophy size={20} className="text-yellow-400" />
                  Round: {roundsSurvived}
                </div>
                <div className="bg-black/50 text-white px-4 py-2 rounded-xl font-mono text-lg shadow-lg border border-white/10 flex items-center gap-2">
                  <User size={18} className="text-blue-400" />
                  Vivi: {aliveBots.length + (gameState === 'gameover' ? 0 : 1)}/12
                </div>
              </div>
              
              {(gameState === 'playing' || gameState === 'elimination') && targetColor && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  key={roundsSurvived} // Re-animate on new round
                  className="flex-1 flex flex-col items-center px-4"
                >
                  <div 
                    className="text-5xl font-black uppercase tracking-wider px-12 py-4 rounded-2xl shadow-2xl border-4 text-center"
                    style={{ 
                      backgroundColor: targetColor.hex, 
                      color: ['#FFFF00', '#FFA500', '#80C000'].includes(targetColor.hex) ? '#000' : '#FFF',
                      borderColor: 'rgba(255,255,255,0.5)',
                      textShadow: ['#FFFF00', '#FFA500', '#80C000'].includes(targetColor.hex) ? 'none' : '0 2px 4px rgba(0,0,0,0.5)'
                    }}
                  >
                    VAI SUL {targetColor.name}!
                  </div>
                  <TimerDisplay />
                </motion.div>
              )}
              
              <div className="bg-black/50 text-white px-4 py-2 rounded-xl font-mono text-lg shadow-lg border border-white/10 flex items-center gap-2">
                <User size={18} />
                {username || 'Guest'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center Messages */}
        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {gameState === 'menu' && (
              <motion.div 
                key="menu"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl text-center pointer-events-auto max-w-md w-full border-4 border-indigo-100"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mb-2 uppercase tracking-tight drop-shadow-sm">
                    Color Block
                  </h1>
                  <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 mb-6 uppercase tracking-tight drop-shadow-sm">
                    Party
                  </h1>
                </motion.div>
                
                <p className="text-gray-600 mb-8 text-lg font-medium">
                  Corri sul colore indicato prima che scada il tempo!
                </p>

                <div className="mb-6">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="text" 
                      placeholder="Inserisci il tuo nome..." 
                      value={inputName}
                      onChange={(e) => setInputName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-lg font-medium"
                      onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                    />
                  </div>
                </div>

                <button 
                  onClick={handleStart}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-black py-4 px-8 rounded-xl text-2xl transition-transform active:scale-95 shadow-xl flex items-center justify-center gap-2"
                >
                  <Play fill="currentColor" /> GIOCA ORA
                </button>
              </motion.div>
            )}

            {gameState === 'gameover' && (
              <motion.div 
                key="gameover"
                initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                className="bg-white/95 backdrop-blur-md p-10 rounded-3xl shadow-2xl text-center pointer-events-auto max-w-md w-full border-4 border-red-100"
              >
                <h1 className="text-6xl font-black text-red-500 mb-2 uppercase tracking-tight drop-shadow-md">
                  ELIMINATO!
                </h1>
                <div className="my-8">
                  <p className="text-gray-500 text-lg font-medium uppercase tracking-widest mb-1">Punteggio Finale</p>
                  <p className="text-6xl font-black text-indigo-600 drop-shadow-sm">
                    {roundsSurvived}
                  </p>
                  <p className="text-gray-500 text-md font-medium mt-1">Round Sopravvissuti</p>
                </div>
                <button 
                  onClick={startGame}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-black py-4 px-8 rounded-xl text-2xl transition-transform active:scale-95 shadow-xl flex items-center justify-center gap-2"
                >
                  <Play fill="currentColor" /> RIPROVA
                </button>
              </motion.div>
            )}

            {gameState === 'victory' && (
              <motion.div 
                key="victory"
                initial={{ scale: 0.5, opacity: 0, y: -50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="bg-white/95 backdrop-blur-md p-10 rounded-3xl shadow-2xl text-center pointer-events-auto max-w-md w-full border-4 border-yellow-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/50 to-orange-200/50 pointer-events-none" />
                <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2 uppercase tracking-tight drop-shadow-md relative z-10">
                  VITTORIA!
                </h1>
                <p className="text-xl text-gray-700 font-bold mb-6 relative z-10">
                  Sei l'ultimo sopravvissuto!
                </p>
                <div className="my-8 relative z-10">
                  <Trophy size={80} className="mx-auto text-yellow-500 drop-shadow-lg mb-4" />
                  <p className="text-gray-500 text-lg font-medium uppercase tracking-widest mb-1">Round Superati</p>
                  <p className="text-6xl font-black text-indigo-600 drop-shadow-sm">
                    {roundsSurvived}
                  </p>
                </div>
                <button 
                  onClick={startGame}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-black py-4 px-8 rounded-xl text-2xl transition-transform active:scale-95 shadow-xl flex items-center justify-center gap-2 relative z-10"
                >
                  <Play fill="currentColor" /> GIOCA ANCORA
                </button>
              </motion.div>
            )}

            {gameState === 'elimination' && (
              <motion.div
                key="cleared"
                initial={{ scale: 0.5, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 1.5, opacity: 0 }}
                className="text-6xl font-black text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] uppercase tracking-widest"
                style={{ WebkitTextStroke: '2px black' }}
              >
                SALVO!
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
