import { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { Group } from "three";

interface ClothesProps {
  modelRef: React.RefObject<Group>;
  position?: [number, number, number];
  scale?: [number, number, number];
}
import clothes from '../assets/a_set_of_victorian_clothes.glb';

export function Clothes({ modelRef, position = [0, 0, 0], scale = [1, 1, 1] }: ClothesProps) {
  const clothesRef = useRef<Group>(null);
  const { scene: clothesScene } = useGLTF(clothes); 

  useEffect(() => {
    if (modelRef.current && clothesRef.current) {
      modelRef.current.add(clothesRef.current);

      clothesRef.current.position.set(...position);
      clothesRef.current.scale.set(...scale);
    }
  }, [modelRef, position, scale]);

  return <primitive object={clothesScene} ref={clothesRef} />;
}
