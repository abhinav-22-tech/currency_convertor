import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { createColorGradientMaterial } from './colorGradientShader';

const ColorGradientAnimation = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      width / -2, width / 2,
      height / 2, height / -2,
      1, 1000
    );
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    const mountNode = mountRef.current;
    mountNode.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(width, height);
    const gradientMaterial = createColorGradientMaterial();
    const gradientMesh = new THREE.Mesh(geometry, gradientMaterial);
    scene.add(gradientMesh);

    const animate = () => {
      requestAnimationFrame(animate);
      gradientMaterial.uniforms.time.value += 0.01; // Update time for animation
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.left = width / -2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = height / -2;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (mountNode) {
        mountNode.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <div ref={mountRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }} />;
};

export default ColorGradientAnimation;
