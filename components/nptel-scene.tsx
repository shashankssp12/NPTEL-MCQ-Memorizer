"use client";

import { useRef, useState, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";

// Use a custom hook to handle mobile detection to avoid hydration issues
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    );
  }, []);

  return isMobile;
};

interface BoxWithEdgesProps {
  position: [number, number, number];
  color?: string;
  onClick?: ((event?: THREE.Event) => void) | null;
  isClickable?: boolean;
}

const BoxWithEdges = ({
  position,
  color = "#0070f3",
  onClick = null,
  isClickable = false,
}: BoxWithEdgesProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  return (
    <group
      position={position}
      onClick={onClick as unknown as ((event: THREE.Event) => void) | undefined}
      onPointerOver={() => isClickable && setHovered(true)}
      onPointerOut={() => isClickable && setHovered(false)}
    >
      <mesh ref={meshRef}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshPhysicalMaterial
          color={hovered ? "#00a1ff" : color}
          roughness={0.1}
          metalness={0.8}
          transparent={true}
          opacity={0.9}
          transmission={0.5}
          clearcoat={1}
        />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(0.5, 0.5, 0.5)]} />
        <lineBasicMaterial
          color={hovered ? "#4db8ff" : "#214dbd"}
          linewidth={2}
        />
      </lineSegments>
    </group>
  );
};

interface BoxLetterProps {
  letter: string;
  position: [number, number, number];
  onClick?: (() => void) | null;
  isClickable?: boolean;
}

const BoxLetter = ({
  letter,
  position,
  onClick,
  isClickable = false,
}: BoxLetterProps) => {
  const group = useRef<THREE.Group>(null);
  const boxRefs = useRef<(THREE.Group | null)[]>([]);

  const getLetterShape = (letter: string) => {
    const shapes: Record<string, number[][]> = {
      N: [
        [1, 0, 0, 0, 1],
        [1, 1, 0, 0, 1],
        [1, 0, 1, 0, 1],
        [1, 0, 0, 1, 1],
        [1, 0, 0, 0, 1],
      ],
      P: [
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
        [1, 0, 0],
        [1, 0, 0],
      ],
      T: [
        [1, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
      ],
      E: [
        [1, 1, 1],
        [1, 0, 0],
        [1, 1, 0],
        [1, 0, 0],
        [1, 1, 1],
      ],
      L: [
        [1, 0, 0],
        [1, 0, 0],
        [1, 0, 0],
        [1, 0, 0],
        [1, 1, 1],
      ],
    };
    return shapes[letter] || shapes["N"]; // Default to 'N' if letter is not found
  };

  const letterShape = getLetterShape(letter);
  const boxes: { position: [number, number, number]; key: string }[] = [];

  letterShape.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell) {
        let xOffset = j * 0.5;

        if (letter === "N") {
          xOffset = j * 0.5 - 0.5;
        } else if (letter === "P") {
          xOffset = j * 0.5 - 0.5;
        } else if (letter === "T") {
          xOffset = j * 0.5 - 0.75;
        } else if (letter === "E") {
          xOffset = j * 0.5 - 0.5;
        } else if (letter === "L") {
          xOffset = j * 0.5 - 0.25;
        }

        boxes.push({
          position: [xOffset, (4 - i) * 0.5 - 1, 0],
          key: `${i}-${j}`,
        });
      }
    });
  });

  const explodeLetter = () => {
    if (onClick) {
      // Animate each box to fly away
      boxRefs.current.forEach((box, index) => {
        if (box) {
          const direction = new THREE.Vector3(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
          );

          gsap.to(box.position, {
            x: box.position.x + direction.x,
            y: box.position.y + direction.y,
            z: box.position.z + direction.z,
            duration: 1.5,
            ease: "power2.out",
          });

          gsap.to(box.rotation, {
            x: Math.random() * Math.PI * 2,
            y: Math.random() * Math.PI * 2,
            z: Math.random() * Math.PI * 2,
            duration: 1.5,
            ease: "power2.out",
          });
        }
      });

      // Call the onClick handler after a delay
      setTimeout(() => {
        onClick();
      }, 1000);
    }
  };

  return (
    <group ref={group} position={position}>
      {boxes.map((box, index) => {
        const ref = (el: THREE.Group | null) => {
          boxRefs.current[index] = el;
        };

        return (
          <group
            ref={ref}
            key={box.key}
            position={box.position as [number, number, number]}
          >
            <BoxWithEdges
              position={[0, 0, 0]}
              onClick={isClickable ? explodeLetter : null}
              isClickable={isClickable}
            />
          </group>
        );
      })}
    </group>
  );
};

interface NPTELSceneProps {
  onStartQuiz: () => void;
}

export function NPTELScene({ onStartQuiz }: NPTELSceneProps) {
  const orbitControlsRef = useRef<any>(null);
  const isMobileDevice = useIsMobile();
  const { camera } = useThree();

  useEffect(() => {
    // Animate camera to a better viewing position
    gsap.to(camera.position, {
      x: 0,
      y: 0,
      z: 15,
      duration: 2,
      ease: "power2.inOut",
    });
  }, [camera]);

  return (
    <>
      <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <BoxLetter
          letter="N"
          position={[-8, 0, 0]}
          isClickable={true}
          onClick={onStartQuiz}
        />
        <BoxLetter
          letter="P"
          position={[-4, 0, 0]}
          isClickable={true}
          onClick={onStartQuiz}
        />
        <BoxLetter
          letter="T"
          position={[0, 0, 0]}
          isClickable={true}
          onClick={onStartQuiz}
        />
        <BoxLetter
          letter="E"
          position={[4, 0, 0]}
          isClickable={true}
          onClick={onStartQuiz}
        />
        <BoxLetter
          letter="L"
          position={[8, 0, 0]}
          isClickable={true}
          onClick={onStartQuiz}
        />
      </group>

      <OrbitControls
        ref={orbitControlsRef}
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        autoRotate={true}
        autoRotateSpeed={1}
        minPolarAngle={Math.PI / 2 - 0.5}
        maxPolarAngle={Math.PI / 2 + 0.5}
      />

      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#ffffff" />

      <Environment
        files={
          isMobileDevice
            ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download3-7FArHVIJTFszlXm2045mQDPzsZqAyo.jpg"
            : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dither_it_M3_Drone_Shot_equirectangular-jpg_San_Francisco_Big_City_1287677938_12251179%20(1)-NY2qcmpjkyG6rDp1cPGIdX0bHk3hMR.jpg"
        }
        background
      />
    </>
  );
}
