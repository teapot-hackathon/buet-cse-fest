import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Explore from "./components/Explore";
import { SignIn, SignUp } from "@clerk/clerk-react";
import Header from "./components/Header";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import Itinerary from "./Itinerary/Itinerary";
import Photos from "./components/Photos";
import ItiMap from "./components/ItiMap";
import Blog from "./components/Blog";

function App() {
  return (
    <>
      <Sidebar />
      <Header />
      <Routes>
        <Route
          path=""
          element={<Layout />}
        >
          <Route
            path=""
            element={<Home />}
          >
            <Route
              path="/explore"
              element={<Explore />}
            />
            <Route
              path="/signup"
              element={<Signup />}
            />
            <Route
              path="/login"
              element={<Login />}
            />
            <Route
              path="/itinerary"
              element={<Itinerary />}
            />
            <Route
              path="/photos"
              element={<Photos />}
            />
            <Route
              path="/itinerary-map"
              element={<ItiMap />}
            />
            <Route
              path="/blog"
              element={<Blog />}
            />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
