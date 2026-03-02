import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

if ("serviceWorker" in navigator) {
  const isPreviewOrLocalhost =
    window.location.hostname.includes("lovableproject.com") ||
    window.location.hostname.includes("localhost");

  if (isPreviewOrLocalhost) {
    window.addEventListener("load", async () => {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));

      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      }
    });
  }
}

createRoot(document.getElementById("root")!).render(<App />);
