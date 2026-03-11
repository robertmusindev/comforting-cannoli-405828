import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';

interface NetworkPlayerProps {
  id: string;
  name: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  isEliminated?: boolean;
}

export function NetworkPlayer({ name, position, rotation, isEliminated }: NetworkPlayerProps) {
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
      
      const euler = new THREE.Euler(b.rotation[0], b.rotation[1], b.rotation[2], 'XYZ');
      const targetQuat = new THREE.Quaternion().setFromEuler(euler);
      group.current.quaternion.slerp(targetQuat, 1 - Math.exp(-15 * delta));
    }

    const lerpFactor = 1 - Math.exp(-12 * delta);
    const previousPos = group.current.position.clone();
    group.current.position.lerp(targetPosition.current, lerpFactor);
    
    const distanceMoved = previousPos.distanceTo(group.current.position);
    if (distanceMoved > 0.05) {
      walkTime.current += delta * (distanceMoved / delta) * 0.5;
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

      {/* Basic Roblox-style geometric avatar representation for Network Players */}
      <group position={[0, -0.5, 0]}>
        {/* Head */}
        <Box args={[0.6, 0.6, 0.6]} position={[0, 1.5, 0]} castShadow>
          <meshStandardMaterial color="#FFD1BA" />
        </Box>
        {/* Torso */}
        <Box args={[0.8, 0.8, 0.4]} position={[0, 0.6, 0]} castShadow>
          <meshStandardMaterial color="#3B82F6" /> {/* Blue shirt */}
        </Box>
        {/* Arms - Pivot from shoulder */}
        <group position={[-0.7, 0.9, 0]}>
          <Box ref={leftArmRef} args={[0.3, 1, 0.3]} position={[0, -0.3, 0]} castShadow>
            <meshStandardMaterial color="#FFD1BA" />
          </Box>
        </group>
        <group position={[0.7, 0.9, 0]}>
          <Box ref={rightArmRef} args={[0.3, 1, 0.3]} position={[0, -0.3, 0]} castShadow>
            <meshStandardMaterial color="#FFD1BA" />
          </Box>
        </group>
        {/* Legs - Pivot from hip */}
        <group position={[-0.25, 0.1, 0]}>
          <Box ref={leftLegRef} args={[0.4, 0.6, 0.4]} position={[0, -0.3, 0]} castShadow>
            <meshStandardMaterial color="#1E3A8A" />
          </Box>
        </group>
        <group position={[0.25, 0.1, 0]}>
          <Box ref={rightLegRef} args={[0.4, 0.6, 0.4]} position={[0, -0.3, 0]} castShadow>
            <meshStandardMaterial color="#1E3A8A" />
          </Box>
        </group>
      </group>
    </group>
  );
}
