"use client";

import React from "react";
import { Canvas, ThreeElements } from "@react-three/fiber";
import { Group, Mesh } from "three";
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

      {/* Name text position */}
      <mesh position={[0, 0.5, 0.051]}>
        <planeGeometry args={[3.4, 0.5]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Title text position */}
      <mesh position={[0, -0.2, 0.051]}>
        <planeGeometry args={[3.4, 0.3]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}

// Add these type declarations to fix the TypeScript errors
declare module "@react-three/fiber" {
  interface ThreeElements {
    group: ThreeElements["mesh"];
    boxGeometry: any;
    meshBasicMaterial: any;
    planeGeometry: any;
  }
}
