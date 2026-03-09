import { useFrame } from '@react-three/fiber';
import { Billboard, Text } from '@react-three/drei';
import { RigidBody, CapsuleCollider, useRapier } from '@react-three/rapier';
import { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useGameStore, COLORS } from '../store';

const SPEED = 9.5; // Slightly slower than player
const JUMP_FORCE = 8;

export function Bot({ id, name }: { id: number; name: string }) {
  const bodyRef = useRef<any>(null);
  const avatarRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const walkTime = useRef(Math.random() * 10); // Offset animation per bot
  
  const [targetBlock, setTargetBlock] = useState<{x: number, z: number} | null>(null);
  const [reactionTimer, setReactionTimer] = useState(0);

  const { world } = useRapier();
  const gameState = useGameStore(state => state.gameState);
  const targetColor = useGameStore(state => state.targetColor);
  const gridColors = useGameStore(state => state.gridColors);
  const eliminateBot = useGameStore(state => state.eliminateBot);

  // Random torso color per bot
  const torsoColor = useMemo(() => {
    const colors = ['#e74c3c', '#2ecc71', '#9b59b6', '#f1c40f', '#e67e22', '#1abc9c', '#e84393', '#00b894', '#fdcb6e', '#6c5ce7', '#ff7675'];
    return colors[id % colors.length];
  }, [id]);

  // Initial random position
  const startPos = useMemo(() => {
    return [
      (Math.random() - 0.5) * 15,
      10 + Math.random() * 10, // Drop from sky
      (Math.random() - 0.5) * 15
    ] as [number, number, number];
  }, []);

  useFrame((state, delta) => {
    if (!bodyRef.current) return;

    const position = bodyRef.current.translation();
    const pos = { x: position.x, y: position.y, z: position.z };
    
    if (pos.y < -10) {
      eliminateBot(id);
      return;
    }

    const velocity = bodyRef.current.linvel();
    const vel = { x: velocity.x, y: velocity.y, z: velocity.z };
    const isGrounded = pos.y <= 5.2 && Math.abs(vel.y) < 0.2;
    
    // AI Logic
    const direction = new THREE.Vector3();
    
    if (gameState === 'playing' && targetColor) {
      if (!targetBlock) {
        // Delay decision slightly to simulate reaction time
        if (reactionTimer > 0) {
          setReactionTimer(prev => prev - delta);
        } else {
          // Find closest target block
          const targetColorIndex = COLORS.findIndex(c => c.name === targetColor.name);
          let closestDist = Infinity;
          let bestBlock: {x: number, z: number} | null = null;
          
          Object.entries(gridColors).forEach(([idx, colorIndex]) => {
            if (colorIndex === targetColorIndex) {
              const bIndex = parseInt(idx);
              const bx = (bIndex % 20) - 9.5;
              const bz = Math.floor(bIndex / 20) - 9.5;
              const dist = Math.sqrt(Math.pow(bx * 2 - pos.x, 2) + Math.pow(bz * 2 - pos.z, 2));
              
              // Add some randomness so bots don't all perfectly stack
              const randomizedDist = dist + Math.random() * 8;
              if (randomizedDist < closestDist) {
                closestDist = randomizedDist;
                bestBlock = { x: bx * 2 + (Math.random() - 0.5), z: bz * 2 + (Math.random() - 0.5) };
              }
            }
          });
          
          if (bestBlock) {
             // 10% chance the bot targets a random WRONG block to simulate dumb players dying
             if (Math.random() < 0.1) {
                const randomWrongIndex = Math.floor(Math.random() * 400);
                const rx = (randomWrongIndex % 20) - 9.5;
                const rz = Math.floor(randomWrongIndex / 20) - 9.5;
                setTargetBlock({ x: rx * 2, z: rz * 2 });
             } else {
                setTargetBlock(bestBlock);
             }
          }
        }
      } else {
        // Move towards target
        const dx = targetBlock.x - pos.x;
        const dz = targetBlock.z - pos.z;
        const distToTarget = Math.sqrt(dx * dx + dz * dz);
        
        if (distToTarget > 0.5) {
          direction.set(dx, 0, dz).normalize().multiplyScalar(SPEED);
        } else {
           // At target, occasionally jump
           if (Math.random() < 0.01 && isGrounded && vel.y <= 0.1) {
              bodyRef.current.setLinvel({ x: vel.x, y: JUMP_FORCE, z: vel.z }, true);
           }
        }
      }
    } else {
      // Not playing, reset target
      if (targetBlock) {
        setTargetBlock(null);
        setReactionTimer(0.2 + Math.random() * 1.5); // Random reaction time for next round
      }
      
      // Random wander slightly
      if (Math.random() < 0.01 && isGrounded && vel.y <= 0.1) {
          bodyRef.current.setLinvel({ x: vel.x, y: JUMP_FORCE, z: vel.z }, true);
      }
    }


    const currentVelocity = new THREE.Vector3(vel.x, 0, vel.z);
    const controlFactor = isGrounded ? 1 - Math.exp(-25 * delta) : 1 - Math.exp(-5 * delta);
    currentVelocity.lerp(direction, controlFactor);
    bodyRef.current.setLinvel({ x: currentVelocity.x, y: vel.y, z: currentVelocity.z }, true);

    // Rotation
    if (direction.lengthSq() > 0.1 && avatarRef.current) {
      const targetAngle = Math.atan2(direction.x, direction.z);
      const targetQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), targetAngle);
      avatarRef.current.quaternion.slerp(targetQuaternion, 1 - Math.exp(-15 * delta));
    }

    // Walking animation
    const speed = currentVelocity.length();
    if (isGrounded && speed > 0.5) {
      walkTime.current += delta * speed * 1.5;
      const armSwing = Math.sin(walkTime.current) * 0.5;
      const legSwing = Math.sin(walkTime.current) * 0.6;
      
      if (leftArmRef.current) leftArmRef.current.rotation.x = armSwing;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -armSwing;
      if (leftLegRef.current) leftLegRef.current.rotation.x = -legSwing;
      if (rightLegRef.current) rightLegRef.current.rotation.x = legSwing;
    } else {
      if (leftArmRef.current) leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, 1 - Math.exp(-15 * delta));
      if (rightArmRef.current) rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0, 1 - Math.exp(-15 * delta));
      if (leftLegRef.current) leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, 1 - Math.exp(-15 * delta));
      if (rightLegRef.current) rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, 1 - Math.exp(-15 * delta));
    }
  });

  return (
    <RigidBody ref={bodyRef} colliders={false} position={startPos} enabledRotations={[false, false, false]}>
      <CapsuleCollider args={[0.5, 0.5]} friction={0} />
      <group ref={avatarRef} position={[0, -0.5, 0]}>
         {/* Head */}
        <group position={[0, 1.5, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.8, 0.8, 0.8]} />
            <meshStandardMaterial color="#FFD1A4" flatShading />
          </mesh>
          <mesh position={[-0.2, 0.1, 0.41]}>
            <boxGeometry args={[0.1, 0.1, 0.05]} />
            <meshStandardMaterial color="#000" flatShading />
          </mesh>
          <mesh position={[0.2, 0.1, 0.41]}>
            <boxGeometry args={[0.1, 0.1, 0.05]} />
            <meshStandardMaterial color="#000" flatShading />
          </mesh>
          <mesh position={[0, -0.2, 0.41]}>
            <boxGeometry args={[0.3, 0.1, 0.05]} />
            <meshStandardMaterial color="#000" flatShading />
          </mesh>
        </group>
        {/* Torso */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[1, 1, 0.5]} />
          <meshStandardMaterial color={torsoColor} flatShading />
        </mesh>
        {/* Arms */}
        <group position={[-0.7, 0.9, 0]}>
          <mesh ref={leftArmRef} position={[0, -0.3, 0]} castShadow>
            <boxGeometry args={[0.3, 1, 0.3]} />
            <meshStandardMaterial color="#FFD1A4" flatShading />
          </mesh>
        </group>
        <group position={[0.7, 0.9, 0]}>
          <mesh ref={rightArmRef} position={[0, -0.3, 0]} castShadow>
            <boxGeometry args={[0.3, 1, 0.3]} />
            <meshStandardMaterial color="#FFD1A4" flatShading />
          </mesh>
        </group>
        {/* Legs */}
        <group position={[-0.25, 0.1, 0]}>
          <mesh ref={leftLegRef} position={[0, -0.3, 0]} castShadow>
            <boxGeometry args={[0.4, 0.6, 0.4]} />
            <meshStandardMaterial color="#2c3e50" flatShading />
          </mesh>
        </group>
        <group position={[0.25, 0.1, 0]}>
          <mesh ref={rightLegRef} position={[0, -0.3, 0]} castShadow>
            <boxGeometry args={[0.4, 0.6, 0.4]} />
            <meshStandardMaterial color="#2c3e50" flatShading />
          </mesh>
        </group>
      </group>
      <Billboard position={[0, 2.8, 0]}>
        <Text fontSize={0.3} color="#eee" outlineWidth={0.04} outlineColor="black" fontWeight="bold">
          {name}
        </Text>
      </Billboard>
    </RigidBody>
  );
}
