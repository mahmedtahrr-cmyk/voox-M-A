import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface ProductCard3DOverlayProps {
  isHovered: boolean;
}

export const ProductCard3DOverlay: React.FC<ProductCard3DOverlayProps> = ({ isHovered }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const webglRef = useRef<{
    renderer?: THREE.WebGLRenderer;
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    ring1?: THREE.Mesh;
    ring2?: THREE.Mesh;
    grid?: THREE.GridHelper;
    particles?: THREE.Points;
  }>({});

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || 300;
    const height = containerRef.current.clientHeight || 300;

    // 1. Create Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.25);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10);
    camera.position.z = 3.5;

    // 3. Renderer with absolute transparency
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
    containerRef.current.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xff1111, 0.6);
    scene.add(ambientLight);

    const spotLight = new THREE.DirectionalLight(0xff0000, 1.5);
    spotLight.position.set(0, 1, 2);
    scene.add(spotLight);

    // 5. Holographic Target Radar Rings
    const ringGeo1 = new THREE.RingGeometry(0.9, 0.92, 32);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xff1e1e,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.15
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 2.2;
    scene.add(ring1);

    const ringGeo2 = new THREE.RingGeometry(0.7, 0.71, 24);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x8b0000,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.2
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = Math.PI / 2.3;
    ring2.rotation.y = Math.PI / 6;
    scene.add(ring2);

    // 6. Grid blueprint structure representing the floor "platform"
    const grid = new THREE.GridHelper(3, 12, 0xff1e1e, 0x1a1a1a);
    grid.position.y = -0.6;
    // Set grid material transparencies
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.12;
    scene.add(grid);

    // 7. Micro Particle Field
    const pCount = 35;
    const pGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 2.2;
      positions[i + 1] = (Math.random() - 0.5) * 1.8;
      positions[i + 2] = (Math.random() - 0.5) * 1.5;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Simple round dot texture
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 8;
    pCanvas.height = 8;
    const pCtx = pCanvas.getContext('2d');
    if (pCtx) {
      pCtx.fillStyle = 'rgba(239, 68, 68, 0.7)';
      pCtx.beginPath();
      pCtx.arc(4, 4, 3, 0, Math.PI * 2);
      pCtx.fill();
    }
    const pTexture = new THREE.CanvasTexture(pCanvas);
    const pMat = new THREE.PointsMaterial({
      size: 0.08,
      map: pTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    webglRef.current = { renderer, scene, camera, ring1, ring2, grid, particles };

    // 8. Animation cycle
    let frameId = 0;
    const clock = new THREE.Clock();

    const render = () => {
      frameId = requestAnimationFrame(render);
      const elapsed = clock.getElapsedTime();
      const s = webglRef.current;

      // Base rotation speeds
      if (s.ring1) {
        s.ring1.rotation.z = elapsed * 0.15;
      }
      if (s.ring2) {
        s.ring2.rotation.z = -elapsed * 0.3;
      }
      if (s.particles) {
        s.particles.rotation.y = elapsed * 0.08;
      }

      // Responsive react to hover: zoom camera slightly & light up
      if (s.camera) {
        const targetZ = isHovered ? 2.8 : 3.5;
        s.camera.position.z += (targetZ - s.camera.position.z) * 0.1;
      }

      if (s.ring1 && s.ring1.material) {
        const targetOp = isHovered ? 0.35 : 0.12;
        (s.ring1.material as THREE.Material).opacity += (targetOp - (s.ring1.material as THREE.Material).opacity) * 0.1;
      }

      if (s.renderer && s.scene && s.camera) {
        s.renderer.render(s.scene, s.camera);
      }
    };

    render();

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const observer = new ResizeObserver(() => handleResize());
    observer.observe(containerRef.current);

    // 9. Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      if (containerRef.current && renderer.domElement) {
        try {
          containerRef.current.removeChild(renderer.domElement);
        } catch (_) {}
      }
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      grid.dispose();
      pGeo.dispose();
      pMat.dispose();
      pTexture.dispose();
      renderer.dispose();
    };
  }, []);

  // Hot reactive effect for changes in isHovered
  useEffect(() => {
    if (!webglRef.current.ring1 || !webglRef.current.ring2) return;
    // Highlight colors slightly on hover
    const colorHex = isHovered ? 0xff4444 : 0x8b0000;
    if (webglRef.current.ring2.material instanceof THREE.MeshBasicMaterial) {
      webglRef.current.ring2.material.color.setHex(colorHex);
    }
  }, [isHovered]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
    />
  );
};
