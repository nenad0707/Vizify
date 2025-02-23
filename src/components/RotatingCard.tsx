"use client";

import React from "react";
import { Text } from "@react-three/drei";

interface FormData {
  name: string;
  title: string;
  color: string;
}

interface CardProps {
  formData: FormData;
}

export default function CardMesh({ formData }: CardProps) {
  return (
    <group scale={[1.5, 1.5, 1.5]}>
      <mesh>
        <boxGeometry args={[3.5, 2, 0.05]} />
        <meshStandardMaterial color={formData.color || "white"} />
      </mesh>

      <Text
        position={[0, 0.4, 0.03]}
        fontSize={0.2}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {formData.name}
      </Text>

      <Text
        position={[0, -0.1, 0.03]}
        fontSize={0.15}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {formData.title}
      </Text>
    </group>
  );
}
