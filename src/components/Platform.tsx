import { InstancedRigidBodies, RapierRigidBody, InstancedRigidBodyProps } from '@react-three/rapier';
import { useGameStore, COLORS } from '../store';
import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Coin } from './Coin';

const GRID_SIZE = 20;
const TOTAL_BLOCKS = GRID_SIZE * GRID_SIZE;

export function Platform() {
  const gridColors = useGameStore(state => state.gridColors);
  const gameState = useGameStore(state => state.gameState);
  const targetColor = useGameStore(state => state.targetColor);
  const hoveredBlockIndex = useGameStore(state => state.hoveredBlockIndex);
  const roundsSurvived = useGameStore(state => state.roundsSurvived);
  
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const rigidBodiesRef = useRef<RapierRigidBody[]>(null);

  const targetColorIndex = targetColor ? COLORS.findIndex(c => c.name === targetColor.name) : -1;
  const isElimination = gameState === 'elimination';
  const isGameover = gameState === 'gameover';

  // Prepare instances data
  const instances = useMemo(() => {
    const inst: InstancedRigidBodyProps[] = [];
    for (let i = 0; i < TOTAL_BLOCKS; i++) {
      const x = (i % GRID_SIZE) - 9.5;
      const z = Math.floor(i / GRID_SIZE) - 9.5;
      inst.push({
        key: i,
        position: [x * 2, -0.5, z * 2],
        type: "kinematicPosition",
        colliders: "cuboid"
      });
    }
    return inst;
  }, []);

  // 1. Physics Update: Only run when game state or round changes
  useEffect(() => {
    if (!rigidBodiesRef.current) return;

    gridColors.forEach((colorIndex, i) => {
      const body = rigidBodiesRef.current![i];
      if (!body) return;

      const isTarget = colorIndex === targetColorIndex;
      const shouldHide = (isElimination || isGameover) && !isTarget;
      
      if (shouldHide) {
        // Move far but not TOO far (avoid precision/NaN issues), keep kinematic
        body.setBodyType(2, true);
        const x = (i % GRID_SIZE) - 9.5;
        const z = Math.floor(i / GRID_SIZE) - 9.5;
        body.setTranslation({ x: x * 2, y: -100, z: z * 2 }, true);
      } else {
        // Reset to kinematic and restore position
        body.setBodyType(2, true);
        const x = (i % GRID_SIZE) - 9.5;
        const z = Math.floor(i / GRID_SIZE) - 9.5;
        body.wakeUp();
        body.setTranslation({ x: x * 2, y: -0.5, z: z * 2 }, true);
        body.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
        body.setLinvel({ x: 0, y: 0, z: 0 }, true);
        body.setAngvel({ x: 0, y: 0, z: 0 }, true);
      }
    });
  }, [roundsSurvived, isElimination, isGameover, targetColorIndex]); // REMOVED hoveredBlockIndex and gridColors from here

  // 2. Visuals Update: Run on color changes or hover
  useEffect(() => {
    if (!meshRef.current) return;

    const tempColor = new THREE.Color();
    
    gridColors.forEach((colorIndex, i) => {
      // Update Visuals (Colors)
      const colorHex = COLORS[colorIndex].hex;
      tempColor.set(colorHex);
      
      // Hover effect: Only touch color, don't touch physics!
      if (i === hoveredBlockIndex) {
        tempColor.multiplyScalar(1.4); // Subtle highlight
      }
      
      meshRef.current?.setColorAt(i, tempColor);
    });

    meshRef.current.instanceColor!.needsUpdate = true;
    
    // Senior Dev Tip: Manually compute bounding sphere to prevent the mesh 
    // from disappearing if Three.js box culling gets confused by physics moves.
    meshRef.current.computeBoundingSphere();
  }, [gridColors, hoveredBlockIndex]);

  return (
    <group>
      <InstancedRigidBodies
        ref={rigidBodiesRef}
        instances={instances}
        colliders="cuboid"
      >
        <instancedMesh
          ref={meshRef}
          args={[undefined, undefined, TOTAL_BLOCKS]}
          castShadow
          receiveShadow={false}
          frustumCulled={false}
        >
          <boxGeometry args={[1.95, 1, 1.95]} />
          <meshStandardMaterial roughness={0.8} />
        </instancedMesh>
      </InstancedRigidBodies>
      
      {useGameStore.getState().spawnedCoins.map(idx => (
        <Coin key={`coin-${idx}`} index={idx} />
      ))}
    </group>
  );
}
