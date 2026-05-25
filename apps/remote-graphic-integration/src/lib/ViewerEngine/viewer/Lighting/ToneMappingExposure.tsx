import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

type ToneMappingExposureProps = {
  exposure: number;
};

export function ToneMappingExposure({ exposure }: ToneMappingExposureProps) {
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const previousExposure = gl.toneMappingExposure;

    gl.toneMappingExposure = exposure;

    return () => {
      gl.toneMappingExposure = previousExposure;
    };
  }, [exposure, gl]);

  return null;
}
