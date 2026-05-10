import { Html } from "@react-three/drei";

import styles from "./EmptyModel.module.css";

export function EmptyModel() {
  return (
    <Html center>
      <div className={styles.emptyState}>GLB model source required</div>
    </Html>
  );
}
