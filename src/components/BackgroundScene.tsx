'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Check if WebGL is available
function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

export default function BackgroundScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    particles: THREE.Points;
    techObjects: THREE.Group[];
    animationId: number;
  } | null>(null);

  useEffect(() => {
    // Check WebGL support
    if (!isWebGLAvailable()) {
      setWebGLSupported(false);
      return;
    }

    if (!canvasRef.current) return;

    const canvas = canvasRef.current;

    // Initialize Three.js with error handling
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch (e) {
      console.warn('WebGL not supported, falling back to CSS background');
      setWebGLSupported(false);
      return;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x181C22);
    scene.fog = new THREE.FogExp2(0x181C22, 0.002);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create Particles
    const geometry = new THREE.BufferGeometry();
    const count = 500;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x00ff00,
      transparent: true,
      opacity: 0.6,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Create Retro Tech Objects
    const techObjects: THREE.Group[] = [];

    // 1. Laptop Wireframe
    const laptopGroup = new THREE.Group();
    const baseGeo = new THREE.BoxGeometry(1.5, 0.1, 1);
    const edgesBase = new THREE.EdgesGeometry(baseGeo);
    const lineBase = new THREE.LineSegments(edgesBase, new THREE.LineBasicMaterial({ color: 0x00ffff }));
    laptopGroup.add(lineBase);

    const screenGeo = new THREE.BoxGeometry(1.5, 1, 0.1);
    const edgesScreen = new THREE.EdgesGeometry(screenGeo);
    const lineScreen = new THREE.LineSegments(edgesScreen, new THREE.LineBasicMaterial({ color: 0x00ffff }));
    lineScreen.position.set(0, 0.55, -0.5);
    lineScreen.rotation.x = 0.2;
    laptopGroup.add(lineScreen);

    laptopGroup.position.set(3, 1, -2);
    scene.add(laptopGroup);
    techObjects.push(laptopGroup);

    // 2. Retro Brick Phone
    const phoneGroup = new THREE.Group();
    const bodyGeo = new THREE.BoxGeometry(0.6, 1.8, 0.4);
    const edgesBody = new THREE.EdgesGeometry(bodyGeo);
    const lineBody = new THREE.LineSegments(edgesBody, new THREE.LineBasicMaterial({ color: 0xff00ff }));
    phoneGroup.add(lineBody);

    const antennaGeo = new THREE.BoxGeometry(0.1, 0.8, 0.1);
    const edgesAntenna = new THREE.EdgesGeometry(antennaGeo);
    const lineAntenna = new THREE.LineSegments(edgesAntenna, new THREE.LineBasicMaterial({ color: 0xff00ff }));
    lineAntenna.position.set(0.2, 1.2, 0);
    phoneGroup.add(lineAntenna);

    const phoneScreenGeo = new THREE.BoxGeometry(0.4, 0.4, 0.05);
    const edgesPhoneScreen = new THREE.EdgesGeometry(phoneScreenGeo);
    const linePhoneScreen = new THREE.LineSegments(edgesPhoneScreen, new THREE.LineBasicMaterial({ color: 0xff00ff }));
    linePhoneScreen.position.set(0, 0.4, 0.2);
    phoneGroup.add(linePhoneScreen);

    phoneGroup.position.set(-3, -1, -1);
    phoneGroup.rotation.z = 0.2;
    scene.add(phoneGroup);
    techObjects.push(phoneGroup);

    // 3. Old Desktop PC
    const pcGroup = new THREE.Group();

    const monitorGeo = new THREE.BoxGeometry(1.2, 1.0, 0.8);
    const edgesMonitor = new THREE.EdgesGeometry(monitorGeo);
    const lineMonitor = new THREE.LineSegments(edgesMonitor, new THREE.LineBasicMaterial({ color: 0x00ff00 }));
    lineMonitor.position.set(0, 0.5, 0);
    pcGroup.add(lineMonitor);

    const towerGeo = new THREE.BoxGeometry(1.4, 0.3, 1.2);
    const edgesTower = new THREE.EdgesGeometry(towerGeo);
    const lineTower = new THREE.LineSegments(edgesTower, new THREE.LineBasicMaterial({ color: 0x00ff00 }));
    lineTower.position.set(0, -0.2, 0);
    pcGroup.add(lineTower);

    const kbGeo = new THREE.BoxGeometry(1.4, 0.1, 0.6);
    const edgesKb = new THREE.EdgesGeometry(kbGeo);
    const lineKb = new THREE.LineSegments(edgesKb, new THREE.LineBasicMaterial({ color: 0x00ff00 }));
    lineKb.position.set(0, -0.3, 1);
    lineKb.rotation.x = 0.1;
    pcGroup.add(lineKb);

    pcGroup.position.set(0, 0, -1);
    pcGroup.rotation.y = -0.3;
    scene.add(pcGroup);
    techObjects.push(pcGroup);

    // Store refs
    sceneRef.current = {
      scene,
      camera,
      renderer,
      particles,
      techObjects,
      animationId: 0
    };

    // Animation loop
    const animate = () => {
      if (!sceneRef.current) return;

      sceneRef.current.animationId = requestAnimationFrame(animate);

      // Rotate particles slowly
      particles.rotation.y += 0.001;
      particles.rotation.x += 0.0005;

      // Rotate tech objects
      techObjects.forEach((obj, index) => {
        obj.rotation.y += 0.005 * (index % 2 === 0 ? 1 : -1);
        obj.rotation.x += 0.002;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Setup scroll interaction
    gsap.to(camera.position, {
      z: 2,
      y: -2,
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1
      }
    });

    techObjects.forEach((obj, i) => {
      gsap.to(obj.position, {
        y: obj.position.y + (i % 2 === 0 ? 2 : -2),
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 2
        }
      });
    });

    // Handle resize
    const handleResize = () => {
      if (!sceneRef.current) return;

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
        sceneRef.current.renderer.dispose();
      }
    };
  }, []);

  // Fallback CSS background when WebGL is not available
  if (!webGLSupported) {
    return (
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#181C22]">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #00ff00 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
