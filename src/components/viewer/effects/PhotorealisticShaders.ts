import * as THREE from 'three';

// Advanced Holographic Foil Shader with real interference patterns
export const HolographicFoilShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec3 vViewDirection;
    varying vec3 vReflect;
    
    uniform float uTime;
    uniform float uWarpStrength;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      vViewDirection = normalize(cameraPosition - worldPosition.xyz);
      vReflect = reflect(-vViewDirection, vNormal);
      
      // Add slight surface warping for realism
      vec3 warpedPosition = position + normal * sin(uv.x * 20.0 + uTime) * uWarpStrength * 0.001;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(warpedPosition, 1.0);
    }
  `,
  
  fragmentShader: `
    uniform float uTime;
    uniform float uIntensity;
    uniform float uRainbowSpread;
    uniform float uInterferenceScale;
    uniform sampler2D uTexture;
    uniform samplerCube uEnvMap;
    uniform vec3 uLightDirection;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec3 vViewDirection;
    varying vec3 vReflect;
    
    // Convert wavelength to RGB (real physics-based)
    vec3 wavelengthToRGB(float wavelength) {
      float r = 0.0, g = 0.0, b = 0.0;
      
      if (wavelength >= 380.0 && wavelength < 440.0) {
        r = -(wavelength - 440.0) / (440.0 - 380.0);
        b = 1.0;
      } else if (wavelength >= 440.0 && wavelength < 490.0) {
        g = (wavelength - 440.0) / (490.0 - 440.0);
        b = 1.0;
      } else if (wavelength >= 490.0 && wavelength < 510.0) {
        g = 1.0;
        b = -(wavelength - 510.0) / (510.0 - 490.0);
      } else if (wavelength >= 510.0 && wavelength < 580.0) {
        r = (wavelength - 510.0) / (580.0 - 510.0);
        g = 1.0;
      } else if (wavelength >= 580.0 && wavelength < 645.0) {
        r = 1.0;
        g = -(wavelength - 645.0) / (645.0 - 580.0);
      } else if (wavelength >= 645.0 && wavelength <= 750.0) {
        r = 1.0;
      }
      
      return vec3(r, g, b);
    }
    
    // Thin-film interference calculation
    float thinFilmInterference(vec3 viewDir, vec3 normal, float thickness) {
      float cosTheta = dot(viewDir, normal);
      float opticalPath = 2.0 * thickness * sqrt(1.0 - pow(0.7 * sin(acos(cosTheta)), 2.0));
      return opticalPath;
    }
    
    void main() {
      vec4 texColor = texture2D(uTexture, vUv);
      
      // Fresnel effect for viewing angle dependency
      float fresnel = 1.0 - max(0.0, dot(vViewDirection, vNormal));
      fresnel = pow(fresnel, 1.5);
      
      // Calculate interference pattern
      float thickness = 0.5 + sin(vUv.x * uInterferenceScale + uTime * 0.5) * 0.3;
      float interference = thinFilmInterference(vViewDirection, vNormal, thickness);
      
      // Convert interference to wavelength (380-750 nm visible spectrum)
      float wavelength = 380.0 + mod(interference * uRainbowSpread, 370.0);
      vec3 interferenceColor = wavelengthToRGB(wavelength);
      
      // Multiple interference orders for complexity
      float secondOrder = thinFilmInterference(vViewDirection, vNormal, thickness * 1.5);
      float wavelength2 = 380.0 + mod(secondOrder * uRainbowSpread * 0.7, 370.0);
      vec3 interferenceColor2 = wavelengthToRGB(wavelength2);
      
      // Combine interference orders
      vec3 finalInterference = mix(interferenceColor, interferenceColor2, 0.3);
      
      // Environment reflection for metallic base
      vec3 envColor = textureCube(uEnvMap, vReflect).rgb;
      
      // Directional light streaks typical of holographic foil
      float lightAngle = dot(normalize(uLightDirection), vNormal);
      float streakPattern = sin(vUv.x * 50.0 + lightAngle * 10.0) * sin(vUv.y * 30.0);
      streakPattern = smoothstep(0.7, 1.0, streakPattern) * lightAngle;
      
      // Combine all effects
      vec3 baseColor = mix(texColor.rgb, envColor * 0.3, 0.4);
      vec3 holographicEffect = finalInterference * uIntensity * fresnel;
      vec3 lightStreaks = vec3(1.0) * streakPattern * uIntensity * 0.5;
      
      vec3 finalColor = baseColor + holographicEffect + lightStreaks;
      
      gl_FragColor = vec4(finalColor, texColor.a);
    }
  `,
  
  uniforms: {
    uTime: { value: 0.0 },
    uIntensity: { value: 1.0 },
    uRainbowSpread: { value: 2.0 },
    uInterferenceScale: { value: 20.0 },
    uWarpStrength: { value: 1.0 },
    uTexture: { value: null },
    uEnvMap: { value: null },
    uLightDirection: { value: new THREE.Vector3(1.0, 1.0, 1.0) }
  }
};

// Prismatic Refractor Shader
export const PrismaticRefractorShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec3 vViewDirection;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      vViewDirection = normalize(cameraPosition - worldPosition.xyz);
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  
  fragmentShader: `
    uniform float uTime;
    uniform float uDispersion;
    uniform float uRefractiveIndex;
    uniform sampler2D uTexture;
    uniform vec2 uResolution;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewDirection;
    
    vec3 getRefractedColor(vec2 uv, float ior) {
      vec3 incident = normalize(-vViewDirection);
      vec3 refracted = refract(incident, vNormal, 1.0 / ior);
      
      // Offset UV based on refraction
      vec2 refractedUV = uv + refracted.xy * 0.1;
      return texture2D(uTexture, refractedUV).rgb;
    }
    
    void main() {
      // Chromatic dispersion - different IOR for R, G, B
      float iorRed = uRefractiveIndex - uDispersion;
      float iorGreen = uRefractiveIndex;
      float iorBlue = uRefractiveIndex + uDispersion;
      
      vec3 redChannel = getRefractedColor(vUv, iorRed);
      vec3 greenChannel = getRefractedColor(vUv, iorGreen);
      vec3 blueChannel = getRefractedColor(vUv, iorBlue);
      
      // Combine channels for chromatic aberration effect
      vec3 dispersedColor = vec3(redChannel.r, greenChannel.g, blueChannel.b);
      
      // Add prismatic rainbow patterns
      float prismPattern = sin(vUv.x * 30.0 + uTime) * sin(vUv.y * 20.0 + uTime * 0.5);
      vec3 rainbowShift = vec3(
        sin(prismPattern + 0.0) * 0.5 + 0.5,
        sin(prismPattern + 2.094) * 0.5 + 0.5,
        sin(prismPattern + 4.188) * 0.5 + 0.5
      );
      
      vec3 finalColor = mix(dispersedColor, rainbowShift, 0.3);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
  
  uniforms: {
    uTime: { value: 0.0 },
    uDispersion: { value: 0.05 },
    uRefractiveIndex: { value: 1.5 },
    uTexture: { value: null },
    uResolution: { value: new THREE.Vector2(1024, 1024) }
  }
};

