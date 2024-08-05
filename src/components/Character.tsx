// import { useRef, useEffect, useState } from "react";
// import { useFrame } from "@react-three/fiber";
// import { useGLTF, useAnimations } from "@react-three/drei";
// import { Group, Vector3 } from "three";
// import lowPolyMale from '../assets/low_poly_male.glb';
// import { useKeyboardControls } from "../hook/keyBoardCtrol";
// import * as THREE from 'three';

// export function LowPolyMale() {
//   const modelRef = useRef<Group>(null);
//   const keys = useKeyboardControls();
//   const { scene, animations } = useGLTF(lowPolyMale);
//   const { actions } = useAnimations(animations, modelRef);

  
//   const walkingAction = actions['walking'];

  

//   useFrame(({ camera }) => {
//     // Take the pressKey 
//     if (modelRef.current) {
//       const speed = 0.06;
//       const direction = new Vector3();
//       modelRef.current.getWorldDirection(direction);

//       const currentMoving = keys["KeyW"] || keys["KeyS"] || keys["KeyA"] || keys["KeyD"] 

//       if (keys["KeyW"]) {
//         modelRef.current.position.add(direction.multiplyScalar(speed));
//       }
//       if (keys["KeyS"]) {
//         modelRef.current.position.sub(direction.multiplyScalar(speed));
//       }
//       if (keys["KeyA"]) {
//         modelRef.current.rotation.y += 0.05;
//       }
//       if (keys["KeyD"]) {
//         modelRef.current.rotation.y -= 0.05;
//       }
//       // UnPress to stop
//       if (currentMoving &&  walkingAction) {
//         walkingAction.play();
//       } else if (!currentMoving  && walkingAction) {
//         walkingAction.stop(); 
//       }

//       // Cập nhật vị trí camera 
//       camera.position.lerp(
//         new Vector3(modelRef.current.position.x, modelRef.current.position.y + 2, modelRef.current.position.z + 5),
//         0.1
//       );
//       camera.lookAt(modelRef.current.position);

//       // Look scene behind
//       // const cameraOffset = new Vector3(0, 2, 5); // Vị trí phía sau và trên cao của nhân vật
//       // const cameraPosition = modelRef.current.position.clone().add(cameraOffset.applyQuaternion(modelRef.current.quaternion));

//       // camera.position.lerp(cameraPosition, 0.1);
//       // camera.lookAt(modelRef.current.position);
//     }
//   });

//   return (
//     <>
//       <primitive object={scene} ref={modelRef} position={[0, 0, 0]} scale={[0.4, 0.4, 0.4]} />
//     </>
//   );
// }
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { Group, Vector3 } from "three";
import character from '../assets/character.glb';
import { useKeyboardControls } from "../hook/keyBoardCtrol";
import { Clothes } from "./Clothes";

export function LowPolyMale() {
  const characterRef = useRef<Group>(null);
  const keys = useKeyboardControls();
  
  // Tải mô hình nhân vật và trang phục
  const { scene: maleScene, animations } = useGLTF(character);

  // Lấy các hành động hoạt ảnh từ mô hình nhân vật
  const { actions } = useAnimations(animations, characterRef);
  const walkingAction = actions['walking'];

  useFrame(({ camera }) => {
    if (characterRef.current) {
      const speed = 0.06;
      const direction = new Vector3();
      characterRef.current.getWorldDirection(direction);

      const currentMoving = keys["KeyW"] || keys["KeyS"] || keys["KeyA"] || keys["KeyD"];

      if (keys["KeyW"]) {
        characterRef.current.position.add(direction.multiplyScalar(speed));
      }
      if (keys["KeyS"]) {
        characterRef.current.position.sub(direction.multiplyScalar(speed));
      }
      if (keys["KeyA"]) {
        characterRef.current.rotation.y += 0.05;
      }
      if (keys["KeyD"]) {
        characterRef.current.rotation.y -= 0.05;
      }

      if (currentMoving && walkingAction) {
        walkingAction.play();
      } else if (!currentMoving && walkingAction) {
        walkingAction.stop();
      }

      // Cập nhật vị trí camera 
      camera.position.lerp(
        new Vector3(characterRef.current.position.x, characterRef.current.position.y + 3, characterRef.current.position.z + 5),
        0.1
      );
      camera.lookAt(characterRef.current.position);
    }
  });

  return (
    <>
      <primitive object={maleScene} ref={characterRef} position={[0, 0, 0]} scale={[1,1,1]} />
      {/* <Clothes
        modelRef={characterRef}
        position={[0, 0, 0]}  // Ví dụ về vị trí của trang phục
        scale={[3 , 1.78, 3]}    // Ví dụ về kích thước của trang phục
      /> */}
    </>
  );
}
