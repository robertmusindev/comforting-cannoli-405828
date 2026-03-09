import { useFrame } from '@react-three/fiber';
import { RigidBody, CapsuleCollider, useRapier } from '@react-three/rapier';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useGameStore } from '../store';
import { audio } from '../utils/audio';

const SPEED = 12;
const JUMP_FORCE = 8;

export function Player() {
  const bodyRef = useRef<any>(null);
  const avatarRef = useRef<THREE.Group>(null);
  const footstepTimer = useRef(0);
  
  // Use ref instead of useState to prevent continuous re-rendering
  const keys = useRef({ forward: false, backward: false, left: false, right: false, jump: false });
  
  const { rapier, world } = useRapier();
  const playerDied = useGameStore(state => state.playerDied);
  const playerSpeedMultiplier = useGameStore(state => state.playerSpeedMultiplier);
  const gameState = useGameStore(state => state.gameState);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling with spacebar
      if (e.code === 'Space') e.preventDefault();
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': keys.current.forward = true; break;
        case 'KeyS': case 'ArrowDown': keys.current.backward = true; break;
        case 'KeyA': case 'ArrowLeft': keys.current.left = true; break;
        case 'KeyD': case 'ArrowRight': keys.current.right = true; break;
        case 'Space': keys.current.jump = true; break;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': keys.current.forward = false; break;
        case 'KeyS': case 'ArrowDown': keys.current.backward = false; break;
        case 'KeyA': case 'ArrowLeft': keys.current.left = false; break;
        case 'KeyD': case 'ArrowRight': keys.current.right = false; break;
        case 'Space': keys.current.jump = false; break;
      }
    };
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (!bodyRef.current) return;

    const position = bodyRef.current.translation();
    const pos = { x: position.x, y: position.y, z: position.z };
    
    if (pos.y < -10) {
      playerDied();
      return;
    }

    const velocity = bodyRef.current.linvel();
    const vel = { x: velocity.x, y: velocity.y, z: velocity.z };
    
    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3(0, 0, (keys.current.backward ? 1 : 0) - (keys.current.forward ? 1 : 0));
    const sideVector = new THREE.Vector3((keys.current.left ? 1 : 0) - (keys.current.right ? 1 : 0), 0, 0);

    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED * playerSpeedMultiplier);

    // Ground check
    const ray = new rapier.Ray(pos, { x: 0, y: -1, z: 0 });
    const hit = world.castRay(ray, 1.5, true);
    const isGrounded = hit && hit.toi < 1.1;

    // Inertia & Aerial Control
    const currentVelocity = new THREE.Vector3(vel.x, 0, vel.z);
    // Snappier on ground, slightly floatier in air but still highly controllable
    // Frame-rate independent lerp
    const controlFactor = isGrounded ? 1 - Math.exp(-25 * delta) : 1 - Math.exp(-5 * delta);
    currentVelocity.lerp(direction, controlFactor);
    bodyRef.current.setLinvel({ x: currentVelocity.x, y: vel.y, z: currentVelocity.z }, true);

    // Avatar rotation - tightly coupled to INPUT direction for responsiveness
    if (direction.lengthSq() > 0.1 && avatarRef.current) {
      const targetAngle = Math.atan2(direction.x, direction.z);
      const currentRotation = new THREE.Euler().setFromQuaternion(avatarRef.current.quaternion);
      
      // Smooth but fast rotation
      let diff = targetAngle - currentRotation.y;
      // Normalize diff to -PI to PI
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      
      avatarRef.current.rotation.y += diff * (1 - Math.exp(-15 * delta));
    }

    // Squash and stretch
    if (avatarRef.current) {
      const yVel = vel.y;
      if (!isGrounded) {
        // Stretching while falling/jumping
        const stretch = Math.max(0.8, Math.min(1.2, 1 + yVel * 0.05));
        avatarRef.current.scale.set(1 / stretch, stretch, 1 / stretch);
      } else {
        // Squashing when landing or running
        avatarRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 1 - Math.exp(-10 * delta));
      }
    }

    // Hovered block
    const col = Math.floor((pos.x + 10) / 2);
    const row = Math.floor((pos.z + 10) / 2);
    if (col >= 0 && col < 20 && row >= 0 && row < 20) {
      const index = row * 20 + col;
      useGameStore.getState().setHoveredBlock(index);
    } else {
      useGameStore.getState().setHoveredBlock(-1);
    }

    // Footstep sound
    if (isGrounded && currentVelocity.lengthSq() > 0.1) {
      footstepTimer.current += delta;
      if (footstepTimer.current > 0.25) {
        audio.playFootstepSound();
        footstepTimer.current = 0;
      }
    } else {
      footstepTimer.current = 0;
    }

    // Jump logic
    if (keys.current.jump && isGrounded) {
      bodyRef.current.setLinvel({ x: currentVelocity.x, y: JUMP_FORCE, z: currentVelocity.z }, true);
      audio.playJumpSound();
    } else if (!keys.current.jump && vel.y > 0 && !isGrounded) {
      // Variable jump height: cut upward velocity if jump button is released
      bodyRef.current.setLinvel({ x: currentVelocity.x, y: vel.y * 0.8, z: currentVelocity.z }, true);
    }

    // Camera follow with shake
    const idealPos = new THREE.Vector3(pos.x, pos.y + 10, pos.z + 15);
    if (gameState === 'elimination') {
      idealPos.x += (Math.random() - 0.5) * 0.5;
      idealPos.y += (Math.random() - 0.5) * 0.5;
      idealPos.z += (Math.random() - 0.5) * 0.5;
    }
    // Smooth frame-independent camera follow
    state.camera.position.lerp(idealPos, 1 - Math.exp(-15 * delta));
    state.camera.lookAt(pos.x, pos.y, pos.z);
  });

  return (
    <RigidBody ref={bodyRef} colliders={false} position={[0, 5, 0]} enabledRotations={[false, false, false]}>
      <CapsuleCollider args={[0.5, 0.5]} friction={0} />
      {/* Blocky Avatar */}
      <group ref={avatarRef} position={[0, -0.5, 0]}>
        {/* Head */}
        <group position={[0, 1.5, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.8, 0.8, 0.8]} />
            <meshStandardMaterial color="#FFD1A4" flatShading />
          </mesh>
          {/* Eyes */}
          <mesh position={[-0.2, 0.1, 0.41]}>
            <boxGeometry args={[0.1, 0.1, 0.05]} />
            <meshStandardMaterial color="#000" flatShading />
          </mesh>
          <mesh position={[0.2, 0.1, 0.41]}>
            <boxGeometry args={[0.1, 0.1, 0.05]} />
            <meshStandardMaterial color="#000" flatShading />
          </mesh>
          {/* Mouth */}
          <mesh position={[0, -0.2, 0.41]}>
            <boxGeometry args={[0.3, 0.1, 0.05]} />
            <meshStandardMaterial color="#000" flatShading />
          </mesh>
        </group>
        {/* Torso */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[1, 1, 0.5]} />
          <meshStandardMaterial color="#3498db" flatShading />
        </mesh>
        {/* Arms */}
        <mesh position={[-0.7, 0.6, 0]} castShadow>
          <boxGeometry args={[0.3, 1, 0.3]} />
          <meshStandardMaterial color="#FFD1A4" flatShading />
        </mesh>
        <mesh position={[0.7, 0.6, 0]} castShadow>
          <boxGeometry args={[0.3, 1, 0.3]} />
          <meshStandardMaterial color="#FFD1A4" flatShading />
        </mesh>
        {/* Legs */}
        <mesh position={[-0.25, -0.2, 0]} castShadow>
          <boxGeometry args={[0.4, 0.6, 0.4]} />
          <meshStandardMaterial color="#2c3e50" flatShading />
        </mesh>
        <mesh position={[0.25, -0.2, 0]} castShadow>
          <boxGeometry args={[0.4, 0.6, 0.4]} />
          <meshStandardMaterial color="#2c3e50" flatShading />
        </mesh>
      </group>
    </RigidBody>
  );
}
