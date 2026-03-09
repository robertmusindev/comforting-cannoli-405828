import { create } from 'zustand';
import { audio } from './utils/audio';

export const COLORS = [
  { name: 'ROSSO', hex: '#FF3333' },
  { name: 'BLU', hex: '#3333FF' },
  { name: 'VERDE', hex: '#33FF33' },
  { name: 'GIALLO', hex: '#FFFF33' },
  { name: 'VIOLA', hex: '#9933FF' },
  { name: 'ARANCIONE', hex: '#FF9933' }
];

type GameState = 'menu' | 'waiting' | 'playing' | 'elimination' | 'gameover';

interface GameStore {
  gameId: number;
  gameState: GameState;
  username: string;
  targetColor: typeof COLORS[0] | null;
  timeLeft: number;
  maxTime: number;
  roundsSurvived: number;
  gridColors: number[];
  playerSpeedMultiplier: number;
  hoveredBlockIndex: number;
  
  setUsername: (name: string) => void;
  setHoveredBlock: (index: number) => void;
  startGame: () => void;
  startRound: () => void;
  tick: (delta: number) => void;
  eliminate: () => void;
  playerDied: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameId: 0,
  gameState: 'menu',
  username: '',
  targetColor: null,
  timeLeft: 0,
  maxTime: 5,
  roundsSurvived: 0,
  gridColors: Array.from({ length: 400 }, () => Math.floor(Math.random() * COLORS.length)),
  playerSpeedMultiplier: 1,
  hoveredBlockIndex: -1,

  setUsername: (name: string) => set({ username: name }),
  setHoveredBlock: (index: number) => set({ hoveredBlockIndex: index }),

  startGame: () => {
    audio.init();
    audio.startMusic();
    set(state => ({ 
      gameId: state.gameId + 1,
      roundsSurvived: 0, 
      playerSpeedMultiplier: 1, 
      gameState: 'waiting' 
    }));
    get().startRound();
  },

  startRound: () => {
    const newGrid = Array.from({ length: 400 }, () => Math.floor(Math.random() * COLORS.length));
    const targetIndex = Math.floor(Math.random() * COLORS.length);
    
    // Ensure target color is near player
    let centerCol = 10;
    let centerRow = 10;
    const hoveredIndex = get().hoveredBlockIndex;
    if (hoveredIndex !== -1) {
      centerCol = hoveredIndex % 20;
      centerRow = Math.floor(hoveredIndex / 20);
    }
    
    // Place a few guaranteed blocks near the player
    for (let i = 0; i < 3; i++) {
      const c = Math.max(0, Math.min(19, centerCol + Math.floor(Math.random() * 5) - 2));
      const r = Math.max(0, Math.min(19, centerRow + Math.floor(Math.random() * 5) - 2));
      newGrid[r * 20 + c] = targetIndex;
    }
    
    const rounds = get().roundsSurvived;
    const timeForRound = Math.max(1.5, 5 - rounds * 0.2);
    
    audio.setMusicSpeed(1 + rounds * 0.05);
    
    set({
      gameState: 'playing',
      gridColors: newGrid,
      targetColor: COLORS[targetIndex],
      timeLeft: timeForRound,
      maxTime: timeForRound,
      playerSpeedMultiplier: rounds >= 10 ? 1.2 : 1
    });
    
    audio.playRoundStartSound();
  },

  tick: (delta: number) => {
    const { gameState, timeLeft } = get();
    if (gameState === 'playing') {
      const newTime = timeLeft - delta;
      if (newTime <= 0) {
        get().eliminate();
      } else {
        set({ timeLeft: newTime });
      }
    }
  },

  eliminate: () => {
    set({ gameState: 'elimination', timeLeft: 0 });
    audio.playEliminationSound();
    setTimeout(() => {
      if (get().gameState === 'elimination') {
        set((state) => ({ roundsSurvived: state.roundsSurvived + 1 }));
        get().startRound();
      }
    }, 3000); // Increased to 3s to let blocks fall
  },

  playerDied: () => {
    if (get().gameState !== 'gameover') {
      set({ gameState: 'gameover' });
      audio.stopMusic();
      audio.playGameOverSound();
    }
  }
}));
