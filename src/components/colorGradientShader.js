import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  
  uniform float time;

  void main() {
    vec3 color1 = vec3(1.0, 0.0, 0.0); // Red
    vec3 color2 = vec3(0.0, 1.0, 0.0); // Green
    vec3 color3 = vec3(0.0, 0.0, 1.0); // Blue
    vec3 color4 = vec3(1.0, 1.0, 0.0); // Yellow

    float t = abs(sin(time * 0.1)); // Smooth transition
    vec3 color = mix(color1, color2, t);
    color = mix(color, color3, smoothstep(0.0, 1.0, t - 0.5));
    color = mix(color, color4, smoothstep(0.0, 1.0, t - 0.75));
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

export const createColorGradientMaterial = () => {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      time: { value: 0 }
    }
  });
};