// Galaxy/Cosmos Foil Shader
export const GalaxyFoilShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec3 vViewDirection;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      vViewDirection = normalize(cameraPosition - worldPosition.xyz);
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  
  fragmentShader: `
    uniform float uTime;
    uniform float uIntensity;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform vec3 uColorC;
    uniform sampler2D uTexture;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewDirection;
    
    // Noise function for cosmic patterns
    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      for (int i = 0; i < 6; i++) {
        value += amplitude * noise(p);
        p *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }
    
    void main() {
      vec4 texColor = texture2D(uTexture, vUv);
      
      // Fresnel for edge lighting
      float fresnel = 1.0 - max(0.0, dot(vViewDirection, vNormal));
      fresnel = pow(fresnel, 2.0);
      
      // Cosmic swirl pattern
      vec2 centered = vUv - 0.5;
      float angle = atan(centered.y, centered.x);
      float radius = length(centered);
      
      // Spiral galaxy arms
      float spiral = sin(angle * 3.0 + radius * 20.0 - uTime * 2.0);
      float spiral2 = sin(angle * 2.0 - radius * 15.0 + uTime * 1.5);
      
      // Noise for star field
      float starField = fbm(vUv * 100.0 + uTime * 0.1);
      starField = smoothstep(0.8, 1.0, starField);
      
      // Color mixing for cosmic effect
      float colorMix = (spiral + spiral2) * 0.5 + 0.5;
      vec3 cosmicColor = mix(uColorA, uColorB, colorMix);
      cosmicColor = mix(cosmicColor, uColorC, starField);
      
      // Metallic base with cosmic overlay
      vec3 metallicBase = mix(texColor.rgb, vec3(0.7, 0.8, 1.0), 0.3);
      vec3 finalColor = mix(metallicBase, cosmicColor, uIntensity * fresnel);
      
      // Add bright star highlights
      finalColor += vec3(1.0) * starField * uIntensity * 0.5;
      
      gl_FragColor = vec4(finalColor, texColor.a);
    }
  `,
  
  uniforms: {
    uTime: { value: 0.0 },
    uIntensity: { value: 1.0 },
    uColorA: { value: new THREE.Vector3(0.2, 0.1, 0.8) },
    uColorB: { value: new THREE.Vector3(0.8, 0.2, 0.6) },
    uColorC: { value: new THREE.Vector3(1.0, 0.8, 0.2) },
    uTexture: { value: null }
  }
};

