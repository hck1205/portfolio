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
  className,
  modelUrl,
  showGrid = true
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
              <Model modelUrl={modelUrl} />
            </Bounds>
          ) : (
            <EmptyModel />
          )}
          <Environment preset="city" />
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
          dampingFactor={0.08}
          enableDamping
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
