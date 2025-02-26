"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

interface FormData {
  name: string;
  title: string;
  color: string;
  template?: "modern" | "classic" | "minimalist";
}

interface CardProps {
  formData: FormData;
}

export default function RotatingCard({ formData }: CardProps) {
  const cardRef = useRef<THREE.Mesh>(null);
  
  useFrame((_, delta) => {
    if (cardRef.current) {
      cardRef.current.rotation.y += delta * 0.15;
    }
  });
  
  const getCardInfo = () => {
    const templates = {
      modern: {
        radius: 0.08,
        elevation: 0.03,
        namePos: [0, 0.5, 0.03],
        titlePos: [0, 0, 0.03],
        fontColor: "#ffffff",
        fontSize: 0.22,
        titleSize: 0.15,
        border: true,
      },
      classic: {
        radius: 0.03,
        elevation: 0.05,
        namePos: [0, 0.4, 0.03],
        titlePos: [0, -0.1, 0.03],
        fontColor: "#000000",
        fontSize: 0.2,
        titleSize: 0.13,
        border: false,
      },
      minimalist: {
        radius: 0.05,
        elevation: 0.02,
        namePos: [0, 0.3, 0.03],
        titlePos: [0, -0.2, 0.03],
        fontColor: "#333333",
        fontSize: 0.18,
        titleSize: 0.12,
        border: false,
      }
    };
    
    return templates[formData.template || 'modern'];
  };
  
  const cardInfo = getCardInfo();
  const cardColor = new THREE.Color(formData.color);
  const textColor = cardInfo.fontColor;
  
  return (
    <group ref={cardRef as any} scale={[1.5, 1.5, 1.5]}>
      <RoundedBox 
        args={[3.5, 2, cardInfo.elevation]} 
        radius={cardInfo.radius}
        smoothness={4}
      >
        <meshPhysicalMaterial 
          color={cardColor}
          metalness={0.2}
          roughness={0.3}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
          reflectivity={0.5}
        />
      </RoundedBox>
      
      {cardInfo.border && (
        <RoundedBox
          args={[3.52, 2.02, cardInfo.elevation + 0.01]}
          radius={cardInfo.radius + 0.01}
          smoothness={4}
        >
          <meshBasicMaterial color="#ffffff" wireframe={true} transparent opacity={0.15} />
        </RoundedBox>
      )}
      
      <Text
        position={cardInfo.namePos as [number, number, number]}
        fontSize={cardInfo.fontSize}
        color={textColor}
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
        maxWidth={3}
        textAlign="center"
      >
        {formData.name || "Your Name"}
      </Text>
      
      <Text
        position={cardInfo.titlePos as [number, number, number]}
        fontSize={cardInfo.titleSize}
        color={textColor}
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Regular.woff"
        maxWidth={3}
        textAlign="center"
      >
        {formData.title || "Your Title"}
      </Text>
    </group>
  );
}