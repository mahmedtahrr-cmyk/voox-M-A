import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export const SpaceBackground3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. High-Performance Three.js Core Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.035);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    mountRef.current.appendChild(renderer.domElement);

    // 2. Ambient & Back Lighting
    const ambientLight = new THREE.AmbientLight(0x0a0101, 1.5);
    scene.add(ambientLight);

    const redDistantLight = new THREE.PointLight(0xff0000, 5, 40);
    redDistantLight.position.set(10, 8, -5);
    scene.add(redDistantLight);

    const redLeftLight = new THREE.PointLight(0x4a0000, 3, 30);
    redLeftLight.position.set(-10, -5, -3);
    scene.add(redLeftLight);

    // 3. THE SILKY CLOTH WAVE GRID (Simulating Woven Fabric / Textiles)
    const fabricGeo = new THREE.PlaneGeometry(55, 35, 40, 25);
    const fabricMat = new THREE.MeshBasicMaterial({
      color: 0x3f0505, // Deep crimson thread
      wireframe: true,
      transparent: true,
      opacity: 0.14,
      side: THREE.DoubleSide
    });
    const fabricMesh = new THREE.Mesh(fabricGeo, fabricMat);
    // Positioned deep in the background as a waving cosmic drape
    fabricMesh.position.set(2, -1, -5);
    fabricMesh.rotation.x = -Math.PI / 3;
    fabricMesh.rotation.z = Math.PI / 12;
    scene.add(fabricMesh);

    // 4. FLOATING APPAREL MODELS (Abstract 3D Wireframe Garment Hangers)
    const createHanger3D = (color: number) => {
      const hanger = new THREE.Group();
      
      // Bottom flat bar
      const bottomBarGeo = new THREE.CylinderGeometry(0.012, 0.012, 2.4, 8);
      const barMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.5 });
      const bottomBar = new THREE.Mesh(bottomBarGeo, barMat);
      bottomBar.rotation.z = Math.PI / 2;
      hanger.add(bottomBar);

      // Left support slope
      const leftSlopeGeo = new THREE.CylinderGeometry(0.012, 0.012, 1.38, 8);
      const leftSlope = new THREE.Mesh(leftSlopeGeo, barMat);
      leftSlope.position.set(-0.6, 0.35, 0);
      leftSlope.rotation.z = -Math.PI / 6; // 30 degrees
      hanger.add(leftSlope);

      // Right support slope
      const rightSlopeGeo = new THREE.CylinderGeometry(0.012, 0.012, 1.38, 8);
      const rightSlope = new THREE.Mesh(rightSlopeGeo, barMat);
      rightSlope.position.set(0.6, 0.35, 0);
      rightSlope.rotation.z = Math.PI / 6;
      hanger.add(rightSlope);

      // Upper Hook
      const hookGeo = new THREE.TorusGeometry(0.24, 0.012, 8, 24, Math.PI * 1.35);
      const hook = new THREE.Mesh(hookGeo, barMat);
      hook.position.set(-0.07, 0.95, 0);
      hook.rotation.z = -Math.PI / 5;
      hanger.add(hook);

      // Small central connecting neck
      const neckGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.24, 8);
      const neck = new THREE.Mesh(neckGeo, barMat);
      neck.position.set(0, 0.78, 0);
      hanger.add(neck);

      return hanger;
    };

    // Instantiate multiple hangers floating in background depth layers
    const hangers: THREE.Group[] = [];
    const hangerParams = [
      { x: -9, y: 5, z: 2, scale: 1.1, rx: 0.2, ry: 0.4, speedY: 0.12, speedR: 0.005 },
      { x: 10, y: -4, z: -1, scale: 0.95, rx: -0.3, ry: -0.6, speedY: -0.1, speedR: -0.004 },
      { x: -5, y: -7, z: -3, scale: 0.8, rx: 0.5, ry: 0.2, speedY: 0.08, speedR: 0.006 },
      { x: 8, y: 7, z: 3, scale: 1.25, rx: -0.1, ry: 0.8, speedY: -0.15, speedR: -0.003 }
    ];

    hangerParams.forEach((params) => {
      const hanger = createHanger3D(0x9d0000); // Sleek cyber red
      hanger.position.set(params.x, params.y, params.z);
      hanger.scale.set(params.scale, params.scale, params.scale);
      hanger.rotation.set(params.rx, params.ry, 0);
      scene.add(hanger);
      hangers.push(hanger);
    });

    // 5. COUTURE TAILORING MANNEQUINS (Concentric Wireframe Torso forms)
    const createMannequinTorso = (color: number) => {
      const mannequin = new THREE.Group();
      const ringMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.28 });
      
      // Wire hoops capturing the shape of design
      const ringSpecs = [
        { y: 1.6, r: 0.48 }, // Collarbone
        { y: 1.1, r: 0.62 }, // Chest
        { y: 0.5, r: 0.42 }, // Waist
        { y: -0.1, r: 0.58 }, // Hip curve
        { y: -0.7, r: 0.64 }  // Base silhouette
      ];

      ringSpecs.forEach((spec) => {
        const hoopGeo = new THREE.TorusGeometry(spec.r, 0.015, 8, 36);
        const hoop = new THREE.Mesh(hoopGeo, ringMat);
        hoop.position.y = spec.y;
        hoop.rotation.x = Math.PI / 2;
        mannequin.add(hoop);
      });

      // Spine through center
      const coreGeo = new THREE.CylinderGeometry(0.018, 0.018, 2.8, 8);
      const core = new THREE.Mesh(coreGeo, ringMat);
      core.position.y = 0.45;
      mannequin.add(core);

      // Floor stand structure
      const standPoleGeo = new THREE.CylinderGeometry(0.02, 0.02, 2.2, 8);
      const pole = new THREE.Mesh(standPoleGeo, new THREE.MeshBasicMaterial({ color: 0x110202, transparent: true, opacity: 0.6 }));
      pole.position.y = -1.6;
      mannequin.add(pole);

      const baseGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.05, 24);
      const base = new THREE.Mesh(baseGeo, new THREE.MeshBasicMaterial({ color: 0x0c0000, transparent: true, opacity: 0.7 }));
      base.position.y = -2.7;
      mannequin.add(base);

      return mannequin;
    };

    const mannequins: THREE.Group[] = [];
    const mannequinParams = [
      { x: -14, y: -1, z: -2, scale: 1.5, ry: 0.5, spinSpeed: 0.003 },
      { x: 13, y: 2, z: 1, scale: 1.4, ry: -0.8, spinSpeed: -0.002 }
    ];

    mannequinParams.forEach((params) => {
      const mannequin = createMannequinTorso(0xff1111);
      mannequin.position.set(params.x, params.y, params.z);
      mannequin.scale.set(params.scale, params.scale, params.scale);
      mannequin.rotation.y = params.ry;
      scene.add(mannequin);
      mannequins.push(mannequin);
    });

    // 6. LOW-GRAVITY SPINNING TEXTILE FIBERS (The Cotton/Dust environment)
    const particleCount = 280;
    const pGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const pVelocities: number[] = [];

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Disperse threads across space volume
      positions[i] = (Math.random() - 0.5) * 45;
      positions[i + 1] = (Math.random() - 0.5) * 45;
      positions[i + 2] = (Math.random() - 0.5) * 25;

      // Soft drifts
      pVelocities.push((Math.random() - 0.5) * 0.012); // x
      pVelocities.push(-Math.random() * 0.015 - 0.004); // y (continuous descending)
    }

    pGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Glowing circle particle template
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      gradient.addColorStop(0, 'rgba(255, 30, 30, 1)');      // Hot core
      gradient.addColorStop(0.3, 'rgba(180, 0, 0, 0.8)');    // Outer wool fabric
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');          // Void
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 16, 16);
    }
    const pTexture = new THREE.CanvasTexture(canvas);

    const pMaterial = new THREE.PointsMaterial({
      size: 0.18,
      map: pTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.45,
      depthWrite: false
    });

    const threadPoints = new THREE.Points(pGeometry, pMaterial);
    scene.add(threadPoints);

    // 7. REAL-TIME ANIMABLE LOOP
    let animFrameId = 0;
    const clock = new THREE.Clock();

    // Mouse interactive tracking to warp fabric grid on cursor coordinates
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      // Interpersonal mouse camera panning
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Oscillating silk mesh perturbation
      const pos = fabricGeo.attributes.position;
      const count = pos.count;
      for (let i = 0; i < count; i++) {
        const gridX = pos.getX(i);
        const gridY = pos.getY(i);
        
        // Multi-frequency sine and cosine wave sum to evoke real flowing satin canvas 
        const waveZ = Math.sin(gridX * 0.08 + elapsed * 1.3) * Math.cos(gridY * 0.06 + elapsed * 0.9) * 2.8
                    + Math.sin(gridY * 0.18 - elapsed * 1.6) * 0.7
                    + (mouse.x * (gridX / 10.0)) * 0.8; // Mouse wind displacement
        
        pos.setZ(i, waveZ);
      }
      pos.needsUpdate = true;

      // Animate floating hangers (rotation + gentle hover float)
      hangers.forEach((hanger, index) => {
        const p = hangerParams[index];
        hanger.rotation.y += p.speedR;
        hanger.rotation.x += Math.cos(elapsed + index) * 0.001;
        
        // Float heights
        hanger.position.y = p.y + Math.sin(elapsed * 0.6 + index) * 0.4;
        
        // React slightly to mouse
        hanger.position.x = p.x + mouse.x * 0.8;
      });

      // Rotate Tailoring Mannequin models representing live fabric measuring
      mannequins.forEach((mannequin, index) => {
        const p = mannequinParams[index];
        mannequin.rotation.y += p.spinSpeed;
        mannequin.position.y = p.y + Math.sin(elapsed * 0.4 + index) * 0.25;
        
        // Slight natural lean feedback responding to coordinate shifts
        mannequin.rotation.z = Math.sin(elapsed * 0.3) * 0.02 + mouse.x * 0.04;
      });

      // Fall drifting thread/lint particles
      const positionsArr = threadPoints.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        // Float downwards
        positionsArr[i3 + 1] += pVelocities[i * 2 + 1];
        // Swerve side to side representing cloth fibers floating
        positionsArr[i3] += pVelocities[i * 2] + Math.sin(elapsed + i) * 0.005;

        // Reset if goes off-screen below viewport height bounds
        if (positionsArr[i3 + 1] < -22) {
          positionsArr[i3 + 1] = 22;
          positionsArr[i3] = (Math.random() - 0.5) * 45;
        }
      }
      threadPoints.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Dynamic Viewport Resizing
    const handleResize = () => {
      if (!mountRef.current || !renderer || !camera) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 9. CLEANUP MEMORY DESTRUCTION
    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);

      if (mountRef.current && renderer.domElement) {
        try {
          mountRef.current.removeChild(renderer.domElement);
        } catch (_) {}
      }

      fabricGeo.dispose();
      fabricMat.dispose();
      pGeometry.dispose();
      pMaterial.dispose();
      pTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      id="fabric-clothing-mesh-background-3d" 
      ref={mountRef} 
      className="fixed inset-0 w-full h-full pointer-events-none select-none z-[-1] overflow-hidden"
    />
  );
};
