"use client";

import { forwardRef, useState, useRef, useEffect, Suspense } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { useTexture, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

export interface BusinessCardData {
  name?: string;
  title?: string;
  color: string;
  template: string;
  email?: string;
  phone?: string;
  company?: string;
  logo?: string;
}

interface LivePreviewProps {
  data: BusinessCardData;
  className?: string;
  interactive?: boolean;
}

// Helper function to determine if a color is light or dark
const isLightColor = (hexColor: string): boolean => {
  hexColor = hexColor.replace("#", "");
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5;
};

// Helper function to adjust color lightness
const adjustColor = (color: string, amount: number): string => {
  color = color.replace(/^#/, "");
  let r = parseInt(color.substring(0, 2), 16);
  let g = parseInt(color.substring(2, 4), 16);
  let b = parseInt(color.substring(4, 6), 16);
  r = Math.max(0, Math.min(255, r + amount));
  g = Math.max(0, Math.min(255, g + amount));
  b = Math.max(0, Math.min(255, b + amount));
  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

// 3D Card Component for React Three Fiber
function Card3D({
  data,
  interactive,
}: {
  data: BusinessCardData;
  interactive: boolean;
}) {
  const { name, title, email, phone, company, color, template } = data;

  // Reference to mesh
  const meshRef = useRef<THREE.Mesh>(null);

  // Get the correct template name for image path
  const templateName = template === "minimalist" ? "minimalistic" : template;

  // Load template texture
  const texture = useTexture(`/images/${templateName}.png`);

  // Improve texture quality
  useEffect(() => {
    if (texture) {
      texture.anisotropy = 16;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.needsUpdate = true;
    }
  }, [texture]);

  // Hover state and mouse position for rotation
  const [hovered, setHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Smoothing factor for rotation transitions - lower = smoother
  const smoothingFactor = 0.08;

  // Target rotation values to smooth transitions
  const targetRotation = useRef({ x: 0, y: 0 });

  // Current rotation values with smooth transitions
  const currentRotation = useRef({ x: 0, y: 0 });

  // Safe zone for mouse interaction to prevent jittering at edges
  const safeZoneMargin = 0.15; // 15% margin from edges

  // Determine text style based on template and color
  const getTextStyle = () => {
    const isLight = isLightColor(color);

    switch (template) {
      case "modern":
        return {
          textColor: "#ffffff",
          secondaryColor: "rgba(255,255,255,0.8)",
          textShadow: "0 1px 2px rgba(0,0,0,0.3)",
        };
      case "classic":
        return {
          textColor: isLight ? "#000000" : "#ffffff",
          secondaryColor: isLight ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.7)",
          textShadow: isLight ? "none" : "0 1px 2px rgba(0,0,0,0.3)",
        };
      case "minimalist":
      default:
        return {
          textColor: isLight ? "#000000" : "#ffffff",
          secondaryColor: isLight ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.7)",
          textShadow: "none",
        };
    }
  };

  // Create dynamic canvas texture for text rendering
  useEffect(() => {
    if (!meshRef.current) return;

    const textStyle = getTextStyle();

    // Create canvas for dynamic text
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Specialized drawing for different templates
    switch (template) {
      case "modern":
        // Add modern elements
        const gradient = ctx.createLinearGradient(
          0,
          0,
          canvas.width,
          canvas.height,
        );
        gradient.addColorStop(0, "rgba(255,255,255,0.15)");
        gradient.addColorStop(1, "rgba(0,0,0,0.15)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Modern decorative element
        ctx.fillStyle = "rgba(255,255,255,0.15)";
        ctx.beginPath();
        ctx.arc(canvas.width - 100, 100, 80, 0, Math.PI * 2);
        ctx.fill();
        break;

      case "classic":
        // Add top border for classic design
        ctx.fillStyle = adjustColor(color, -40);
        ctx.fillRect(0, 0, canvas.width, 24);
        break;

      case "minimalist":
        // Add side accent for minimalist design
        ctx.fillStyle = adjustColor(color, isLightColor(color) ? -40 : 40);
        ctx.fillRect(0, 0, 20, canvas.height);
        break;
    }

    // Name - increased font size
    ctx.font = "bold 52px Inter, sans-serif";
    ctx.fillStyle = textStyle.textColor;

    // Add text shadow for better readability
    if (textStyle.textShadow !== "none") {
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
    }

    // Draw name - display entered text or placeholder
    const displayName = name || "Your Name";
    ctx.fillText(displayName, template === "minimalist" ? 50 : 80, 120);

    // Reset shadow for other text
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Title
    ctx.font = "36px Inter, sans-serif";
    ctx.fillStyle = textStyle.secondaryColor;
    const displayTitle = title || "Your Title";
    ctx.fillText(displayTitle, template === "minimalist" ? 50 : 80, 180);

    // Contact information
    ctx.font = "24px Inter, sans-serif";
    let yPos = 460;

    if (company) {
      ctx.fillText(`🏢 ${company}`, template === "minimalist" ? 50 : 80, yPos);
      yPos -= 40;
    }

    if (email) {
      ctx.fillText(`✉ ${email}`, template === "minimalist" ? 50 : 80, yPos);
      yPos -= 40;
    }

    if (phone) {
      ctx.fillText(`📱 ${phone}`, template === "minimalist" ? 50 : 80, yPos);
    }

    // Convert canvas to texture
    const dynamicTexture = new THREE.CanvasTexture(canvas);
    dynamicTexture.needsUpdate = true;

    // Apply texture to material
    if (meshRef.current) {
      // Base material with template texture
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        metalness: 0.1,
        roughness: 0.7,
      });

      // Apply color to texture with opacity for better visibility
      material.color = new THREE.Color(color);
      material.opacity = 0.9;

      // Create text overlay material
      const textMaterial = new THREE.MeshBasicMaterial({
        map: dynamicTexture,
        transparent: true,
        opacity: 1.0,
      });

      // Apply materials
      if (Array.isArray(meshRef.current.material)) {
        meshRef.current.material[5] = textMaterial; // Front face

        // Set other sides
        for (let i = 0; i < 5; i++) {
          meshRef.current.material[i] = material;
        }
      } else {
        meshRef.current.material = [
          material, // left
          material, // right
          material, // top
          material, // bottom
          material, // back
          textMaterial, // front (with text)
        ];
      }
    }
  }, [name, title, email, phone, company, color, template]);

  // Handle pointer movement within safe zone to prevent edge jittering
  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!interactive) return;

    // Convert pointer position to normalized range [-1, 1]
    const rect = e.nativeEvent.target.getBoundingClientRect();
    let x = ((e.nativeEvent.clientX - rect.left) / rect.width) * 2 - 1;
    let y = ((e.nativeEvent.clientY - rect.top) / rect.height) * 2 - 1;

    // Calculate distance from edge
    const distFromEdgeX = Math.min(1 - Math.abs(x), 1);
    const distFromEdgeY = Math.min(1 - Math.abs(y), 1);

    // If near edge, gradually reduce effect (smooth transition to edge)
    if (distFromEdgeX < safeZoneMargin) {
      // Reduce x rotation effect near horizontal edges
      const factor = distFromEdgeX / safeZoneMargin;
      x *= factor;
    }

    if (distFromEdgeY < safeZoneMargin) {
      // Reduce y rotation effect near vertical edges
      const factor = distFromEdgeY / safeZoneMargin;
      y *= factor;
    }

    // Store safe mouse position
    setMousePosition({ x, y });
  };

  // Handle card rotation with smooth transitions
  useFrame((state) => {
    if (!meshRef.current || !interactive) return;

    if (hovered) {
      // Calculate target rotation based on mouse position
      targetRotation.current.y = mousePosition.x * Math.PI * 0.08; // Reduced for smoother movement
      targetRotation.current.x = -mousePosition.y * Math.PI * 0.04; // Reduced for smoother movement

      // Apply smooth interpolation to current rotation
      currentRotation.current.x = THREE.MathUtils.lerp(
        currentRotation.current.x,
        targetRotation.current.x,
        smoothingFactor,
      );
      currentRotation.current.y = THREE.MathUtils.lerp(
        currentRotation.current.y,
        targetRotation.current.y,
        smoothingFactor,
      );
    } else {
      // Subtle idle animation when not hovered
      const time = state.clock.getElapsedTime();

      // Very subtle idle movement
      targetRotation.current.x = Math.sin(time * 0.3) * 0.01;
      targetRotation.current.y = Math.sin(time * 0.4) * 0.01;

      // Apply even smoother interpolation for idle movement
      currentRotation.current.x = THREE.MathUtils.lerp(
        currentRotation.current.x,
        targetRotation.current.x,
        0.02, // Very slow return to idle
      );
      currentRotation.current.y = THREE.MathUtils.lerp(
        currentRotation.current.y,
        targetRotation.current.y,
        0.02, // Very slow return to idle
      );
    }

    // Apply rotation
    meshRef.current.rotation.x = currentRotation.current.x;
    meshRef.current.rotation.y = currentRotation.current.y;
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        setHovered(true);
        handlePointerMove(e);
      }}
      onPointerMove={handlePointerMove}
      onPointerOut={() => setHovered(false)}
      scale={[1.7, 1, 0.07]} // Business card proportions
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      {/* Materials are set in the useEffect */}
    </mesh>
  );
}

