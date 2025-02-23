"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import RotatingCard from "./RotatingCard";

interface FormData {
  name: string;
  title: string;
  color: string;
}

interface LivePreviewProps {
  formData: FormData;
}

export default function LivePreview({ formData }: LivePreviewProps) {
  return (
    <Canvas style={{ height: "100%", width: "100%" }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      <RotatingCard formData={formData} />

      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
