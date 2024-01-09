import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import MouseAnalyst from "./routes/MouseAnalyst";
import KeyboardAnalyst from "./routes/KeyboardAnalyst";
import Dashboard from "./routes/Dashboard";
import NavBar from "./components/NavBar";
import MainBox from "./components/MainBox";
import Settings from "./routes/Settings";

function Layout() {
  return (
    <>
      <MainBox>
        <NavBar />
        <Outlet />
      </MainBox>
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/mouse",
        element: <MouseAnalyst />,
      },
      {
        path: "/keyboard",
        element: <KeyboardAnalyst />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
