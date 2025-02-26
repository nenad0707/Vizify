"use client";

import React from "react";
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
  // Create a very simple card
  return (
    <group>
      {/* Basic card body - simple colored rectangle */}
      <mesh>
        <boxGeometry args={[3.5, 2, 0.1]} />
        <meshBasicMaterial color={formData.color} />
      </mesh>

      {/* Name text - using HTML instead of Three.js */}
      <mesh position={[0, 0.5, 0.051]}>
        <planeGeometry args={[3.4, 0.5]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Title text - using HTML instead of Three.js */}
      <mesh position={[0, -0.2, 0.051]}>
        <planeGeometry args={[3.4, 0.3]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}
