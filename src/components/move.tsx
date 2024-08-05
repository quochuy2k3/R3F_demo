import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Vector3 } from 'three';

function MovableModel() {
  const { scene } = useGLTF('/path/to/your/model.glb');
  const modelRef = useRef<any>(null);
  const { camera } = useThree();
  const [move, setMove] = useState<Vector3>(new Vector3(0, 0, 0));

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      switch (event.key) {
        case 'w':
          setMove(prev => prev.add(new Vector3(0, 0, -0.1)));
          break;
        case 's':
          setMove(prev => prev.add(new Vector3(0, 0, 0.1)));
          break;
        case 'a':
          setMove(prev => prev.add(new Vector3(-0.1, 0, 0)));
          break;
        case 'd':
          setMove(prev => prev.add(new Vector3(0.1, 0, 0)));
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.position.copy(move);
    }
  });

  return <primitive ref={modelRef} object={scene} />;
}

export default MovableModel;
