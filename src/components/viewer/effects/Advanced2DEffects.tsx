import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

interface Advanced2DEffectsProps {
  effectValues: Record<string, any>;
  mousePosition: { x: number; y: number };
  quality: 'low' | 'medium' | 'high' | 'ultra';
}

export const Advanced2DEffects: React.FC<Advanced2DEffectsProps> = ({
  effectValues,
  mousePosition,
  quality
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Generate photorealistic interference patterns
  const createInterferencePattern = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    const time = Date.now() * 0.001;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        
        // Simulate thin-film interference
        const thickness = 0.5 + Math.sin(x * 0.1 + time) * 0.3;
        const viewAngle = Math.atan2(y - height/2, x - width/2);
        
        // Calculate optical path difference
        const pathDiff = 2 * thickness * Math.cos(viewAngle);
        
        // Convert to wavelength (380-750 nm)
        const wavelength = 380 + (pathDiff * 200) % 370;
        
        // Convert wavelength to RGB
        let r = 0, g = 0, b = 0;
        
        if (wavelength >= 380 && wavelength < 440) {
          r = -(wavelength - 440) / (440 - 380);
          b = 1.0;
        } else if (wavelength >= 440 && wavelength < 490) {
          g = (wavelength - 440) / (490 - 440);
          b = 1.0;
        } else if (wavelength >= 490 && wavelength < 510) {
          g = 1.0;
          b = -(wavelength - 510) / (510 - 490);
        } else if (wavelength >= 510 && wavelength < 580) {
          r = (wavelength - 510) / (580 - 510);
          g = 1.0;
        } else if (wavelength >= 580 && wavelength < 645) {
          r = 1.0;
          g = -(wavelength - 645) / (645 - 580);
        } else if (wavelength >= 645 && wavelength <= 750) {
          r = 1.0;
        }
        
        data[i] = r * 255;
        data[i + 1] = g * 255;
        data[i + 2] = b * 255;
        data[i + 3] = 128; // Semi-transparent
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  };
  
  // Real-time material simulation
  const materialEffects = useMemo(() => {
    const holographicIntensity = effectValues?.holographic?.intensity || 0;
    const metallicIntensity = effectValues?.metallic?.intensity || 0;
    const galaxyIntensity = effectValues?.galaxy?.intensity || 0;
    
    const effects = [];
    
    // Photorealistic Holographic Effect
    if (holographicIntensity > 0) {
      const intensity = holographicIntensity / 100;
      const mouseX = mousePosition.x * 100;
      const mouseY = mousePosition.y * 100;
      
      effects.push(
        <div
          key="holographic-base"
          className="absolute inset-0"
          style={{
            background: `
              conic-gradient(
                from ${mouseX * 3.6}deg at ${50 + mouseX * 0.2}% ${50 + mouseY * 0.2}%,
                hsl(${(mouseX + mouseY) % 360}, 70%, 60%) 0deg,
                hsl(${(mouseX + mouseY + 60) % 360}, 80%, 55%) 30deg,
                hsl(${(mouseX + mouseY + 120) % 360}, 75%, 65%) 60deg,
                hsl(${(mouseX + mouseY + 180) % 360}, 85%, 50%) 90deg,
                hsl(${(mouseX + mouseY + 240) % 360}, 70%, 60%) 120deg,
                hsl(${(mouseX + mouseY + 300) % 360}, 80%, 55%) 150deg,
                hsl(${(mouseX + mouseY) % 360}, 70%, 60%) 180deg,
                hsl(${(mouseX + mouseY + 60) % 360}, 75%, 65%) 210deg,
                hsl(${(mouseX + mouseY + 120) % 360}, 80%, 55%) 240deg,
                hsl(${(mouseX + mouseY + 180) % 360}, 70%, 60%) 270deg,
                hsl(${(mouseX + mouseY + 240) % 360}, 85%, 50%) 300deg,
                hsl(${(mouseX + mouseY + 300) % 360}, 75%, 65%) 330deg,
                hsl(${(mouseX + mouseY) % 360}, 70%, 60%) 360deg
              )
            `,
            opacity: intensity * 0.6,
            mixBlendMode: 'color-dodge',
            filter: `blur(${(1 - intensity) * 2}px) contrast(${1 + intensity * 0.5})`
          }}
        />
      );
      
      // Interference pattern overlay
      effects.push(
        <div
          key="interference-pattern"
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(
                circle at ${30 + mouseX * 0.4}% ${30 + mouseY * 0.4}%,
                transparent 0%,
                rgba(255, 255, 255, ${intensity * 0.3}) 5%,
                transparent 10%,
                rgba(255, 255, 255, ${intensity * 0.2}) 15%,
                transparent 20%,
                rgba(255, 255, 255, ${intensity * 0.25}) 25%,
                transparent 30%
              ),
              radial-gradient(
                circle at ${70 + mouseX * 0.3}% ${70 + mouseY * 0.3}%,
                transparent 0%,
                rgba(255, 255, 255, ${intensity * 0.2}) 8%,
                transparent 16%,
                rgba(255, 255, 255, ${intensity * 0.15}) 24%,
                transparent 32%
              )
            `,
            backgroundSize: '60px 60px, 80px 80px',
            opacity: intensity * 0.8,
            mixBlendMode: 'overlay',
            animation: 'interferenceShift 4s ease-in-out infinite'
          }}
        />
      );
    }
    
    // Photorealistic Metallic Effect
    if (metallicIntensity > 0) {
      const intensity = metallicIntensity / 100;
      const brushAngle = effectValues?.metallic?.brushAngle || 45;
      
      effects.push(
        <div
          key="metallic-base"
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                ${brushAngle}deg,
                #8C9197 0%,
                #B8BCC2 15%,
                #9CA0A6 30%,
                #C5C9CF 45%,
                #A8ACB2 60%,
                #D2D6DC 75%,
                #B0B4BA 90%,
                #DADEE4 100%
              )
            `,
            opacity: intensity * 0.7,
            mixBlendMode: 'multiply'
          }}
        />
      );
      
      // Brushed texture lines
      effects.push(
        <div
          key="brush-texture"
          className="absolute inset-0"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                ${brushAngle}deg,
                transparent 0px,
                rgba(180, 184, 190, ${intensity * 0.4}) 0.5px,
                transparent 1px,
                transparent 2px,
                rgba(160, 164, 170, ${intensity * 0.3}) 2.5px,
                transparent 3px
              )
            `,
            opacity: intensity,
            mixBlendMode: 'overlay'
          }}
        />
      );
      
      // Metallic highlights
      effects.push(
        <div
          key="metallic-highlights"
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                ${brushAngle + 90}deg,
                transparent 0%,
                rgba(255, 255, 255, ${intensity * 0.6}) 45%,
                rgba(255, 255, 255, ${intensity * 0.8}) 50%,
                rgba(255, 255, 255, ${intensity * 0.6}) 55%,
                transparent 100%
              )
            `,
            transform: `translateX(${mousePosition.x * 20 - 10}px) translateY(${mousePosition.y * 20 - 10}px)`,
            opacity: intensity * 0.5,
            mixBlendMode: 'screen',
            filter: 'blur(1px)'
          }}
        />
      );
    }
    
    // Galaxy/Cosmos Effect
    if (galaxyIntensity > 0) {
      const intensity = galaxyIntensity / 100;
      
      effects.push(
        <div
          key="galaxy-base"
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(
                ellipse at ${50 + mousePosition.x * 30}% ${50 + mousePosition.y * 30}%,
                #1a0033 0%,
                #2d0066 20%,
                #4a0099 40%,
                #6600cc 60%,
                #8533ff 80%,
                #b366ff 100%
              )
            `,
            opacity: intensity * 0.8,
            mixBlendMode: 'color-dodge'
          }}
        />
      );
      
      // Cosmic dust and nebula
      effects.push(
        <div
          key="cosmic-dust"
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, rgba(255, 100, 200, ${intensity * 0.3}) 0%, transparent 30%),
              radial-gradient(circle at 80% 70%, rgba(100, 200, 255, ${intensity * 0.4}) 0%, transparent 25%),
              radial-gradient(circle at 60% 20%, rgba(200, 255, 100, ${intensity * 0.2}) 0%, transparent 35%),
              radial-gradient(circle at 40% 80%, rgba(255, 200, 100, ${intensity * 0.3}) 0%, transparent 20%)
            `,
            animation: 'galaxyDrift 8s ease-in-out infinite',
            mixBlendMode: 'screen'
          }}
        />
      );
      
      // Star field
      effects.push(
        <div
          key="star-field"
          className="absolute inset-0"
          style={{
            backgroundImage: Array.from({ length: 50 }, (_, i) => {
              const x = Math.random() * 100;
              const y = Math.random() * 100;
              const size = Math.random() * 2 + 0.5;
              return `radial-gradient(circle at ${x}% ${y}%, rgba(255, 255, 255, ${intensity * 0.8}) 0%, transparent ${size}px)`;
            }).join(','),
            animation: 'starTwinkle 3s ease-in-out infinite alternate'
          }}
        />
      );
    }
    
    return effects;
  }, [effectValues, mousePosition, quality]);
  
  // Add CSS animations for dynamic effects
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes interferenceShift {
        0%, 100% { transform: translateX(0) translateY(0); }
        25% { transform: translateX(2px) translateY(-1px); }
        50% { transform: translateX(-1px) translateY(2px); }
        75% { transform: translateX(1px) translateY(1px); }
      }
      
      @keyframes galaxyDrift {
        0%, 100% { transform: rotate(0deg) scale(1); }
        50% { transform: rotate(180deg) scale(1.1); }
      }
      
      @keyframes starTwinkle {
        0% { opacity: 0.6; }
        100% { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {materialEffects}
    </div>
  );
};