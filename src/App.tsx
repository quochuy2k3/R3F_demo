import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import SpinLoader from "./components/SpinLoader";
import { Character } from "./components/Character";
import { Experience } from "./components/Experience";

function App() {
  const [useNewMaterial, setUseNewMaterial] = useState(false);
  const [changeOutfit, setChangeOutfit] = useState(false); 

  const handleChangeColor = () => {
    setUseNewMaterial(!useNewMaterial);
    console.log(useNewMaterial);
    
  };

  // Hàm để thay đổi trang phục
  const handleChangeOutfit = () => {
    setChangeOutfit(prev => !prev);
  };
  return (
    <section className="w-full h-screen relative">
      <Canvas
        camera={{
          position: [5, 5, 10],  
          fov: 100,
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
        <Character useNewMaterial={useNewMaterial} changeOutfit={changeOutfit} />
          <Experience />
        </Suspense>
      </Canvas>
      <div className="absolute top-4 left-4 z-10">
        <button 
          onClick={handleChangeColor}
          className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
        >
          Change color
        </button>
        <button 
          onClick={handleChangeOutfit}
          className="bg-green-500 text-white py-2 px-4 rounded"
        >
          Change outfit
        </button>
      </div>
    </section>
  );
}

export default App;
