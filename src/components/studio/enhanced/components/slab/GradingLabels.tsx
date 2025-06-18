
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
    <group>
      {/* Top Grading Header Label */}
      <group position={[0, 2.4, 0.185]}>
        <RoundedBox args={[3.4, 0.5, 0.025]} radius={0.025} castShadow>
          <meshPhysicalMaterial
            color="#1a1a1a"
            roughness={0.15}
            metalness={0.05}
            clearcoat={0.3}
          />
        </RoundedBox>
        
        {/* CRD Logo Area */}
        <Text
          position={[-1.2, 0.08, 0.015]}
          fontSize={0.12}
          color="#10b981"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.googleapis.com/css2?family=Inter:wght@900&display=swap"
          fontWeight={900}
        >
          CRD
        </Text>
        
        {/* Grade Score */}
        <Text
          position={[0, 0.05, 0.015]}
          fontSize={0.22}
          color="#10b981"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap"
          fontWeight={700}
        >
          {overallGrade}
        </Text>
        
        {/* Authentication Badge */}
        <Text
          position={[1.2, 0.08, 0.015]}
          fontSize={0.08}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.googleapis.com/css2?family=Inter:wght@600&display=swap"
          fontWeight={600}
        >
          AUTHENTICATED
        </Text>
        
        {/* Subtitle */}
        <Text
          position={[0, -0.12, 0.015]}
          fontSize={0.06}
          color="#9ca3af"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.googleapis.com/css2?family=Inter:wght@500&display=swap"
        >
          CARD RATING DIVISION
        </Text>
      </group>

      {/* Card Name Label */}
      <group position={[0, -2.0, 0.185]}>
        <RoundedBox args={[3.4, 0.4, 0.025]} radius={0.025} castShadow>
          <meshPhysicalMaterial
            color="#2d3748"
            roughness={0.2}
            metalness={0.1}
            clearcoat={0.2}
          />
        </RoundedBox>
        
        <Text
          position={[0, 0, 0.015]}
          fontSize={0.1}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={3.2}
          font="https://fonts.googleapis.com/css2?family=Inter:wght@600&display=swap"
          fontWeight={600}
        >
          {cardName.toUpperCase()}
        </Text>
      </group>

      {/* Grade Breakdown - Bottom */}
      <group position={[0, -2.55, 0.185]}>
        <Text
          position={[-1.2, 0, 0.01]}
          fontSize={0.07}
          color="#9ca3af"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.googleapis.com/css2?family=Inter:wght@500&display=swap"
        >
          CEN {centeringGrade}
        </Text>
        
        <Text
          position={[-0.4, 0, 0.01]}
          fontSize={0.07}
          color="#9ca3af"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.googleapis.com/css2?family=Inter:wght@500&display=swap"
        >
          COR {cornersGrade}
        </Text>
        
        <Text
          position={[0.4, 0, 0.01]}
          fontSize={0.07}
          color="#9ca3af"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.googleapis.com/css2?family=Inter:wght@500&display=swap"
        >
          EDG {edgesGrade}
        </Text>
        
        <Text
          position={[1.2, 0, 0.01]}
          fontSize={0.07}
          color="#9ca3af"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.googleapis.com/css2?family=Inter:wght@500&display=swap"
        >
          SUR {surfaceGrade}
        </Text>
      </group>

      {/* Serial Number */}
      <group position={[0, -2.8, 0.185]}>
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.05}
          color="#6b7280"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400&display=swap"
        >
          SN: CRD-{new Date().getFullYear()}-{String(Math.floor(Math.random() * 10000)).padStart(4, '0')}
        </Text>
      </group>
    </group>
  );
};