// Main LivePreview component with 3D canvas
export const LivePreview = forwardRef<HTMLDivElement, LivePreviewProps>(
  ({ data, className, interactive = true }, ref) => {
    const [isMounted, setIsMounted] = useState(false);

    // Handle client-side mounting for React Three Fiber
    useEffect(() => {
      setIsMounted(true);
    }, []);

    // Return loader while component is mounting
    if (!isMounted) {
      return (
        <div
          ref={ref}
          className={cn("w-full max-w-md mx-auto aspect-[1.7/1]", className)}
        >
          <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-lg">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "w-full max-w-md mx-auto aspect-[1.7/1] business-card premium-3d-card",
          className,
        )}
      >
        <Canvas
          camera={{ position: [0, 0, 2], fov: 35 }}
          dpr={[1, 2]} // Improved DPI for sharper rendering
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.7} />
          <spotLight
            position={[5, 5, 10]}
            angle={0.15}
            penumbra={1}
            intensity={0.8}
            castShadow
          />
          <pointLight position={[-10, -10, -10]} intensity={0.3} />

          <Suspense fallback={null}>
            <Card3D data={data} interactive={interactive} />
            <ContactShadows
              position={[0, -0.5, 0]}
              opacity={0.4}
              scale={3}
              blur={1.5}
              far={0.5}
            />
            <Environment preset="city" />
          </Suspense>
        </Canvas>

        {/* Elegant shadow under card */}
        {interactive && (
          <div
            className="absolute mt-4 left-0 right-0 h-[16px] opacity-25 blur-sm"
            style={{
              background: `linear-gradient(to bottom, ${data.color}, transparent)`,
              borderRadius: "50%",
              width: "90%",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />
        )}
      </div>
    );
  },
);

LivePreview.displayName = "LivePreview";

export default LivePreview;
