import { create } from 'zustand';
import { audio } from './utils/audio';
import { useMultiplayerStore } from './store/multiplayer';

export const COLORS = [
  { name: 'red', hex: '#FF0000' },
  { name: 'orange', hex: '#FF4500' },
  { name: 'amber', hex: '#FFA500' },
  { name: 'yellow', hex: '#FFFF00' },
  { name: 'lime', hex: '#80C000' },
  { name: 'teal', hex: '#009688' },
  { name: 'cyan', hex: '#0070C0' },
  { name: 'blue', hex: '#002094' },
  { name: 'purple', hex: '#4B0082' },
  { name: 'magenta', hex: '#C00070' }
];

export const BOT_NAMES = ['Astro', 'Turbo', 'Neon', 'Pixels', 'Blitz', 'Dash', 'Zenith', 'Nova', 'Echo', 'Vortex', 'Pulse'];

type GameState = 'menu' | 'waiting' | 'playing' | 'elimination' | 'gameover' | 'victory';

interface GameStore {
  gameId: number;
  gameState: GameState;
  isPaused: boolean;
  username: string;
  targetColor: typeof COLORS[0] | null;
  timeLeft: number;
  maxTime: number;
  roundsSurvived: number;
  gridColors: number[];
  playerSpeedMultiplier: number;
  hoveredBlockIndex: number;
  aliveBots: number[];
  sessionCoins: number;
  spawnedCoins: number[];
  
  setUsername: (name: string) => void;
  setHoveredBlock: (index: number) => void;
  startGame: () => void;
  startRound: () => void;
  collectCoin: (index: number) => void;
  
  // Network sync methods
  networkStartGame: (seed: number) => void;
  networkStartRound: (roundData: { seed: number, targetIndex: number, timeLimit: number, roundsSurvived: number }) => void;
  networkEliminatePlayer: (playerId: string) => void;
  
  togglePause: () => void;
  tick: (delta: number) => void;
  eliminate: () => void;
  playerDied: () => void;
  eliminateBot: (id: number) => void;
}

// Simple deterministic random number generator for synchronized grids
const sfc32 = (a: number, b: number, c: number, d: number) => {
    return function() {
      a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; 
      var t = (a + b) | 0;
      a = b ^ b >>> 9;
      b = c + (c << 3) | 0;
      c = (c << 21 | c >>> 11);
      d = d + 1 | 0;
      t = t + d | 0;
      c = c + t | 0;
      return (t >>> 0) / 4294967296;
    }
};

let prng = Math.random;

