import { useRef, useEffect, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, Text, useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface NetworkPlayerProps {
  id: string;
  name: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  isEliminated?: boolean;
  skinId?: string;
}

export function NetworkPlayer({ id, name, position, rotation, isEliminated, skinId }: NetworkPlayerProps) {
  const group = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  
  // Create a ThreeJS Vector3 interpolation target to smooth movement
  const targetPosition = useRef(new THREE.Vector3(...position));
  const hasInitialized = useRef(false);
  
  // Track falling state for elimination animation
  const isFalling = useRef(false);
  const fallVelocity = useRef(0);
  const walkTime = useRef(0);

  useEffect(() => {
    if (position) {
      targetPosition.current.set(position[0], position[1], position[2]);
      
      // If we haven't initialized yet, or if it's a huge jump (teleport), snap immediately
      if (!hasInitialized.current || group.current?.position.distanceTo(targetPosition.current) > 5) {
        if (group.current) {
          group.current.position.copy(targetPosition.current);
        }
        hasInitialized.current = true;
      }
    }
  }, [position]);

  const { scene } = useGLTF(import.meta.env.BASE_URL + 'asset3d/character1.glb');
  const textures = useTexture({
    default: import.meta.env.BASE_URL + 'texture/zioperanza__DefaultMaterial_BaseColor.png',
    israel: import.meta.env.BASE_URL + 'skins/israel_skin.png',
    robsbagliato: import.meta.env.BASE_URL + 'texture/robsbagliato.png',
  });

  const [currentSkin, setCurrentSkin] = (useState as any)(skinId || 'default_skin');

  const clone = useMemo(() => {
    const c = scene.clone();
    c.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        const mat = new THREE.MeshStandardMaterial();
        node.material = mat;
        
        if (currentSkin === 'skin_special_israel') {
          mat.map = textures.israel;
          textures.israel.flipY = false;
        } else if (currentSkin === 'skin_robsbagliato') {
          mat.map = textures.robsbagliato;
          textures.robsbagliato.flipY = false;
        } else if (currentSkin === 'skin_epic') {
          mat.color.set('#ffd700');
          mat.metalness = 0.8;
          mat.roughness = 0.1;
        } else if (currentSkin === 'skin_solid') {
          mat.color.set('#4cc9f0');
        } else if (currentSkin === 'skin_pattern') {
          mat.color.set('#3a0ca3');
        } else if (currentSkin === 'skin_legendary') {
          mat.color.set('#ffffff');
        } else {
          mat.map = textures.default;
          textures.default.flipY = false;
        }
        mat.needsUpdate = true;
      }
    });
    return c;
  }, [scene, textures, currentSkin]);

  useFrame((state, delta) => {
    if (!group.current) return;

    if (isEliminated) {
        if (!isFalling.current) {
            isFalling.current = true;
        }
        fallVelocity.current += 9.8 * delta * 2;
        group.current.position.y -= fallVelocity.current * delta;
        group.current.rotation.x += delta;
        group.current.rotation.z += delta * 0.5;
        return;
    }

    // Optimized: Read from non-reactive buffer
    const buffer = (window as any).remotePlayerBuffer;
    if (buffer && buffer[id]) {
      const b = buffer[id];
      targetPosition.current.set(b.position[0], b.position[1], b.position[2]);
      
      if (b.skinId && b.skinId !== currentSkin) {
        setCurrentSkin(b.skinId);
      }

      const euler = new THREE.Euler(b.rotation[0], b.rotation[1], b.rotation[2], 'XYZ');
      const targetQuat = new THREE.Quaternion().setFromEuler(euler);
      group.current.quaternion.slerp(targetQuat, 1 - Math.exp(-15 * delta));
    }

    // Rainbow effect for Legendary Skin
    if (currentSkin === 'skin_legendary') {
      const hue = (state.clock.elapsedTime * 0.5) % 1;
      const rainbowColor = new THREE.Color().setHSL(hue, 0.8, 0.5);
      clone.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          (node.material as THREE.MeshStandardMaterial).color.copy(rainbowColor);
        }
      });
    }

    const lerpFactor = 1 - Math.exp(-12 * delta);
    const previousPos = group.current.position.clone();
    group.current.position.lerp(targetPosition.current, lerpFactor);
    
    const distanceMoved = previousPos.distanceTo(group.current.position);
    if (distanceMoved > 0.05) {
      walkTime.current += delta * (distanceMoved / delta) * 0.5;
      const legSwing = Math.sin(walkTime.current) * 0.6;
      const armSwing = Math.sin(walkTime.current) * 0.5;
      
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
  });

  return (
    <group ref={group}>
      {/* Name Tag */}
      {(!isEliminated || group.current?.position.y > -5) && (
        <Billboard position={[0, 2.5, 0]}>
          <Text fontSize={0.4} color="white" outlineWidth={0.05} outlineColor="black" fontWeight="bold">
            {name}
          </Text>
        </Billboard>
      )}

      {/* 3D Model Avatar for Network Players */}
      <group position={[0, -0.9, 0]}>
        <primitive object={clone} />
      </group>
    </group>
  );
}
