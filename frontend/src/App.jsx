import React from "react";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import router from "./routes";
import "./App.css";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: 'Montserrat, system-ui, sans-serif',
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