export const useGameStore = create<GameStore>((set, get) => ({
  gameId: 0,
  gameState: 'menu',
  isPaused: false,
  username: '',
  targetColor: null,
  timeLeft: 0,
  maxTime: 5,
  roundsSurvived: 0,
  gridColors: Array.from({ length: 400 }, () => Math.floor(Math.random() * COLORS.length)),
  playerSpeedMultiplier: 1,
  hoveredBlockIndex: -1,
  aliveBots: [],
  sessionCoins: 0,
  spawnedCoins: [],
  
  setUsername: (name: string) => set({ username: name }),
  setHoveredBlock: (index: number) => set({ hoveredBlockIndex: index }),

  startGame: () => {
    const { isHost, channel, lobbyId } = useMultiplayerStore.getState();
    const isMultiplayer = !!lobbyId;

    if (isMultiplayer && !isHost) return; // Only host can start mutiplayer game

    const seed = Math.floor(Math.random() * 1000000);
    
    if (isMultiplayer && channel) {
      channel.send({
        type: 'broadcast',
        event: 'start_game',
        payload: { seed }
      });
    }
    
    get().networkStartGame(seed);
  },

  networkStartGame: (seed: number) => {
    prng = sfc32(seed, seed ^ 0xDEADBEEF, seed ^ 0xBAADF00D, seed ^ 0x01234567);
    audio.init();
    audio.startMusic();
    const isMultiplayer = !!useMultiplayerStore.getState().lobbyId;

    set(state => ({ 
      gameId: state.gameId + 1,
      roundsSurvived: 0, 
      playerSpeedMultiplier: 1, 
      gameState: 'waiting',
      isPaused: false,
      sessionCoins: 0,
      spawnedCoins: [],
      // If multiplayer, zero bots (we use Realtime players). If singleplayer, 11 bots.
      aliveBots: isMultiplayer ? [] : Array.from({ length: 11 }, (_, i) => i) 
    }));
    
    if (!isMultiplayer || useMultiplayerStore.getState().isHost) {
        get().startRound();
    }
  },

  startRound: () => {
    const { isHost, channel, lobbyId } = useMultiplayerStore.getState();
    const isMultiplayer = !!lobbyId;
    
    if (isMultiplayer && !isHost) return;

    const seed = Math.floor(Math.random() * 1000000);
    const targetIndex = Math.floor(Math.random() * COLORS.length);
    const rounds = get().roundsSurvived;
    const timeForRound = Math.max(1.5, 5 - rounds * 0.2);

    if (isMultiplayer && channel) {
      channel.send({
        type: 'broadcast',
        event: 'start_round',
        payload: { seed, targetIndex, timeLimit: timeForRound, roundsSurvived: rounds }
      });
    }

    get().networkStartRound({ seed, targetIndex, timeLimit: timeForRound, roundsSurvived: rounds });
  },

  networkStartRound: ({ seed, targetIndex, timeLimit, roundsSurvived }) => {
    prng = sfc32(seed, seed ^ 0xDEADBEEF, seed ^ 0xBAADF00D, seed ^ 0x01234567);
    const newGrid = Array.from({ length: 400 }, () => Math.floor(prng() * COLORS.length));
    
    audio.setMusicSpeed(1 + roundsSurvived * 0.05);
    
    set({
      gameState: 'playing',
      gridColors: newGrid,
      targetColor: COLORS[targetIndex],
      timeLeft: timeLimit,
      maxTime: timeLimit,
      roundsSurvived: roundsSurvived,
      playerSpeedMultiplier: roundsSurvived >= 10 ? 1.2 : 1,
      spawnedCoins: (() => {
        const potentialIndices = newGrid.map((c, i) => c === targetIndex ? i : -1).filter(i => i !== -1);
        const count = Math.floor(prng() * 3) + 1; // 1-3 coins (using prng)
        const coins: number[] = [];
        for(let i=0; i<count && potentialIndices.length > 0; i++) {
          const randIdx = Math.floor(prng() * potentialIndices.length);
          coins.push(potentialIndices.splice(randIdx, 1)[0]);
        }
        return coins;
      })()
    });
    
    audio.playRoundStartSound();
  },

  togglePause: () => set(state => ({ isPaused: !state.isPaused })),

  tick: (delta: number) => {
    const { gameState, timeLeft } = get();
    // The game must keep ticking even if the local player presses ESC
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
    const { lobbyId, broadcastElimination } = useMultiplayerStore.getState();
    
    set({ gameState: 'elimination', timeLeft: 0 });
    audio.playEliminationSound();
    
    if (lobbyId) {
       broadcastElimination();
    }
    
    setTimeout(() => {
      if (get().gameState === 'elimination') {
        const { isHost, lobbyId } = useMultiplayerStore.getState();
        // Host advances the round. In singleplayer, local advances immediately.
        if (!lobbyId) {
            set((state) => ({ roundsSurvived: state.roundsSurvived + 1 }));
            get().startRound();
        } else if (isHost) {
            setTimeout(() => {
              set((state) => ({ roundsSurvived: state.roundsSurvived + 1 }));
              get().startRound();
            }, 1000);
        }
      }
    }, 3000); 
  },

  networkEliminatePlayer: (playerId: string) => {
      // Called when another player falls via broadcast
      // We will handle setting them to eliminated in the multiplayer store directly,
      // but here we could trigger UI or check win conditions for multiplayer (later step)
  },

  playerDied: () => {
    if (get().gameState !== 'gameover') {
      const rounds = get().roundsSurvived;
      const coins = get().sessionCoins;
      set({ gameState: 'gameover' });
      audio.stopMusic();
      audio.playGameOverSound();

      // Reward the player via Profile Store
      import('./store/profile').then(m => {
        // Now passing session coins collected too
        m.useProfileStore.getState().addReward(rounds, false, coins);
      });
    }
  },

  eliminateBot: (id: number) => {
    const newAliveBots = get().aliveBots.filter(botId => botId !== id);
    set({ aliveBots: newAliveBots });
    
    // Check win condition
    if (newAliveBots.length === 0 && get().gameState !== 'gameover' && get().gameState !== 'victory') {
      setTimeout(() => {
        if (get().gameState !== 'gameover') {
          const rounds = get().roundsSurvived;
          set({ gameState: 'victory', timeLeft: 0 });
          audio.stopMusic();
          
          // Reward the player via Profile Store (Victory bonus)
          import('./store/profile').then(m => {
            const coins = get().sessionCoins;
            m.useProfileStore.getState().addReward(rounds, true, coins);
          });
        }
      }, 1000);
    }
  },

  collectCoin: (index: number) => {
    set(state => ({
      sessionCoins: state.sessionCoins + 1,
      spawnedCoins: state.spawnedCoins.filter(i => i !== index)
    }));
    // audio.playCoinSound(); // If exists or add it
  },
}));
