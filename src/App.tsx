import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import SpinLoader from "./components/SpinLoader";
import { LowPolyMale } from "./components/Character";
import { Experience } from "./components/Experience";

function App() {
  return (
    <section className="w-full h-screen relative">
      <Canvas
        camera={{
          position: [5, 5, 10],  
          fov: 60,
        }}
      >
        <color attach="background" args={["#c3b7b7"]} />
        <Suspense fallback={<SpinLoader />}>
          <directionalLight position={[1, 1, 1]} intensity={1} />
          <ambientLight intensity={2} />
          <pointLight position={[10, 5, 10]} intensity={1} />
          <spotLight
            position={[0, 50, 10]}
            angle={0.15}
            penumbra={1}
            intensity={2}
          />
          <LowPolyMale />
          <Experience />
        </Suspense>
      </Canvas>
    </section>
  );
}

export default App;
