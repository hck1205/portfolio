import type { AppProps } from "next/app";
import { useEffect } from "react";
import "@portfolio/shared/styles/reset.css";
import "@portfolio/remote-design-system/styles.css";
import "../styles/globals.css";

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    void import("@portfolio/remote-design-system/register");
  }, []);

  return <Component {...pageProps} />;
}

export default App;
