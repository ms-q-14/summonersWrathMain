import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Deck, DivineIntervention, Home, Login, Packs } from "./pages";
import { Footer, Navbar } from "./components";
import "./index.css";

const Layout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Login /> },
      { path: "/home", element: <Home /> },
      { path: "/packs", element: <Packs /> },
      { path: "/deck", element: <Deck /> },
      { path: "/divine-intervention", element: <DivineIntervention /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
