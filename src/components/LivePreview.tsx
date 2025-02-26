"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Float, PresentationControls } from "@react-three/drei";
import { Loader2 } from "lucide-react";
import RotatingCard from "./RotatingCard";

interface FormData {
  name: string;
  title: string;
  color: string;
  template?: "modern" | "classic" | "minimalist";
}

interface LivePreviewProps {
  formData: FormData;
}

function Fallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-muted/30">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

export default function LivePreview({ formData }: LivePreviewProps) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ height: "100%", width: "100%" }}
      className="bg-transparent"
    >
      <color attach="background" args={["transparent"]} />
      
      <PresentationControls
        global
        zoom={0.8}
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 4, Math.PI / 4]}
        azimuth={[-Math.PI / 4, Math.PI / 4]}
      >
        <Float
          speed={2}
          rotationIntensity={0.5}
          floatIntensity={0.5}
        >
          <Suspense fallback={null}>
            <RotatingCard formData={formData} />
            <ContactShadows 
              position={[0, -1.5, 0]} 
              opacity={0.6} 
              scale={5} 
              blur={2.5} 
            />
          </Suspense>
        </Float>
      </PresentationControls>
      
      <Environment preset="city" />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
    </Canvas>
  );
}