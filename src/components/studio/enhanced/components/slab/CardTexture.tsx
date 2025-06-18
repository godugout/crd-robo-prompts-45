
import React from 'react';
import * as THREE from 'three';

interface CardTextureProps {
  imageUrl: string;
}

export const CardTexture: React.FC<CardTextureProps> = ({ imageUrl }) => {
  const texture = new THREE.TextureLoader().load(imageUrl);
  texture.flipY = false;
  return <meshStandardMaterial map={texture} />;
};
