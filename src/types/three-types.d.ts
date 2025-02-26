import { Canvas, ThreeElements } from "@react-three/fiber";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      boxGeometry: any;
      meshBasicMaterial: any;
      planeGeometry: any;
      meshPhysicalMaterial: any;
      meshStandardMaterial: any;
    }
  }
}
