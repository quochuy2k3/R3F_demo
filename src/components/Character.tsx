import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { Group, Vector3, AnimationMixer, LoopRepeat, Mesh, MeshStandardMaterial } from "three";
import character from '../assets/character.glb';
import walkAnimation from '../assets/CharactreWalk.fbx'; 
import { useKeyboardControls } from "../hook/keyBoardCtrol";
import tShrit from '../assets/t_shirt.glb'
export function LowPolyMale() {
  const characterRef = useRef<Group>(null);
  const mixerRef = useRef<AnimationMixer | null>(null);
  const keys = useKeyboardControls();

  // get model
  const { scene: maleScene } = useGLTF(character);
  const { scene: tShirt } = useGLTF(tShrit);
  const { animations: characterWalk } = useFBX(walkAnimation);
  const { actions } = useAnimations(characterWalk, characterRef);
  const walkingAction = actions['mixamo.com'];

  useEffect(() => {
    if (characterRef.current && maleScene) {

      // Remove out fit
      // const removeOutfits = (object: any) => {
      //   object.children.forEach((child: any) => {
      //     if (child.name === 'Wolf3D_Outfit_Bottom' || child.name === 'Wolf3D_Outfit_Top') {
      //       object.remove(child);
      //     }
      //     if (child.children.length > 0) {
      //       removeOutfits(child);
      //     }
      //   });
      // };
      // removeOutfits(maleScene);
      // removeOutfits(maleScene);
      
      maleScene.traverse((child) => {
        if (child instanceof Mesh) {
          if (child.name === 'Wolf3D_Outfit_Bottom' || child.name === 'Wolf3D_Outfit_Top') {
            child.material = new MeshStandardMaterial({ color: 0xff0000 });
          }
        }
      });

      console.log(tShirt)
      console.log(maleScene.children);
            
      // New mixer for animation
      mixerRef.current = new AnimationMixer(maleScene);
    }
  }, [maleScene]);

  useFrame(({ camera, clock }) => {
    if (characterRef.current) {
      const speed = 0.06;
      const direction = new Vector3();
      characterRef.current.getWorldDirection(direction);
      const currentMoving = keys["KeyW"] || keys["KeyS"] || keys["KeyA"] || keys["KeyD"];

      // Điều chỉnh vị trí và hướng của nhân vật
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

      // Cập nhật hoạt ảnh
      if (mixerRef.current) {
        mixerRef.current.update(clock.getDelta());
      }

      // Điều chỉnh trạng thái hoạt ảnh dựa trên trạng thái di chuyển
      if (walkingAction) {
        if (currentMoving) {
          walkingAction.play();
          walkingAction.loop = LoopRepeat; 
          walkingAction.timeScale = 1; // Điều chỉnh tốc độ nếu cần
        } else {
          walkingAction.stop();
        }
      }

      // Look scene behind
      // const cameraOffset = new Vector3(0, 2, 5); // Vị trí phía sau và trên cao của nhân vật
      // const cameraPosition = modelRef.current.position.clone().add(cameraOffset.applyQuaternion(modelRef.current.quaternion));
      // camera.position.lerp(cameraPosition, 0.1);

      // New position of camera
      camera.position.lerp(
        new Vector3(characterRef.current.position.x, characterRef.current.position.y + 3, characterRef.current.position.z + 5),
        0.1
      );
      camera.lookAt(characterRef.current.position);
    }
  });

  return (
    <>
      <primitive object={maleScene} ref={characterRef} position={[0, 0, 0]} scale={[1, 1, 1]} />
    </>
  );
}
