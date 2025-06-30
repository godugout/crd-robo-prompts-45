
import React, { useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';

interface EnvironmentalEffectMapperProps {
  onEnvironmentUpdate: (data: any) => void;
  weatherEffects: boolean;
  lightingEffects: boolean;
}

export const EnvironmentalEffectMapper: React.FC<EnvironmentalEffectMapperProps> = ({
  onEnvironmentUpdate,
  weatherEffects,
  lightingEffects
}) => {
  const [ambientLight, setAmbientLight] = useState(0.6);
  const [weatherCondition, setWeatherCondition] = useState('clear');
  const [temperature, setTemperature] = useState(22);

  useEffect(() => {
    // Simulate weather API integration
    const fetchWeatherData = async () => {
      try {
        // In a real implementation, this would be an actual weather API call
        const mockWeatherData = {
          weather: ['clear', 'rain', 'snow', 'sunny'][Math.floor(Math.random() * 4)],
          temperature: Math.floor(Math.random() * 30) + 5,
          humidity: Math.floor(Math.random() * 60) + 30,
          lighting: calculateLightingCondition()
        };

        setWeatherCondition(mockWeatherData.weather);
        setTemperature(mockWeatherData.temperature);
        
        onEnvironmentUpdate(mockWeatherData);
      } catch (error) {
        console.warn('Weather data fetch failed:', error);
      }
    };

    if (weatherEffects) {
      fetchWeatherData();
      // Update every 5 minutes
      const interval = setInterval(fetchWeatherData, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [weatherEffects, onEnvironmentUpdate]);

  const calculateLightingCondition = () => {
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 8) return 'dawn';
    if (hour >= 8 && hour < 17) return 'daylight';
    if (hour >= 17 && hour < 19) return 'dusk';
    if (hour >= 19 || hour < 6) return 'night';
    
    return 'daylight';
  };

  useFrame((state) => {
    if (lightingEffects) {
      const time = state.clock.getElapsedTime();
      const lightingCondition = calculateLightingCondition();
      
      // Adjust ambient light based on time of day
      let targetAmbientLight = 0.6;
      
      switch (lightingCondition) {
        case 'dawn':
        case 'dusk':
          targetAmbientLight = 0.4 + Math.sin(time * 0.5) * 0.1;
          break;
        case 'daylight':
          targetAmbientLight = 0.8 + Math.sin(time * 0.2) * 0.1;
          break;
        case 'night':
          targetAmbientLight = 0.2 + Math.sin(time * 0.3) * 0.05;
          break;
      }
      
      // Smooth transition
      setAmbientLight(prev => prev + (targetAmbientLight - prev) * 0.01);
    }
  });

  return (
    <group>
      {lightingEffects && (
        <>
          <ambientLight intensity={ambientLight} />
          
          {/* Weather-specific lighting */}
          {weatherCondition === 'rain' && (
            <pointLight 
              position={[0, 5, 0]} 
              color="#4a90e2" 
              intensity={0.3} 
              distance={10} 
            />
          )}
          
          {weatherCondition === 'snow' && (
            <directionalLight 
              position={[5, 10, 5]} 
              color="#e6f3ff" 
              intensity={0.7} 
              castShadow 
            />
          )}
          
          {weatherCondition === 'sunny' && (
            <directionalLight 
              position={[10, 10, 5]} 
              color="#ffebcd" 
              intensity={1.2} 
              castShadow 
            />
          )}
        </>
      )}
    </group>
  );
};
