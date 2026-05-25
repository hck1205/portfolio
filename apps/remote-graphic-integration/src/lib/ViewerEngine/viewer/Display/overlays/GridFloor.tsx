import { Grid } from "@react-three/drei";

export function GridFloor() {
  return (
    <Grid
      cellColor="#c5cbd1"
      cellSize={0.5}
      fadeDistance={18}
      fadeStrength={1}
      infiniteGrid
      sectionColor="#8d98a3"
      sectionSize={2}
    />
  );
}
