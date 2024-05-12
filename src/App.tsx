import React from "react";
import "./index.css";

export function App() {
  return (
    <div className="flex h-screen">
      <div className="bg-slate-900 p-4">
        <h1 className="text-white text-2xl">NCT Visualizer</h1>
      </div>
      <div className="grow">
        <div id="map" className="w-full h-full"></div>
      </div>
    </div>
  );
}
