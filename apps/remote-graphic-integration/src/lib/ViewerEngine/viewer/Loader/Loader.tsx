import { Html, useProgress } from "@react-three/drei";

import styles from "./Loader.module.css";

export function Loader() {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className={styles.loading}>{Math.round(progress)}%</div>
    </Html>
  );
}
