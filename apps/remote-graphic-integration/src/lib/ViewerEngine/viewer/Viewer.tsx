import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Bounds, Environment, Grid, OrbitControls } from "@react-three/drei";
import { MOUSE } from "three";

import { EmptyModel } from "./EmptyModel";
import { Loader } from "./Loader";
import { Model } from "./Model";
import styles from "./Viewer.module.css";
import type { ViewerProps } from "./Viewer.types";

export function Viewer({
  autoRotate = false,
  canZoom = true,
  className,
  materialTint = "#ffffff",
  modelUrl,
  showEnvironment = true,
  showGrid = true,
  useDamping = true
}: ViewerProps) {
  const rootClassName = className
    ? `${styles.viewer} ${className}`
    : styles.viewer;

  return (
    <section className={rootClassName}>
      <Canvas
        className={styles.canvas}
        camera={{ fov: 45, position: [3, 2, 4] }}
        dpr={[1, 2]}
      >
        <color args={["#f4f5f6"]} attach="background" />
        <ambientLight intensity={0.8} />
        <directionalLight intensity={2} position={[4, 6, 5]} />
        <Suspense fallback={<Loader />}>
          {modelUrl ? (
            <Bounds fit clip observe margin={1.2}>
              <Model materialTint={materialTint} modelUrl={modelUrl} />
            </Bounds>
          ) : (
            <EmptyModel />
          )}
          {showEnvironment ? <Environment preset="city" /> : null}
          {showGrid ? (
            <Grid
              cellColor="#c5cbd1"
              cellSize={0.5}
              fadeDistance={18}
              fadeStrength={1}
              infiniteGrid
              sectionColor="#8d98a3"
              sectionSize={2}
            />
          ) : null}
        </Suspense>
        <OrbitControls
          makeDefault
          autoRotate={autoRotate}
          dampingFactor={0.08}
          enableZoom={canZoom}
          enableDamping={useDamping}
          mouseButtons={{
            LEFT: MOUSE.PAN,
            MIDDLE: MOUSE.DOLLY,
            RIGHT: MOUSE.ROTATE
          }}
        />
      </Canvas>
    </section>
  );
}
