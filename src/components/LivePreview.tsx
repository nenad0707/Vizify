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

// Helper function to adjust color lightness
const adjustColor = (color: string, amount: number): string => {
  const clamp = (num: number) => Math.min(255, Math.max(0, num));
  const hex = color.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  const newR = clamp(r + amount);
  const newG = clamp(g + amount);
  const newB = clamp(b + amount);

  return `#${newR.toString(16).padStart(2, "0")}${newG
    .toString(16)
    .padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
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

  // Determine text style based on template (fixed colors per template)
  const getTextStyle = () => {
    switch (template) {
      case "modern":
        return {
          textColor: "#ffffff",
          secondaryColor: "rgba(255,255,255,0.8)",
          textShadow: "0 1px 2px rgba(0,0,0,0.3)",
        };
      case "classic":
        return {
          textColor: "#1a1a1a",
          secondaryColor: "rgba(0,0,0,0.7)",
          textShadow: "none",
        };
      case "minimalist":
      default:
        return {
          textColor: "#1a1a1a",
          secondaryColor: "rgba(0,0,0,0.7)",
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
        // Add modern elements with brand color influence
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

        // Modern decorative element influenced by brand color
        ctx.fillStyle = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(
          color.slice(3, 5),
          16,
        )}, ${parseInt(color.slice(5, 7), 16)}, 0.2)`;
        ctx.beginPath();
        ctx.arc(canvas.width - 100, 100, 80, 0, Math.PI * 2);
        ctx.fill();
        break;

      case "classic":
        // Add top border for classic design using brand color
        ctx.fillStyle = adjustColor(color, -40);
        ctx.fillRect(0, 0, canvas.width, 24);
        break;

      case "minimalist":
        // Add side accent for minimalist design using brand color
        ctx.fillStyle = adjustColor(color, 40);
        ctx.fillRect(0, 0, 20, canvas.height);
        break;
    }

    // Name - increased font size
    ctx.font = "bold 52px Inter, sans-serif";
    ctx.fillStyle = textStyle.textColor;

    // Add text shadow for better readability
    if (textStyle.textShadow !== "none") {
      ctx.shadowColor = "rgba(0, 0, 0, 3)";
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
        metalness: 0.2,
        roughness: 0.7,
      });

      // Apply color to texture with opacity for better visibility
      material.color = new THREE.Color(color);
      material.opacity = 0.95;

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
    const rect = (e.nativeEvent.target as HTMLElement).getBoundingClientRect();
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
    if (!meshRef.current) return;

    if (hovered && interactive) {
      // Calculate target rotation based on mouse position
      targetRotation.current.y = mousePosition.x * Math.PI * 0.1; // Slightly increased for better effect
      targetRotation.current.x = -mousePosition.y * Math.PI * 0.05; // Slightly increased for better effect

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
      // More noticeable idle animation
      const time = state.clock.getElapsedTime();

      // Enhanced subtle idle movement
      targetRotation.current.x = Math.sin(time * 0.3) * 0.03; // Increased amplitude
      targetRotation.current.y = Math.sin(time * 0.5) * 0.03; // Increased amplitude and different frequency

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
    const [imageLoaded, setImageLoaded] = useState(false);
    const [templateImage, setTemplateImage] = useState<string>("");
    const containerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
      // Load template background based on selected template
      const loadTemplateImage = async () => {
        try {
          // Correct template image naming
          const templateName =
            data.template === "minimalist" ? "minimalistic" : data.template;
          const imagePath = `/images/${templateName}.png`;
          setTemplateImage(imagePath);
          setImageLoaded(true);
        } catch (error) {
          console.error("Error loading template image:", error);
          setImageLoaded(false);
        }
      };

      loadTemplateImage();
    }, [data.template]);

    // Helper function to get template-specific styles with fixed text colors
    const getTemplateStyles = () => {
      switch (data.template) {
        case "modern":
          return {
            textColor: "#FFFFFF",
            secondaryColor: "rgba(255,255,255,0.9)",
            containerStyle: "bg-gradient-to-br",
            contentClass: "relative z-10",
            overlayStyle: `absolute inset-0 bg-gradient-to-br from-${data.color}/70 to-${data.color}/90`,
            backgroundOpacity: 0.95,
          };
        case "classic":
          return {
            textColor: "#1A1A1A",
            secondaryColor: "rgba(0,0,0,0.8)",
            containerStyle: "bg-white",
            contentClass: "relative z-10",
            overlayStyle: `absolute inset-0 bg-gradient-to-b from-transparent via-${data.color}/10 to-${data.color}/20`,
            backgroundOpacity: 0.85,
          };
        case "minimalist":
          return {
            textColor: "#1A1A1A",
            secondaryColor: "rgba(0,0,0,0.8)",
            containerStyle: "bg-white",
            contentClass: "relative z-10",
            overlayStyle: `absolute inset-0 bg-gradient-to-r from-${data.color}/5 to-${data.color}/10`,
            backgroundOpacity: 0.9,
          };
        default:
          return {
            textColor: "#FFFFFF",
            secondaryColor: "rgba(255,255,255,0.8)",
            containerStyle: "",
            contentClass: "",
            overlayStyle: "",
            backgroundOpacity: 1,
          };
      }
    };

    const templateStyles = getTemplateStyles();

    // Handle mouse move for 3D effect
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current || !interactive) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      setMousePosition({ x, y });
    };

    // Calculate the 3D transform style
    const get3DTransformStyle = () => {
      if (!isHovered || !interactive) return {};

      const rotateX = mousePosition.y * -10; // Inverse Y for natural movement
      const rotateY = mousePosition.x * 10;

      return {
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
        transition: "transform 0.1s ease",
      };
    };

    // Regular preview without Three.js (for faster rendering and better compatibility)
    return (
      <div
        ref={(node) => {
          // Merge refs
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
          (containerRef.current as HTMLDivElement | null) = node;
        }}
        className={cn(
          "relative w-full transform-gpu perspective-800",
          interactive && "cursor-pointer",
          className,
        )}
        style={{
          aspectRatio: "1.6",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={cn(
            "absolute inset-0 rounded-xl overflow-hidden premium-3d-card shadow-lg",
            templateStyles.containerStyle,
          )}
          style={{
            backgroundColor:
              data.template === "modern" ? data.color : "#ffffff",
            backgroundImage: imageLoaded ? `url(${templateImage})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode:
              data.template === "modern" ? "soft-light" : "normal",
            ...get3DTransformStyle(),
          }}
        >
          {/* Overlay for better text visibility, adapting to brand color */}
          <div
            className={templateStyles.overlayStyle}
            style={{
              background:
                data.template === "modern"
                  ? `linear-gradient(135deg, ${adjustColor(
                      data.color,
                      -20,
                    )}70, ${adjustColor(data.color, -80)}90)`
                  : data.template === "classic"
                  ? `linear-gradient(to bottom, ${adjustColor(
                      data.color,
                      60,
                    )}20, ${adjustColor(data.color, -20)}40)`
                  : data.template === "minimalist"
                  ? `linear-gradient(to right, ${adjustColor(
                      data.color,
                      70,
                    )}10, ${adjustColor(data.color, 30)}20)`
                  : undefined,
            }}
          />

          {/* Additional color layer for classic template */}
          {data.template === "classic" && (
            <div
              className="absolute top-0 left-0 right-0 h-8 z-10"
              style={{ backgroundColor: adjustColor(data.color, -40) }}
            />
          )}

          {/* Additional accent for minimalist template */}
          {data.template === "minimalist" && (
            <div
              className="absolute top-0 bottom-0 left-0 w-3 z-10"
              style={{ backgroundColor: adjustColor(data.color, 20) }}
            />
          )}

          <div
            className={cn(
              "premium-card-content relative h-full p-6 flex flex-col justify-between",
              templateStyles.contentClass,
            )}
          >
            {/* Main content */}
            <div>
              <h3
                className="premium-text text-2xl font-bold mb-1 drop-shadow-sm"
                style={{ color: templateStyles.textColor }}
              >
                {data.name || "Your Name"}
              </h3>
              <p
                className="premium-text text-lg drop-shadow-sm"
                style={{ color: templateStyles.secondaryColor }}
              >
                {data.title || "Your Title"}
              </p>
            </div>

            {/* Contact Information */}
            <div className="space-y-1">
              {data.email && (
                <p
                  className="premium-text text-sm flex items-center gap-2 drop-shadow-sm"
                  style={{ color: templateStyles.secondaryColor }}
                >
                  <span>✉</span> {data.email}
                </p>
              )}
              {data.phone && (
                <p
                  className="premium-text text-sm flex items-center gap-2 drop-shadow-sm"
                  style={{ color: templateStyles.secondaryColor }}
                >
                  <span>📱</span> {data.phone}
                </p>
              )}
              {data.company && (
                <p
                  className="premium-text text-sm flex items-center gap-2 drop-shadow-sm"
                  style={{ color: templateStyles.secondaryColor }}
                >
                  <span>🏢</span> {data.company}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

LivePreview.displayName = "LivePreview";

export default LivePreview;
