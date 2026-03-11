import { Canvas, useFrame } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Sky, Environment } from '@react-three/drei';
import { Platform } from './Platform';
import { Player } from './Player';
import { Bot } from './Bot';
import { NetworkPlayer } from './NetworkPlayer';
import { useGameStore, BOT_NAMES } from '../store';
import { useMultiplayerStore } from '../store/multiplayer';
import * as THREE from 'three';

function GameLogic() {
  const tick = useGameStore(state => state.tick);
  useFrame((state, delta) => {
    tick(delta);
  });
  return null;
}

function MenuCamera() {
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const radius = 25;
    state.camera.position.x = Math.sin(time * 0.2) * radius;
    state.camera.position.z = Math.cos(time * 0.2) * radius;
    state.camera.position.y = 15;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export function Game() {
  const gameState = useGameStore(state => state.gameState);
  const gameId = useGameStore(state => state.gameId);
  const aliveBots = useGameStore(state => state.aliveBots);
  
  const lobbyId = useMultiplayerStore(state => state.lobbyId);
  const players = useMultiplayerStore(state => state.players);
  const myPlayerId = useMultiplayerStore(state => state.myPlayerId);

  // Filter out the local player so we don't render them twice (Player.tsx handles our local physics)
  const remotePlayers = players.filter(p => p.id !== myPlayerId);

  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 10, 15], fov: 50 }}>
      <GameLogic />
      <Sky sunPosition={[100, 20, 100]} turbidity={0.1} rayleigh={0.5} />
      <Environment preset="sunset" />
      <ambientLight intensity={0.4} />
      <directionalLight 
        castShadow 
        position={[30, 50, 20]} 
        intensity={1.5} 
        shadow-mapSize={[512, 512]}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0001}
      />
      
      <Physics gravity={[0, -20, 0]} timeStep="vary">
        <Platform />
        {(gameState === 'playing' || gameState === 'elimination') && (
          <>
            <Player key={`player-${gameId}`} />
            
            {/* Realtime Players */}
            {lobbyId && remotePlayers.map(p => (
              <NetworkPlayer 
                key={`net-${gameId}-${p.id}`} 
                id={p.id} 
                name={p.name} 
                position={p.position || [0, 5, 0]} 
                rotation={p.rotation}
                isEliminated={p.isEliminated} 
              />
            ))}

            {/* AI Bots (Only in Singleplayer) */}
            {!lobbyId && aliveBots.map(id => (
              <Bot key={`bot-${gameId}-${id}`} id={id} name={BOT_NAMES[id]} />
            ))}
          </>
        )}
      </Physics>

      {(gameState === 'menu' || gameState === 'gameover') && <MenuCamera />}
    </Canvas>
  );
}