// Secret Rare Multi-Layer Shader
export const SecretRareShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec3 vViewDirection;
    varying float vHeight;
    
    uniform float uTime;
    uniform float uEmbossStrength;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      vViewDirection = normalize(cameraPosition - worldPosition.xyz);
      
      // Embossed surface displacement
      float emboss = sin(uv.x * 50.0) * sin(uv.y * 30.0) * uEmbossStrength;
      vHeight = emboss;
      
      vec3 embossedPosition = position + normal * emboss * 0.01;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(embossedPosition, 1.0);
    }
  `,
  
  fragmentShader: `
    uniform float uTime;
    uniform float uLayer1Intensity;
    uniform float uLayer2Intensity;
    uniform float uEmbossIntensity;
    uniform sampler2D uTexture;
    uniform sampler2D uNormalMap;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewDirection;
    varying float vHeight;
    
    void main() {
      vec4 texColor = texture2D(uTexture, vUv);
      vec3 normalTex = texture2D(uNormalMap, vUv).rgb * 2.0 - 1.0;
      
      // Enhanced normal from height data
      vec3 finalNormal = normalize(vNormal + normalTex * 0.5);
      
      // Fresnel with enhanced normal
      float fresnel = 1.0 - max(0.0, dot(vViewDirection, finalNormal));
      fresnel = pow(fresnel, 1.5);
      
      // First foil layer - holographic
      float holo1 = sin(vUv.x * 40.0 + uTime * 3.0) * sin(vUv.y * 30.0 + uTime * 2.0);
      vec3 holoColor1 = vec3(
        sin(holo1 + 0.0) * 0.5 + 0.5,
        sin(holo1 + 2.094) * 0.5 + 0.5,
        sin(holo1 + 4.188) * 0.5 + 0.5
      );
      
      // Second foil layer - prismatic
      float prism = sin(vUv.x * 60.0 + vUv.y * 45.0 + uTime * 4.0);
      vec3 prismColor = vec3(1.0, 0.8, 0.6) * (prism * 0.5 + 0.5);
      
      // Embossed highlights
      float embossHighlight = smoothstep(0.0, 0.1, vHeight) * uEmbossIntensity;
      vec3 embossColor = vec3(1.0) * embossHighlight;
      
      // Layer composition
      vec3 layer1 = mix(texColor.rgb, holoColor1, uLayer1Intensity * fresnel);
      vec3 layer2 = mix(layer1, prismColor, uLayer2Intensity * fresnel * 0.5);
      vec3 finalColor = layer2 + embossColor;
      
      gl_FragColor = vec4(finalColor, texColor.a);
    }
  `,
  
  uniforms: {
    uTime: { value: 0.0 },
    uLayer1Intensity: { value: 0.8 },
    uLayer2Intensity: { value: 0.6 },
    uEmbossStrength: { value: 1.0 },
    uEmbossIntensity: { value: 0.5 },
    uTexture: { value: null },
    uNormalMap: { value: null }
  }
};