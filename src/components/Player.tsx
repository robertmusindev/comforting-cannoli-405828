import { useFrame } from '@react-three/fiber';
import { Billboard, Text, useGLTF, useTexture } from '@react-three/drei';
import { RigidBody, CapsuleCollider, useRapier } from '@react-three/rapier';
import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useGameStore } from '../store';
import { useProfileStore } from '../store/profile';
import { useMultiplayerStore } from '../store/multiplayer';
import { audio } from '../utils/audio';

const SPEED = 12;
const JUMP_FORCE = 8;

// Optimization: Pre-allocate objects for useFrame inside module scope to prevent Garbage Collection stutters
const _direction = new THREE.Vector3();
const _frontVector = new THREE.Vector3();
const _sideVector = new THREE.Vector3();
const _currentVelocity = new THREE.Vector3();
const _targetQuaternion = new THREE.Quaternion();
const _upVector = new THREE.Vector3(0, 1, 0);
const _idealPos = new THREE.Vector3();
const _scaleVector = new THREE.Vector3();

export function Player() {
  const bodyRef = useRef<any>(null);
  const avatarRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const footstepTimer = useRef(0);
  const walkTime = useRef(0);
  const networkSyncTimer = useRef(0);
  
  // Use ref instead of useState to prevent continuous re-rendering
  const keys = useRef({ forward: false, backward: false, left: false, right: false, jump: false, jumpHandled: false });
  
  const { rapier, world } = useRapier();
  const playerDied = useGameStore(state => state.playerDied);
  const playerSpeedMultiplier = useGameStore(state => state.playerSpeedMultiplier);
  const gameState = useGameStore(state => state.gameState);
  const username = useGameStore(state => state.username) || 'Guest';
  
  const lobbyId = useMultiplayerStore(state => state.lobbyId);
  const broadcastMovement = useMultiplayerStore(state => state.broadcastMovement);
  const equippedSkin = useProfileStore(state => state.profile?.equipped_skin || 'default_skin');

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
        case 'Space': 
          keys.current.jump = false; 
          keys.current.jumpHandled = false; // Reset ability to jump when key is released
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const { scene } = useGLTF(import.meta.env.BASE_URL + 'asset3d/character1.glb');
  const textures = useTexture({
    default: import.meta.env.BASE_URL + 'texture/zioperanza__DefaultMaterial_BaseColor.png',
    israel: import.meta.env.BASE_URL + 'skins/israel_skin.png',
    robsbagliato: import.meta.env.BASE_URL + 'texture/robsbagliato.png',
  });
  
  const clone = useMemo(() => {
    const c = scene.clone();
    c.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        const mat = new THREE.MeshStandardMaterial();
        node.material = mat;
        
        if (equippedSkin === 'skin_special_israel') {
          mat.map = textures.israel;
          textures.israel.flipY = false;
        } else if (equippedSkin === 'skin_robsbagliato') {
          mat.map = textures.robsbagliato;
          textures.robsbagliato.flipY = false;
        } else if (equippedSkin === 'skin_epic') {
          mat.color.set('#ffd700');
          mat.metalness = 0.8;
          mat.roughness = 0.1;
        } else if (equippedSkin === 'skin_solid') {
          mat.color.set('#4cc9f0');
        } else if (equippedSkin === 'skin_pattern') {
          mat.color.set('#3a0ca3');
        } else if (equippedSkin === 'skin_legendary') {
          mat.color.set('#ffffff');
        } else {
          mat.map = textures.default;
          textures.default.flipY = false;
        }
        mat.needsUpdate = true;
      }
    });
    return c;
  }, [scene, textures, equippedSkin]);

  useFrame((state, delta) => {
    if (!bodyRef.current) return;

    const position = bodyRef.current.translation();
    const pos = { x: position.x, y: position.y, z: position.z };
    
    // Broadcast movement to network at ~15fps (every 0.066s)
    if (lobbyId && avatarRef.current) {
      networkSyncTimer.current += delta;
      if (networkSyncTimer.current > 0.066) {
         const avatarRot = avatarRef.current.rotation;
         broadcastMovement([pos.x, pos.y, pos.z], [avatarRot.x, avatarRot.y, avatarRot.z], equippedSkin);
         networkSyncTimer.current = 0;
      }
    }

    if (pos.y < -10) {
      playerDied();
      return;
    }

    const velocity = bodyRef.current.linvel();
    const vel = { x: velocity.x, y: velocity.y, z: velocity.z };
    
    _frontVector.set(0, 0, (keys.current.backward ? 1 : 0) - (keys.current.forward ? 1 : 0));
    _sideVector.set((keys.current.left ? 1 : 0) - (keys.current.right ? 1 : 0), 0, 0);

    _direction.subVectors(_frontVector, _sideVector).normalize().multiplyScalar(SPEED * playerSpeedMultiplier);

    // Ground check based on capsule center height (center is at y=1 when feet are at y=0)
    const isGrounded = pos.y <= 1.2 && Math.abs(vel.y) < 2.0;

    // Inertia & Aerial Control
    _currentVelocity.set(vel.x, 0, vel.z);
    
    // Snappier on ground, slightly floatier in air but still highly controllable
    // Frame-rate independent lerp
    const controlFactor = isGrounded ? 1 - Math.exp(-25 * delta) : 1 - Math.exp(-5 * delta);
    _currentVelocity.lerp(_direction, controlFactor);
    bodyRef.current.setLinvel({ x: _currentVelocity.x, y: vel.y, z: _currentVelocity.z }, true);

    // Avatar rotation - tightly coupled to INPUT direction for responsiveness
    if (_direction.lengthSq() > 0.1 && avatarRef.current) {
      const targetAngle = Math.atan2(_direction.x, _direction.z) + Math.PI;
      _targetQuaternion.setFromAxisAngle(_upVector, targetAngle);
      avatarRef.current.quaternion.slerp(_targetQuaternion, 1 - Math.exp(-15 * delta));
    }

    // Squash and stretch
    if (avatarRef.current) {
      const yVel = vel.y;
      if (!isGrounded) {
        // Stretching while falling/jumping
        // Più salti veloce, più ti allunghi verticalmente e ti stringi orizzontalmente
        const stretch = Math.max(0.7, Math.min(1.3, 1 + yVel * 0.04));
        const squash = 1 / Math.sqrt(stretch);
        _scaleVector.set(squash, stretch, squash);
        avatarRef.current.scale.lerp(_scaleVector, 1 - Math.exp(-20 * delta));
      } else {
        // Squashing when landing or running
        _scaleVector.set(1, 1, 1);
        avatarRef.current.scale.lerp(_scaleVector, 1 - Math.exp(-15 * delta));
      }
    }

    // Rainbow effect for Legendary Skin
    if (equippedSkin === 'skin_legendary') {
      const hue = (state.clock.elapsedTime * 0.5) % 1;
      const rainbowColor = new THREE.Color().setHSL(hue, 0.8, 0.5);
      clone.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          (node.material as THREE.MeshStandardMaterial).color.copy(rainbowColor);
        }
      });
    }

    // Procedural Walking Animation - Mapping to GLB structure if possible
    // Note: We search for nodes that match common names or just apply to specific parts if found
    const speed = _currentVelocity.length();
    if (isGrounded && speed > 0.5) {
      walkTime.current += delta * speed * 1.5;
      const legSwing = Math.sin(walkTime.current) * 0.6;
      const armSwing = Math.sin(walkTime.current) * 0.5;

      // Basic procedural animation for unknown GLB nodes by searching
      clone.traverse((node) => {
        if (node instanceof THREE.Mesh || node instanceof THREE.Group) {
          if (node.name.toLowerCase().includes('leg') || node.name.toLowerCase().includes('foot')) {
            node.rotation.x = node.name.toLowerCase().includes('left') ? -legSwing : legSwing;
          }
          if (node.name.toLowerCase().includes('arm') || node.name.toLowerCase().includes('hand')) {
            node.rotation.x = node.name.toLowerCase().includes('left') ? armSwing : -armSwing;
          }
        }
      });
    } else {
      clone.traverse((node) => {
        if (node instanceof THREE.Mesh || node instanceof THREE.Group) {
          if (node.name.toLowerCase().includes('leg') || node.name.toLowerCase().includes('arm') || 
              node.name.toLowerCase().includes('foot') || node.name.toLowerCase().includes('hand')) {
            node.rotation.x = THREE.MathUtils.lerp(node.rotation.x, 0, 1 - Math.exp(-15 * delta));
          }
        }
      });
      walkTime.current = 0;
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
    if (isGrounded && _currentVelocity.lengthSq() > 0.1) {
      footstepTimer.current += delta;
      if (footstepTimer.current > 0.25) {
        audio.playFootstepSound();
        footstepTimer.current = 0;
      }
    } else {
      footstepTimer.current = 0;
    }

    // Jump logic - Single jump enforcement
    if (keys.current.jump && isGrounded && vel.y <= 0.1 && !keys.current.jumpHandled) {
      bodyRef.current.setLinvel({ x: _currentVelocity.x, y: JUMP_FORCE, z: _currentVelocity.z }, true);
      audio.playJumpSound();
      
      // Squash before jump (visual flair only)
      if (avatarRef.current) {
        avatarRef.current.scale.set(1.4, 0.6, 1.4);
      }

      keys.current.jumpHandled = true; // Mark jump as handled so holding space doesn't fly
    } else if (!keys.current.jump && vel.y > 0 && !isGrounded) {
      // Variable jump height: cut upward velocity if jump button is released
      bodyRef.current.setLinvel({ x: _currentVelocity.x, y: vel.y * 0.8, z: _currentVelocity.z }, true);
    }

    // Camera follow with shake
    _idealPos.set(pos.x, pos.y + 10, pos.z + 15);
    if (gameState === 'elimination') {
      _idealPos.x += (Math.random() - 0.5) * 0.5;
      _idealPos.y += (Math.random() - 0.5) * 0.5;
      _idealPos.z += (Math.random() - 0.5) * 0.5;
    }
    // Smooth frame-independent camera follow
    state.camera.position.lerp(_idealPos, 1 - Math.exp(-15 * delta));
    state.camera.lookAt(pos.x, pos.y, pos.z);
  });

  return (
    <RigidBody ref={bodyRef} ccd={true} colliders={false} position={[1, 5, 1]} enabledRotations={[false, false, false]}>
      <CapsuleCollider args={[0.5, 0.5]} friction={0} />
      {/* 3D Model Avatar */}
      <group ref={avatarRef} position={[0, -0.9, 0]}>
        <primitive object={clone} />
      </group>
      {/* Name Tag */}
      <Billboard position={[0, 2.8, 0]}>
        <Text fontSize={0.4} color="white" outlineWidth={0.05} outlineColor="black" fontWeight="bold">
          {username}
        </Text>
      </Billboard>
    </RigidBody>
  );
}
