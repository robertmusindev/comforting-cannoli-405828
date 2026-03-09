import { create } from 'zustand';
import { audio } from './utils/audio';

export const COLORS = [
  { name: 'ROSSO', hex: '#FF0000' },
  { name: 'ARANCIONE SCURO', hex: '#FF4500' },
  { name: 'AMBRA', hex: '#FFA500' },
  { name: 'GIALLO', hex: '#FFFF00' },
  { name: 'VERDE MELA', hex: '#80C000' },
  { name: 'TEAL', hex: '#009688' },
  { name: 'AZZURRO', hex: '#0070C0' },
  { name: 'BLU NAVY', hex: '#002094' },
  { name: 'INDACO', hex: '#4B0082' },
  { name: 'MAGENTA', hex: '#C00070' }
];

export const BOT_NAMES = ['Astro', 'Turbo', 'Neon', 'Pixels', 'Blitz', 'Dash', 'Zenith', 'Nova', 'Echo', 'Vortex', 'Pulse'];

type GameState = 'menu' | 'waiting' | 'playing' | 'elimination' | 'gameover' | 'victory';

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
  aliveBots: number[];
  
  setUsername: (name: string) => void;
  setHoveredBlock: (index: number) => void;
  startGame: () => void;
  startRound: () => void;
  tick: (delta: number) => void;
  eliminate: () => void;
  playerDied: () => void;
  eliminateBot: (id: number) => void;
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
  aliveBots: [],

  setUsername: (name: string) => set({ username: name }),
  setHoveredBlock: (index: number) => set({ hoveredBlockIndex: index }),

  startGame: () => {
    audio.init();
    audio.startMusic();
    set(state => ({ 
      gameId: state.gameId + 1,
      roundsSurvived: 0, 
      playerSpeedMultiplier: 1, 
      gameState: 'waiting',
      aliveBots: Array.from({ length: 11 }, (_, i) => i) // 11 bots + 1 player = 12 total
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
  },

  eliminateBot: (id: number) => {
    const newAliveBots = get().aliveBots.filter(botId => botId !== id);
    set({ aliveBots: newAliveBots });
    
    // Check win condition
    if (newAliveBots.length === 0 && get().gameState !== 'gameover' && get().gameState !== 'victory') {
      setTimeout(() => {
        if (get().gameState !== 'gameover') {
          set({ gameState: 'victory', timeLeft: 0 });
          audio.stopMusic();
          // audio.playVictorySound() - Reusing logic or adding if exists
        }
      }, 1000);
    }
  }
}));
