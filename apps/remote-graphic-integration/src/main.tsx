import { createRoot } from "react-dom/client";

import "@portfolio/shared/styles/reset.css";
import "@portfolio/remote-design-system/styles.css";
import "@portfolio/remote-design-system/register";

import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <App />
);
