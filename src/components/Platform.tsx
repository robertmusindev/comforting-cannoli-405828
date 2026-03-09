import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { useGameStore, COLORS } from '../store';
import { memo, useRef, useEffect } from 'react';

const Block = memo(({ index, colorIndex, targetColorIndex, isElimination, isGameover, isHovered, roundsSurvived }: { index: number, colorIndex: number, targetColorIndex: number, isElimination: boolean, isGameover: boolean, isHovered: boolean, roundsSurvived: number }) => {
  const x = (index % 20) - 9.5;
  const z = Math.floor(index / 20) - 9.5;
  
  const isTarget = colorIndex === targetColorIndex;
  const shouldFall = (isElimination || isGameover) && !isTarget;

  const materialColor = COLORS[colorIndex].hex;
  const emissiveColor = isHovered ? materialColor : '#000000';
  const emissiveIntensity = isHovered ? 0.5 : 0;
  
  const bodyRef = useRef<any>(null);

  useEffect(() => {
    // Reset blocks cleanly at the start of a round without unmounting them
    if (!isElimination && !isGameover && bodyRef.current) {
      bodyRef.current.setTranslation({ x: x * 2, y: -0.5, z: z * 2 }, true);
      bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      bodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }
  }, [roundsSurvived, isElimination, isGameover, x, z]);

  return (
    <RigidBody 
      ref={bodyRef}
      type={shouldFall ? "dynamic" : "kinematicPosition"} 
      position={[x * 2, -0.5, z * 2]} 
      colliders={false}
      restitution={0.2}
      friction={0}
    >
      <CuboidCollider args={[1, 0.5, 1]} friction={0} />
      <mesh receiveShadow castShadow>
        <boxGeometry args={[1.95, 1, 1.95]} />
        <meshStandardMaterial 
          color={materialColor} 
          roughness={0.8} 
          flatShading 
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
    </RigidBody>
  );
});

export function Platform() {
  const gridColors = useGameStore(state => state.gridColors);
  const gameState = useGameStore(state => state.gameState);
  const targetColor = useGameStore(state => state.targetColor);
  const hoveredBlockIndex = useGameStore(state => state.hoveredBlockIndex);
  const roundsSurvived = useGameStore(state => state.roundsSurvived);
  
  const targetColorIndex = targetColor ? COLORS.findIndex(c => c.name === targetColor.name) : -1;
  const isElimination = gameState === 'elimination';
  const isGameover = gameState === 'gameover';

  return (
    <group>
      {gridColors.map((colorIndex, i) => (
        <Block 
          key={i}
          index={i} 
          colorIndex={colorIndex} 
          targetColorIndex={targetColorIndex} 
          isElimination={isElimination} 
          isGameover={isGameover}
          isHovered={i === hoveredBlockIndex}
          roundsSurvived={roundsSurvived}
        />
      ))}
    </group>
  );
}
