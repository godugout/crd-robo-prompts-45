
import React from 'react';
import { Text, RoundedBox } from '@react-three/drei';

interface GradingLabelsProps {
  cardName: string;
  overallGrade: number;
  centeringGrade: number;
  cornersGrade: number;
  edgesGrade: number;
  surfaceGrade: number;
}

export const GradingLabels: React.FC<GradingLabelsProps> = ({
  cardName,
  overallGrade,
  centeringGrade,
  cornersGrade,
  edgesGrade,
  surfaceGrade
}) => {
  return (
    <>
      {/* Grading Label - Top */}
      <group position={[0, 1.8, 0.16]}>
        <RoundedBox args={[2.6, 0.4, 0.02]} radius={0.02}>
          <meshPhysicalMaterial
            color="#1f2937"
            roughness={0.2}
            metalness={0.1}
          />
        </RoundedBox>
        
        {/* Grade Number */}
        <Text
          position={[0, 0, 0.02]}
          fontSize={0.15}
          color="#10b981"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
        >
          {overallGrade}
        </Text>
        
        {/* CRD Text */}
        <Text
          position={[-0.8, 0, 0.02]}
          fontSize={0.08}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          CRD
        </Text>
        
        {/* Authenticated Text */}
        <Text
          position={[0.8, 0, 0.02]}
          fontSize={0.06}
          color="#9ca3af"
          anchorX="center"
          anchorY="middle"
        >
          AUTH
        </Text>
      </group>

      {/* Card Name Label */}
      <group position={[0, -1.6, 0.16]}>
        <RoundedBox args={[2.6, 0.3, 0.02]} radius={0.02}>
          <meshPhysicalMaterial
            color="#374151"
            roughness={0.2}
            metalness={0.1}
          />
        </RoundedBox>
        
        <Text
          position={[0, 0, 0.02]}
          fontSize={0.08}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.4}
        >
          {cardName}
        </Text>
      </group>

      {/* Grade Breakdown - Bottom */}
      <group position={[0, -1.9, 0.16]}>
        <Text
          position={[-0.8, 0, 0.01]}
          fontSize={0.05}
          color="#9ca3af"
          anchorX="center"
          anchorY="middle"
        >
          CEN {centeringGrade}
        </Text>
        
        <Text
          position={[-0.3, 0, 0.01]}
          fontSize={0.05}
          color="#9ca3af"
          anchorX="center"
          anchorY="middle"
        >
          COR {cornersGrade}
        </Text>
        
        <Text
          position={[0.2, 0, 0.01]}
          fontSize={0.05}
          color="#9ca3af"
          anchorX="center"
          anchorY="middle"
        >
          EDG {edgesGrade}
        </Text>
        
        <Text
          position={[0.7, 0, 0.01]}
          fontSize={0.05}
          color="#9ca3af"
          anchorX="center"
          anchorY="middle"
        >
          SUR {surfaceGrade}
        </Text>
      </group>
    </>
  );
};
