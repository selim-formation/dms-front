/**
 * Application entry point
 * Sets up React with all providers
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppProviders } from "./core/providers/AppProviders";
import App from "./App.tsx";
import { applyColorPalette } from "./core/theme/applyColorPalette";
import { applyInitialTheme } from "./core/theme/applyInitialTheme";
import { applyInitialDirection } from "./core/i18n/applyInitialDirection";
import "./index.css";

applyColorPalette();
applyInitialTheme();
applyInitialDirection();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);
