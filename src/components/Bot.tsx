import { useFrame } from '@react-three/fiber';
import { Billboard, Text } from '@react-three/drei';
import { RigidBody, CapsuleCollider, useRapier } from '@react-three/rapier';
import { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useGameStore, COLORS } from '../store';

const SPEED = 9.5; // Slightly slower than player
const JUMP_FORCE = 8;

const _direction = new THREE.Vector3();
const _currentVelocity = new THREE.Vector3();
const _targetQuaternion = new THREE.Quaternion();
const _upVector = new THREE.Vector3(0, 1, 0);
const _scaleVector = new THREE.Vector3();

export function Bot({ id, name }: { id: number; name: string }) {
  const bodyRef = useRef<any>(null);
  const avatarRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const walkTime = useRef(Math.random() * 10); // Offset animation per bot
  
  const [reactionTimer, setReactionTimer] = useState(0);
  const [aiState, setAiState] = useState<'idle' | 'wandering' | 'seeking' | 'waiting'>('wandering');
  const [wanderTarget, setWanderTarget] = useState<{x: number, z: number} | null>(null);

  const { world } = useRapier();
  const gameState = useGameStore(state => state.gameState);
  const targetColor = useGameStore(state => state.targetColor);
  const gridColors = useGameStore(state => state.gridColors);
  const eliminateBot = useGameStore(state => state.eliminateBot);
  const targetBlockRef = useRef<{x: number, z: number} | null>(null);

  // Random torso color per bot
  const torsoColor = useMemo(() => {
    const colors = ['#e74c3c', '#2ecc71', '#9b59b6', '#f1c40f', '#e67e22', '#1abc9c', '#e84393', '#00b894', '#fdcb6e', '#6c5ce7', '#ff7675'];
    return colors[id % colors.length];
  }, [id]);

  // Initial random position
  const startPos = useMemo(() => {
    return [
      (Math.random() - 0.5) * 15,
      5.5 + Math.random() * 2, // Spawns near the ground
      (Math.random() - 0.5) * 15
    ] as [number, number, number];
  }, []);

  // AI Logic calculation (High performance: don't scan 400 blocks every frame!)
  useEffect(() => {
    if (gameState === 'playing' && targetColor) {
      const targetColorIndex = COLORS.findIndex(c => c.name === targetColor.name);
      let closestDist = Infinity;
      let bestBlock: {x: number, z: number} | null = null;
      
      const currentPos = bodyRef.current?.translation() || { x: 0, z: 0 };

      gridColors.forEach((colorIndex, i) => {
        if (colorIndex === targetColorIndex) {
          const bx = (i % 20) - 9.5;
          const bz = Math.floor(i / 20) - 9.5;
          const dist = Math.sqrt(Math.pow(bx * 2 - currentPos.x, 2) + Math.pow(bz * 2 - currentPos.z, 2));
          
          // Add some per-bot variation
          const randomizedDist = dist + (id % 5); 
          if (randomizedDist < closestDist) {
            closestDist = randomizedDist;
            bestBlock = { x: bx * 2, z: bz * 2 };
          }
        }
      });
      
      if (bestBlock) {
        // 18% chance to go to a totally wrong block
        if (Math.random() < 0.18) {
          const rIdx = Math.floor(Math.random() * 400);
          const rx = (rIdx % 20) - 9.5;
          const rz = Math.floor(rIdx / 20) - 9.5;
          targetBlockRef.current = { x: rx * 2, z: rz * 2 };
        } else {
          targetBlockRef.current = { 
            x: bestBlock.x + (Math.random() * 0.8 - 0.4), 
            z: bestBlock.z + (Math.random() * 0.8 - 0.4) 
          };
        }
      }
    } else {
      targetBlockRef.current = null;
    }
  }, [gameState, targetColor, gridColors, id]);

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
    const isGrounded = pos.y <= 1.2 && Math.abs(vel.y) < 2.0; // Updated ground check to match player
    
    // AI Logic State Machine
    _direction.set(0, 0, 0);

    if (gameState === 'playing' && targetColor) {
      if (aiState === 'wandering' || aiState === 'idle') {
        // Transition to taking action, but wait for reaction time first
        if (reactionTimer > 0) {
          setReactionTimer(prev => prev - delta);
          if (Math.random() < 0.05 * delta && isGrounded) {
             bodyRef.current.setLinvel({ x: vel.x, y: JUMP_FORCE, z: vel.z }, true);
             if (avatarRef.current) avatarRef.current.scale.set(1.4, 0.6, 1.4);
          }
        } else {
          setAiState('seeking');
        }
      } else if (aiState === 'seeking' && targetBlockRef.current) {
        // Move towards target
        const dx = targetBlockRef.current.x - pos.x;
        const dz = targetBlockRef.current.z - pos.z;
        const distToTarget = Math.sqrt(dx * dx + dz * dz);
        
        if (distToTarget > 0.8) {
          _direction.set(dx, 0, dz).normalize().multiplyScalar(SPEED);
          if (Math.random() < 2.5 * delta && isGrounded) {
             bodyRef.current.setLinvel({ x: vel.x, y: JUMP_FORCE, z: vel.z }, true);
             if (avatarRef.current) avatarRef.current.scale.set(1.4, 0.6, 1.4);
          }
        } else {
          setAiState('waiting');
          if (isGrounded) {
            bodyRef.current.setLinvel({ x: vel.x, y: JUMP_FORCE * 0.8, z: vel.z }, true);
            if (avatarRef.current) avatarRef.current.scale.set(1.4, 0.6, 1.4);
          }
        }
      } else if (aiState === 'waiting' && targetBlockRef.current) {
         const dx = targetBlockRef.current.x - pos.x;
         const dz = targetBlockRef.current.z - pos.z;
         const distToTarget = Math.sqrt(dx * dx + dz * dz);
         
         if (distToTarget > 1.2) {
           setAiState('seeking');
         } else {
           if (Math.random() < 3.0 * delta && isGrounded) {
             bodyRef.current.setLinvel({ x: vel.x, y: JUMP_FORCE * 0.7, z: vel.z }, true);
           }
         }
      }
    } else if (gameState === 'elimination' || gameState === 'gameover' || gameState === 'victory') {
         // Blocks are falling or game is over! Stand still on the block!
         if (aiState !== 'idle') {
             setAiState('idle');
             targetBlockRef.current = null; // Corrected from setTargetBlock(null)
             setWanderTarget(null);
             // Randomly set reaction time for NEXT round so they survive better
             setReactionTimer(0.1 + Math.random() * 0.7); 
         }
         
         // Celebrate/panic by jumping in place occasionally
         if (Math.random() < 0.3 * delta && isGrounded) {
             bodyRef.current.setLinvel({ x: vel.x, y: JUMP_FORCE, z: vel.z }, true);
             if (avatarRef.current) avatarRef.current.scale.set(1.4, 0.6, 1.4);
         }
    } else {
      // Waiting lobby / between rounds
      if (aiState !== 'wandering') {
        setAiState('wandering');
        targetBlockRef.current = null; // Corrected from setTargetBlock(null)
        setWanderTarget(null);
      }
      
      // Wandering Logic (between rounds)
      if (!wanderTarget || Math.random() < 0.5 * delta) {
         // Pick new wander target nearby
         setWanderTarget({
            x: Math.max(-18, Math.min(18, pos.x + (Math.random() - 0.5) * 10)),
            z: Math.max(-18, Math.min(18, pos.z + (Math.random() - 0.5) * 10))
         });
      }

      if (wanderTarget) {
         const dx = wanderTarget.x - pos.x;
         const dz = wanderTarget.z - pos.z;
         const dist = Math.sqrt(dx * dx + dz * dz);
         
         if (dist > 1.0) {
            // Wander slower than running speed
            _direction.set(dx, 0, dz).normalize().multiplyScalar(SPEED * 0.4);
         }
      }

      // Random jump while wandering
      if (Math.random() < 0.3 * delta && isGrounded && vel.y <= 0.1) {
          bodyRef.current.setLinvel({ x: vel.x, y: JUMP_FORCE, z: vel.z }, true);
          if (avatarRef.current) avatarRef.current.scale.set(1.4, 0.6, 1.4);
      }
    }

    _currentVelocity.set(vel.x, 0, vel.z);
    const controlFactor = isGrounded ? 1 - Math.exp(-25 * delta) : 1 - Math.exp(-5 * delta);
    _currentVelocity.lerp(_direction, controlFactor);
    bodyRef.current.setLinvel({ x: _currentVelocity.x, y: vel.y, z: _currentVelocity.z }, true);

    // Rotation
    if (_direction.lengthSq() > 0.1 && avatarRef.current) {
      const targetAngle = Math.atan2(_direction.x, _direction.z);
      _targetQuaternion.setFromAxisAngle(_upVector, targetAngle);
      avatarRef.current.quaternion.slerp(_targetQuaternion, 1 - Math.exp(-15 * delta));
    }

    // Squash and stretch
    if (avatarRef.current) {
      const yVel = vel.y;
      if (!isGrounded) {
        const stretch = Math.max(0.7, Math.min(1.3, 1 + yVel * 0.04));
        const squash = 1 / Math.sqrt(stretch);
        _scaleVector.set(squash, stretch, squash);
        avatarRef.current.scale.lerp(_scaleVector, 1 - Math.exp(-20 * delta));
      } else {
        _scaleVector.set(1, 1, 1);
        avatarRef.current.scale.lerp(_scaleVector, 1 - Math.exp(-15 * delta));
      }
    }

    // Walking animation
    const speed = _currentVelocity.length();
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
    <RigidBody ref={bodyRef} ccd={true} colliders={false} position={startPos} enabledRotations={[false, false, false]}>
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
