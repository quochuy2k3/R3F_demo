
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { Group, Vector3, AnimationMixer, LoopRepeat, Mesh, MeshStandardMaterial, Object3D,  } from "three";
import { useLoader } from "@react-three/fiber";
import character from '../assets/character.glb'; // GLB file
import walkAnimation from '../assets/CharactreWalk.fbx'; 
import { useKeyboardControls } from "../hook/keyBoardCtrol";
// import tShirtPath from '../assets/OBJ.obj'; 
import tShirtPath from '../assets/t_shirt.glb';
import { OBJLoader } from "three/examples/jsm/Addons.js";

interface CharacterProps {
  useNewMaterial: boolean;
  changeOutfit: boolean;
}


export function Character({ useNewMaterial, changeOutfit }: CharacterProps) {
  const characterRef = useRef<Group>(null);
  const mixerRef = useRef<AnimationMixer | null>(null);
  const keys = useKeyboardControls();

  const { scene: tShirtModel } = useGLTF(tShirtPath);

  // Load models
  const { scene: maleScene } = useGLTF(character);
  // const tShirtModel = useLoader(OBJLoader, tShirtPath); 
  const { animations: characterWalk } = useFBX(walkAnimation);
  const { actions } = useAnimations(characterWalk, characterRef);
  const walkingAction = actions['mixamo.com'];

  useEffect(() => {
    if (characterRef.current && maleScene) {

     if (useNewMaterial) {
      maleScene.traverse((child) => {
        if (child instanceof Mesh) {
          if (child.name === 'Wolf3D_Outfit_Top') {
            child.material = new MeshStandardMaterial({ color: 0x00ff00 });
          }
        }
      });
    }else {  maleScene.traverse((child) => {
      if (child instanceof Mesh) {
        if (child.name === 'Wolf3D_Outfit_Top') {
          child.material = new MeshStandardMaterial({ color: 0xffffff });
        }
      }
    }); }


      // Option 2

      // Remove old outfit if needed
  if (changeOutfit) {
      const removeOutfits = (object: Object3D) => {
        object.children.forEach((child) => {
          if (child.name === 'Wolf3D_Outfit_Top') {
            object.remove(child);
          }
          if (child.children.length > 0) {
            removeOutfits(child);
          }
        });
      };
      removeOutfits(maleScene);
      
      // Add new T-shirt model to the character
      if (characterRef.current) {
        // tShirtModel.position.set(0, -0.4, 0); // Adjust position
        // tShirtModel.scale.set(3, 3, 3); // Adjust scale
        characterRef.current.add(tShirtModel);
      }
    }
    //take skeleton 
    // if (maleScene && tShirtModel) {
    //   const meshes: Mesh[] = [];
    //   tShirtModel.traverse((child) => {
    //     if ((child as Mesh).isMesh) {
    //       meshes.push(child as Mesh);
    //     }
    //   });
     
    //   //Merge all geometry
    //   const geometries = meshes.map(mesh => mesh.geometry);
    //   const mergedGeometry = mergeGeometries(geometries);
    //   const material = meshes.length > 0 ? meshes[0].material : new MeshStandardMaterial();
    //   const skinnedTShirt = new SkinnedMesh(mergedGeometry, material);
     
    //   //Add skeleton from maleScene to skinnedTShirt
    //   //Add skinnedTShirt to maleScene
    //   maleScene.traverse((child) => {
    //    if ((child as Mesh).isMesh && child.name === 'Wolf3D_Outfit_Top') {
    //   skinnedTShirt.skeleton = child.skeleton;
    //      maleScene.remove(child);
    //      skinnedTShirt.name = 'NewTShirtMeshName';
    //      console.log(skinnedTShirt.geometry);
    //      const mesh = child as Mesh;
    //      console.log(mesh.geometry);
        
    //    }
    //  });

      // Set up the animation mixer
      mixerRef.current = new AnimationMixer(maleScene);
    }
  }, [maleScene, tShirtModel,useNewMaterial,changeOutfit]);

  useFrame(({ camera, clock }) => {
    if (characterRef.current) {
      const speed = 0.06;
      const direction = new Vector3();
      characterRef.current.getWorldDirection(direction);
      const currentMoving = keys["KeyW"] || keys["KeyS"] || keys["KeyA"] || keys["KeyD"];

      // Adjust position and direction of the character
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

      // Update animation
      if (mixerRef.current) {
        mixerRef.current.update(clock.getDelta());
      }

      // Control walking animation
      if (walkingAction) {
        if (currentMoving) {
          walkingAction.play();
          walkingAction.loop = LoopRepeat;
          walkingAction.timeScale = 1; 
        } else {
          walkingAction.stop();
        }
      }
      // Update camera position

      // Look scene behind
      const cameraOffset = new Vector3(0, 2.5, -2); // Vị trí phía sau và trên cao của nhân vật
      const cameraPosition = characterRef.current.position.clone().add(cameraOffset.applyQuaternion(characterRef.current.quaternion));
      camera.position.lerp(cameraPosition, 0.1);


      // camera.position.lerp(
      //   new Vector3(characterRef.current.position.x, characterRef.current.position.y + 3, characterRef.current.position.z + 5),
      //   0.1
      // );
      
      camera.lookAt(characterRef.current.position);
    }
  });

  return (
    <>
      <primitive object={maleScene} ref={characterRef} position={[0, 0, 0]} scale={[1, 1, 1]} />
    </>
  );
}
