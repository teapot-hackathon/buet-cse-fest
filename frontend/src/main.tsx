import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";

const clerkFrontendApi =
  "pk_test_aGlwLXBhbnRoZXItMTUuY2xlcmsuYWNjb3VudHMuZGV2JA";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkFrontendApi}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/*"
            element={<App />}
          ></Route>
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
);
