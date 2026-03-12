import { useGLTF, useTexture } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface SkinPreviewProps {
  skinId: string;
}

export function SkinPreview({ skinId }: SkinPreviewProps) {
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
        
        if (skinId === 'skin_special_israel') {
          mat.map = textures.israel;
          textures.israel.flipY = false;
        } else if (skinId === 'skin_robsbagliato') {
          mat.map = textures.robsbagliato;
          textures.robsbagliato.flipY = false;
        } else if (skinId === 'skin_epic') {
          mat.color.set('#ffd700');
          mat.metalness = 0.8;
          mat.roughness = 0.1;
        } else if (skinId === 'skin_solid') {
          mat.color.set('#4cc9f0');
        } else if (skinId === 'skin_pattern') {
          mat.color.set('#3a0ca3');
        } else if (skinId === 'skin_legendary') {
          mat.color.set('#ffffff');
        } else {
          mat.map = textures.default;
          textures.default.flipY = false;
        }
        mat.needsUpdate = true;
      }
    });
    return c;
  }, [scene, textures, skinId]);

  useFrame((state) => {
    if (skinId === 'skin_legendary') {
      const hue = (state.clock.elapsedTime * 0.5) % 1;
      const rainbowColor = new THREE.Color().setHSL(hue, 0.8, 0.5);
      clone.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          (node.material as THREE.MeshStandardMaterial).color.copy(rainbowColor);
        }
      });
    }
  });

  return (
    <group rotation={[0, Math.PI, 0]} position={[0, -1, 0]}>
      <primitive object={clone} />
    </group>
  );
}

useGLTF.preload(import.meta.env.BASE_URL + 'asset3d/character1.glb');
