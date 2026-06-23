import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Layers, Shield, Cpu, RefreshCw, Eye } from 'lucide-react';

interface ProductMeshViewer3DProps {
  productImageUrl: string;
  productName: string;
  skuCode?: string;
}

type RenderMode = 'solid' | 'wireframe' | 'hologram';

export const ProductMeshViewer3D: React.FC<ProductMeshViewer3DProps> = ({
  productImageUrl,
  productName,
  skuCode = 'VOOX-X_INT'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderMode, setRenderMode] = useState<RenderMode>('solid');
  const [isRotating, setIsRotating] = useState(true);
  const [loading, setLoading] = useState(true);

  // Store 3D references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const productGroupRef = useRef<THREE.Group | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const spotLightRef = useRef<THREE.SpotLight | null>(null);
  const pointLightRef = useRef<THREE.PointLight | null>(null);

  // For interactive dragging
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });

  // Handle mode switches
  useEffect(() => {
    if (!productGroupRef.current) return;

    productGroupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const material = child.material as THREE.Material & {
          wireframe?: boolean;
          transparent?: boolean;
          opacity?: number;
          emissiveIntensity?: number;
          metalness?: number;
          roughness?: number;
        };

        if (renderMode === 'wireframe') {
          material.wireframe = true;
          if ('color' in material) {
            (material.color as THREE.Color).setHex(0xff3333);
          }
          if ('emissive' in material) {
            (material.emissive as THREE.Color).setHex(0x3a0000);
          }
        } else if (renderMode === 'hologram') {
          material.wireframe = false;
          if ('color' in material) {
            (material.color as THREE.Color).setHex(0x110000);
          }
          if ('emissive' in material) {
            (material.emissive as THREE.Color).setHex(0xff3333);
            material.emissiveIntensity = 1.5;
          }
          material.transparent = true;
          material.opacity = 0.65;
        } else {
          // Solid tactical carbon composite mode
          material.wireframe = false;
          material.transparent = false;
          material.opacity = 1.0;
          if ('color' in material) {
            (material.color as THREE.Color).setHex(0x1c1917); // Slate stone base
          }
          if ('emissive' in material) {
            (material.emissive as THREE.Color).setHex(0x0f0c0b);
            material.emissiveIntensity = 0.2;
          }
          if ('metalness' in material) material.metalness = 0.85;
          if ('roughness' in material) material.roughness = 0.15;
        }
        material.needsUpdate = true;
      }
    });

    // Fire off a small particle burst or lighting change on style morph
    if (pointLightRef.current) {
      pointLightRef.current.intensity = renderMode === 'hologram' ? 8 : 4;
    }
  }, [renderMode]);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Dimensions setup
    const width = containerRef.current.clientWidth || 400;
    const height = containerRef.current.clientHeight || 400;

    // 2. Initialize Scene with ambient fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.08);
    sceneRef.current = scene;

    // 3. Setup Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);
    cameraRef.current = camera;

    // 4. Setup Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 5. Lights for depth, shading, and cinematic atmosphere
    const ambientLight = new THREE.AmbientLight(0x0f0c0c, 1.2);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    // Key bright crimson spot light from above (fabric/metallic spec highlights)
    const spotLight = new THREE.SpotLight(0xff1e1e, 18, 12, Math.PI / 6, 0.5, 1);
    spotLight.position.set(3, 5, 4);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    scene.add(spotLight);
    spotLightRef.current = spotLight;

    // Rim light from reverse angle
    const rimLight = new THREE.DirectionalLight(0x550000, 3.5);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    // Glowing core point light
    const pointLight = new THREE.PointLight(0xff1111, 4, 10);
    pointLight.position.set(0, 0, 2);
    scene.add(pointLight);
    pointLightRef.current = pointLight;

    // 6. PROCEDURAL STREETWEAR MODEL MESH (Combining multiple customized subdivisions)
    const productGroup = new THREE.Group();

    // Fabric Core (Tactical Vest/Hoodie torso block)
    const bodyGeo = new THREE.CylinderGeometry(1.0, 1.3, 2.2, 32, 16);
    // Displace vertices on body grid to look like draped fabric or techwear straps
    const pos = bodyGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const x = pos.getX(i);
      const z = pos.getZ(i);
      
      // Make slight horizontal ridges representation (tactical folds)
      const displace = Math.sin(y * 8.0) * 0.08;
      // Shrink chest a bit or taper to waist
      const scaleFactor = 1.0 + (y * 0.12);
      
      pos.setXYZ(i, x * scaleFactor + displace * (x / Math.max(0.1, Math.abs(x))), y, z * scaleFactor + displace * (z / Math.max(0.1, Math.abs(z))));
    }
    bodyGeo.computeVertexNormals();

    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x1c1917,
      roughness: 0.2,
      metalness: 0.8,
      bumpScale: 0.05,
      flatShading: true
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.position.y = -0.3;
    productGroup.add(bodyMesh);

    // Compound Hood Structure (Torso upper spherical wrap)
    const hoodGeo = new THREE.SphereGeometry(1.2, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.7);
    const hoodMat = new THREE.MeshStandardMaterial({
      color: 0x110f0f,
      emissive: 0xff0000,
      emissiveIntensity: 0.08,
      roughness: 0.3,
      metalness: 0.5,
      side: THREE.DoubleSide
    });
    const hoodMesh = new THREE.Mesh(hoodGeo, hoodMat);
    hoodMesh.position.set(0, 1.0, -0.15);
    hoodMesh.rotation.x = -Math.PI / 6;
    productGroup.add(hoodMesh);

    // Technical Straps (Floating Torus geometries simulating harness details)
    const strapGeo1 = new THREE.TorusGeometry(1.3, 0.06, 12, 48);
    const strapMat = new THREE.MeshStandardMaterial({
      color: 0x3a0303,
      emissive: 0xff1212,
      emissiveIntensity: 0.15,
      roughness: 0.1,
      metalness: 0.9
    });
    const strap1 = new THREE.Mesh(strapGeo1, strapMat);
    strap1.position.set(0, 0.3, 0);
    strap1.rotation.x = Math.PI / 2;
    productGroup.add(strap1);

    const strapGeo2 = new THREE.TorusGeometry(1.34, 0.05, 12, 48);
    const strap2 = new THREE.Mesh(strapGeo2, strapMat);
    strap2.position.set(0, -0.5, 0);
    strap2.rotation.x = Math.PI / 1.8;
    productGroup.add(strap2);

    // Glowing Neon Wireframe Accent lines on armor joints
    const armorAccGeo = new THREE.RingGeometry(1.36, 1.4, 6);
    const armorAccMat = new THREE.MeshBasicMaterial({
      color: 0xff1e1e,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95
    });
    const armorAcc = new THREE.Mesh(armorAccGeo, armorAccMat);
    armorAcc.position.set(0, 0.6, 0);
    armorAcc.rotation.x = Math.PI / 2;
    productGroup.add(armorAcc);

    // Hover-tracking chest beacon
    const beaconGeo = new THREE.IcosahedronGeometry(0.15, 0);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xff3333 });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.set(0, 0.4, 1.25);
    productGroup.add(beacon);

    scene.add(productGroup);
    productGroupRef.current = productGroup;

    // 7. BACKGROUND AMBIENT PARTICLES
    const particleCount = 150;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 6;
      particlePositions[i + 1] = (Math.random() - 0.5) * 6;
      particlePositions[i + 2] = (Math.random() - 0.5) * 5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Glow Canvas Texture
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 16;
    pCanvas.height = 16;
    const pCtx = pCanvas.getContext('2d');
    if (pCtx) {
      const grad = pCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
      grad.addColorStop(0, 'white');
      grad.addColorStop(0.3, 'rgba(239, 68, 68, 0.8)');
      grad.addColorStop(1, 'transparent');
      pCtx.fillStyle = grad;
      pCtx.fillRect(0, 0, 16, 16);
    }
    const pTexture = new THREE.CanvasTexture(pCanvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.08,
      map: pTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    setLoading(false);

    // 8. INTERACTIVE CLICK & DRAG ROTATION MECHANISM
    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      previousMousePosition.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      // Mouse position for orbital lights
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Sweep lighting spot tracking
      if (spotLightRef.current) {
        spotLightRef.current.position.x = mouseX * 4 + 3;
        spotLightRef.current.position.y = mouseY * 4 + 5;
      }

      if (!isDragging.current) {
        // Slow sway on hover
        targetRotation.current.y = mouseX * 0.6;
        targetRotation.current.x = mouseY * 0.4;
        return;
      }

      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;

      targetRotation.current.y += deltaX * 0.007;
      targetRotation.current.x += deltaY * 0.007;

      previousMousePosition.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    const handleMouseUpOrLeave = () => {
      isDragging.current = false;
    };

    // Attach to DOM
    const el = containerRef.current;
    el.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUpOrLeave);

    // Touch support for mobiles
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging.current = true;
        previousMousePosition.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.current.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.current.y;

      targetRotation.current.y += deltaX * 0.009;
      targetRotation.current.x += deltaY * 0.009;

      previousMousePosition.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    };

    el.addEventListener('touchstart', handleTouchStart);
    el.addEventListener('touchmove', handleTouchMove);
    el.addEventListener('touchend', handleMouseUpOrLeave);

    // 9. ANIMATION LOOP
    const clock = new THREE.Clock();
    let animationFrameId = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      // Rotation interpolations (gently drag following lerp)
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.1;
      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.1;

      if (productGroup) {
        // Base auto rotating plus user manipulation
        const pulse = 1.0 + Math.sin(elapsed * 1.5) * 0.02;
        productGroup.scale.set(pulse, pulse, pulse);

        productGroup.rotation.y = currentRotation.current.y + (isRotating && !isDragging.current ? elapsed * 0.2 : 0);
        productGroup.rotation.x = currentRotation.current.x;

        // Breathe strap positions slightly to make them feel organic
        strap1.rotation.y = Math.sin(elapsed * 2.0) * 0.08;
        strap2.rotation.y = -Math.cos(elapsed * 1.5) * 0.08;

        // Self-rotation of core glowing beacon jewel
        beacon.rotation.y = elapsed * 2;
        beacon.position.y = 0.4 + Math.sin(elapsed * 3.5) * 0.04;
      }

      // Rotate drifting stars
      particles.rotation.y = elapsed * 0.02;
      particles.position.y = Math.sin(elapsed * 0.5) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    // Resize observer
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(containerRef.current);

    // 10. CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      
      el.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUpOrLeave);
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleMouseUpOrLeave);

      if (containerRef.current && renderer.domElement) {
        try {
          containerRef.current.removeChild(renderer.domElement);
        } catch (_) {}
      }

      // Garbage clean Three elements
      bodyGeo.dispose();
      bodyMat.dispose();
      hoodGeo.dispose();
      hoodMat.dispose();
      strapGeo1.dispose();
      strapGeo2.dispose();
      strapMat.dispose();
      armorAccGeo.dispose();
      armorAccMat.dispose();
      beaconGeo.dispose();
      beaconMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      pTexture.dispose();
      pTexture.dispose();
      renderer.dispose();
    };
  }, [isRotating]);

  return (
    <div className="w-full h-full min-h-[360px] md:min-h-[480px] relative select-none">
      
      {/* 3D WebGL target container */}
      <div 
        ref={containerRef} 
        className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing z-10"
      />

      {/* Grid Blueprint Backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(139,0,0,0.015)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

      {/* Futuristic floating markers */}
      <div className="absolute top-6 left-6 z-20 font-mono text-[8px] text-zinc-500 tracking-widest leading-relaxed pointer-events-none select-none">
        <p>MATRIX_RENDER_ENGINE: WEBGL_v3</p>
        <p>OBJECT: {productName.toUpperCase().replace(' ', '_')}</p>
        <p className="text-red-500 font-bold animate-pulse">RENDER_ACTIVE: 60FPS</p>
      </div>

      <div className="absolute bottom-6 right-6 z-20 font-mono text-[8px] text-zinc-500 tracking-widest text-right pointer-events-none select-none">
        <p>COORDINATE: [ {skuCode} ]</p>
        <p>VERTEX_COUNT: 4,096_S_BUFFERS</p>
        <p>LIGHTING: TRIPLE_SPOT_GLOW</p>
      </div>

      {/* Holographic Wireframe/Render Mode controls inside viewer */}
      <div className="absolute left-6 bottom-6 z-30 flex flex-col gap-2 pointer-events-auto">
        <span className="font-mono text-[7px] text-zinc-650 tracking-widest uppercase">RENDER_MEMBER</span>
        
        <div className="flex bg-black/60 border border-zinc-900/60 p-1.5 rounded-lg gap-1 backdrop-blur-sm shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
          <button
            onClick={() => setRenderMode('solid')}
            className={`px-2.5 py-1 text-[8px] font-mono tracking-widest rounded transition-all select-none uppercase font-semibold cursor-pointer ${
              renderMode === 'solid'
                ? 'bg-red-600 text-white shadow-[0_0_8px_rgba(239,68,68,0.3)]'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40'
            }`}
          >
            SOLID
          </button>
          
          <button
            onClick={() => setRenderMode('hologram')}
            className={`px-2.5 py-1 text-[8px] font-mono tracking-widest rounded transition-all select-none uppercase font-semibold cursor-pointer ${
              renderMode === 'hologram'
                ? 'bg-red-600 text-white shadow-[0_0_8px_rgba(239,68,68,0.3)]'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40'
            }`}
          >
            GLOW_SYS
          </button>

          <button
            onClick={() => setRenderMode('wireframe')}
            className={`px-2.5 py-1 text-[8px] font-mono tracking-widest rounded transition-all select-none uppercase font-semibold cursor-pointer ${
              renderMode === 'wireframe'
                ? 'bg-red-600 text-white shadow-[0_0_8px_rgba(239,68,68,0.3)]'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40'
            }`}
          >
            WIRES
          </button>
        </div>
      </div>

      {/* Auto Rotation switch toggle */}
      <div className="absolute top-6 right-6 z-30 pointer-events-auto">
        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`p-2 rounded-full border transition-all cursor-pointer ${
            isRotating 
              ? 'bg-red-950/20 border-red-900/50 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.15)]'
              : 'bg-zinc-950 border-zinc-900 text-zinc-500 hover:text-zinc-300'
          }`}
          title="Toggle Auto Orbit Rotation"
        >
          <RefreshCw className={`w-3 h-3 ${isRotating ? 'animate-spin [animation-duration:8s]' : ''}`} />
        </button>
      </div>

      {/* Show static preview thumbnail indicator */}
      <div className="absolute right-6 bottom-16 z-20 flex flex-col items-end gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
        <span className="font-mono text-[7px] text-zinc-650 tracking-wider">MAPPED_SURFACE:</span>
        <div className="w-10 h-10 border border-zinc-900 p-1 bg-black/40 rounded-lg overflow-hidden flex items-center justify-center">
          <img 
            src={productImageUrl} 
            alt="Source" 
            className="max-w-full max-h-full object-contain filter brightness-90 grayscale hover:grayscale-0 transition-all"
          />
        </div>
      </div>

    </div>
  );
};
