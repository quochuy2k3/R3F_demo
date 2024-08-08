import { useGLTF } from '@react-three/drei';
import romanVsPersian from '../assets/Roman vs Persian.glb';

export const Experience = () => {
  const { scene } = useGLTF(romanVsPersian);

  return (
    <>
      <primitive object={scene} />
    </>
  );
};
