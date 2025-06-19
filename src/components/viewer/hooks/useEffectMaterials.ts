
import { useMemo } from 'react';
import * as THREE from 'three';
import { MATERIAL_SETTINGS, CARD_CONSTANTS } from '../constants/cardRenderer';

export interface EffectMaterialData {
  material: THREE.Material;
  offset: number;
}

export const useEffectMaterials = (effectValues: Record<string, Record<string, any>>) => {
  // Memoize holographic material separately
  const holographicMaterial = useMemo(() => {
    if (effectValues.holographic?.intensity <= 0) return null;
    
    const intensity = effectValues.holographic.intensity / 100;
    return {
      material: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(1, 1, 1),
        metalness: MATERIAL_SETTINGS.HOLOGRAPHIC.BASE_METALNESS,
        roughness: MATERIAL_SETTINGS.HOLOGRAPHIC.BASE_ROUGHNESS,
        transmission: MATERIAL_SETTINGS.HOLOGRAPHIC.BASE_TRANSMISSION,
        opacity: intensity * 0.4,
        transparent: true,
        clearcoat: MATERIAL_SETTINGS.HOLOGRAPHIC.BASE_CLEARCOAT,
        clearcoatRoughness: 0.0,
        reflectivity: MATERIAL_SETTINGS.HOLOGRAPHIC.BASE_REFLECTIVITY,
        envMapIntensity: MATERIAL_SETTINGS.HOLOGRAPHIC.ENV_MAP_INTENSITY
      }),
      offset: CARD_CONSTANTS.EFFECT_LAYER_OFFSET
    };
  }, [effectValues.holographic?.intensity]);

  // Memoize chrome material separately
  const chromeMaterial = useMemo(() => {
    if (effectValues.chrome?.intensity <= 0) return null;
    
    const intensity = effectValues.chrome.intensity / 100;
    return {
      material: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(...MATERIAL_SETTINGS.CHROME.COLOR),
        metalness: MATERIAL_SETTINGS.CHROME.BASE_METALNESS,
        roughness: MATERIAL_SETTINGS.CHROME.BASE_ROUGHNESS,
        opacity: intensity * 0.6,
        transparent: true,
        clearcoat: MATERIAL_SETTINGS.CHROME.BASE_CLEARCOAT,
        clearcoatRoughness: 0.0,
        reflectivity: MATERIAL_SETTINGS.CHROME.BASE_REFLECTIVITY,
        envMapIntensity: MATERIAL_SETTINGS.CHROME.ENV_MAP_INTENSITY
      }),
      offset: CARD_CONSTANTS.EFFECT_LAYER_OFFSET * 2
    };
  }, [effectValues.chrome?.intensity]);

  // Memoize gold material separately
  const goldMaterial = useMemo(() => {
    if (effectValues.gold?.intensity <= 0) return null;
    
    const intensity = effectValues.gold.intensity / 100;
    return {
      material: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(...MATERIAL_SETTINGS.GOLD.COLOR),
        metalness: MATERIAL_SETTINGS.GOLD.BASE_METALNESS,
        roughness: MATERIAL_SETTINGS.GOLD.BASE_ROUGHNESS,
        opacity: intensity * 0.7,
        transparent: true,
        clearcoat: MATERIAL_SETTINGS.GOLD.BASE_CLEARCOAT,
        clearcoatRoughness: 0.1,
        reflectivity: MATERIAL_SETTINGS.GOLD.BASE_REFLECTIVITY,
        envMapIntensity: MATERIAL_SETTINGS.GOLD.ENV_MAP_INTENSITY
      }),
      offset: CARD_CONSTANTS.EFFECT_LAYER_OFFSET * 3
    };
  }, [effectValues.gold?.intensity]);

  // Memoize crystal material separately
  const crystalMaterial = useMemo(() => {
    if (effectValues.crystal?.intensity <= 0) return null;
    
    const intensity = effectValues.crystal.intensity / 100;
    return {
      material: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(...MATERIAL_SETTINGS.CRYSTAL.COLOR),
        metalness: MATERIAL_SETTINGS.CRYSTAL.BASE_METALNESS,
        roughness: MATERIAL_SETTINGS.CRYSTAL.BASE_ROUGHNESS,
        transmission: MATERIAL_SETTINGS.CRYSTAL.BASE_TRANSMISSION,
        opacity: intensity * 0.3,
        transparent: true,
        clearcoat: MATERIAL_SETTINGS.CRYSTAL.BASE_CLEARCOAT,
        clearcoatRoughness: 0.0,
        reflectivity: MATERIAL_SETTINGS.CRYSTAL.BASE_REFLECTIVITY,
        envMapIntensity: MATERIAL_SETTINGS.CRYSTAL.ENV_MAP_INTENSITY
      }),
      offset: CARD_CONSTANTS.EFFECT_LAYER_OFFSET * 4
    };
  }, [effectValues.crystal?.intensity]);

  // Combine all active materials
  return useMemo(() => {
    const materials: EffectMaterialData[] = [];
    
    if (holographicMaterial) materials.push(holographicMaterial);
    if (chromeMaterial) materials.push(chromeMaterial);
    if (goldMaterial) materials.push(goldMaterial);
    if (crystalMaterial) materials.push(crystalMaterial);
    
    return materials;
  }, [holographicMaterial, chromeMaterial, goldMaterial, crystalMaterial]);
};
