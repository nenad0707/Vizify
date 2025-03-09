"use client";

import { useRef, useState, useEffect, forwardRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture, ContactShadows, Environment } from "@react-three/drei";
import { Mesh } from "three";
import { motion } from "framer-motion-3d";
import { BusinessCardData } from "@/components/LivePreview";
import * as THREE from "three";

interface Card3DPreviewProps {
  data: BusinessCardData;
  interactive?: boolean;
}

function CardModel({ data, interactive }: Card3DPreviewProps) {
  const { name, title, email, phone, company, color, template } = data;
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Fix the template name to match image files
  const templateName = template === "minimalist" ? "minimalistic" : template;
  // Load image template as texture with proper error handling
  const texturePath = `/images/${templateName}.png`;

  // Pravilno korišćenje useTexture hook-a sa error handling-om
  const texture = useTexture(texturePath);

  // Log errors manually since we can't use callbacks with useTexture
  useEffect(() => {
    if (texture) {
      console.log(`Successfully loaded texture: ${texturePath}`);
    }
  }, [texture, texturePath]);

  // Create material with the template image
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    metalness: 0.1,
    roughness: 0.8,
  });

  // Apply a color overlay to the material
  useEffect(() => {
    if (material && material.map) {
      material.color = new THREE.Color(color);
      material.needsUpdate = true;
    }
  }, [color, material]);

  // Handle mouse interaction
  useFrame((state) => {
    if (!interactive || !meshRef.current) return;

    if (hovered) {
      // More pronounced rotation on hover
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        (state.mouse.x * Math.PI) / 8,
        0.1,
      );
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        (-state.mouse.y * Math.PI) / 10,
        0.1,
      );
    } else {
      // Subtle floating animation when not hovered
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05,
        0.1,
      );
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        Math.cos(state.clock.getElapsedTime() * 0.5) * 0.05,
        0.1,
      );
    }
  });

  // Create canvas for text rendering over texture
  useEffect(() => {
    if (!meshRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set text rendering based on template
    const textColor = template === "modern" ? "#FFFFFF" : "#000000";
    const secondaryTextColor =
      template === "modern" ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)";

    // Render name
    ctx.font = "bold 48px Inter, sans-serif";
    ctx.fillStyle = textColor;
    ctx.textAlign = "left";
    ctx.fillText(name || "Your Name", 80, 120);

    // Render title
    ctx.font = "32px Inter, sans-serif";
    ctx.fillStyle = secondaryTextColor;
    ctx.fillText(title || "Your Title", 80, 180);

    // Render contact info at bottom
    ctx.font = "24px Inter, sans-serif";
    let yPos = 460;
    if (email) {
      ctx.fillText(`✉ ${email}`, 80, yPos);
      yPos -= 35;
    }
    if (phone) {
      ctx.fillText(`📱 ${phone}`, 80, yPos);
      yPos -= 35;
    }
    if (company) {
      ctx.fillText(`🏢 ${company}`, 80, yPos);
    }

    // Apply canvas as texture
    const textTexture = new THREE.CanvasTexture(canvas);
    const textMaterial = new THREE.MeshBasicMaterial({
      map: textTexture,
      transparent: true,
      opacity: 0.9,
    });

    if (meshRef.current && Array.isArray(meshRef.current.material)) {
      // We apply the text as the second material in the group
      meshRef.current.material[1] = textMaterial;
    }
  }, [name, title, email, phone, company, template]);

  return (
    <motion.mesh
      ref={meshRef}
      position={[0, 0, 0]}
      scale={[3.4, 2, 0.05]} // Business card aspect ratio
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      animate={{
        y: hovered ? 0.1 : 0,
        scale: hovered ? [3.45, 2.05, 0.06] : [3.4, 2, 0.05],
        transition: { duration: 0.3 },
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial map={texture} color={color} />
    </motion.mesh>
  );
}

// Create a forwardRef wrapper for the component to accept refs from parent
const Card3DPreview = forwardRef<HTMLDivElement, Card3DPreviewProps>(
  ({ data, interactive = true }, ref) => {
    return (
      <div
        ref={ref}
        className="w-full h-full aspect-[1.7/1] rounded-lg overflow-hidden"
      >
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />

          <CardModel data={data} interactive={interactive} />

          <ContactShadows
            rotation={[Math.PI / 2, 0, 0]}
            position={[0, -2, 0]}
            opacity={0.4}
            width={10}
            height={10}
            blur={1.5}
            far={2}
          />
          <Environment preset="city" />
        </Canvas>
      </div>
    );
  },
);

Card3DPreview.displayName = "Card3DPreview";

export default Card3DPreview;
