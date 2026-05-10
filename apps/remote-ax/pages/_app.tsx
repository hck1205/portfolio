import type { AppProps } from "next/app";
import "@portfolio/shared/styles/reset.css";
import "@portfolio/remote-design-system/styles.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
