import { OrbitControls } from "@react-three/drei";

export const Experience = () => {
  return (
    <>
      <OrbitControls />
      <mesh position={[0, 1,-2]} >
        <boxGeometry />
        <meshNormalMaterial />
      </mesh>
    </>
  );
};