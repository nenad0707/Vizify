"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";

interface FormData {
  name: string;
  title: string;
  color: string;
}

interface RotatingCardProps {
  formData: FormData;
}

export default function RotatingCard({ formData }: RotatingCardProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <boxGeometry args={[2, 3, 0.1]} />
        <meshStandardMaterial color={formData.color || "white"} />
      </mesh>

      <Text
        position={[0, 0.5, 0.06]}
        fontSize={0.3}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {formData.name}
      </Text>

      <Text
        position={[0, -0.2, 0.06]}
        fontSize={0.2}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {formData.title}
      </Text>
    </group>
  );
}
