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
  
  const progress = Math.max(0, timeLeft / maxTime);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="relative flex items-center justify-center w-32 h-32">
      <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
        <circle
          cx="64" cy="64" r={radius}
          stroke="rgba(255,255,255,0.2)" strokeWidth="8" fill="none"
        />
        <circle
          cx="64" cy="64" r={radius}
          stroke="white" strokeWidth="8" fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-100 ease-linear"
        />
      </svg>
      <div className="text-3xl font-mono font-bold text-white drop-shadow-md z-10">
        {gameState === 'playing' ? `${timeLeft.toFixed(1)}s` : '0.0s'}
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

  const [inputName, setInputName] = useState(username);

  useEffect(() => {
    if (roundsSurvived > 0) {
      // Small confetti burst on surviving a round, firing right as the next round starts
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#FF3333', '#3333FF', '#33FF33', '#FFFF33', '#9933FF', '#FF9933']
      });
    }
  }, [roundsSurvived]);

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
              <div className="bg-black/50 text-white px-4 py-2 rounded-xl font-mono text-xl shadow-lg border border-white/10 flex items-center gap-2">
                <Trophy size={20} className="text-yellow-400" />
                Round: {roundsSurvived}
              </div>
              
              {(gameState === 'playing' || gameState === 'elimination') && targetColor && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  key={roundsSurvived} // Re-animate on new round
                  className="flex flex-col items-center gap-2"
                >
                  <div 
                    className="text-4xl font-black uppercase tracking-wider px-8 py-4 rounded-2xl shadow-2xl border-4"
                    style={{ 
                      backgroundColor: targetColor.hex, 
                      color: ['#FFFF33', '#33FF33'].includes(targetColor.hex) ? '#000' : '#FFF',
                      borderColor: 'rgba(255,255,255,0.5)'
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
