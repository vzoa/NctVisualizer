import React from "react";
import "./index.css";
import Map from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export function App() {
  return (
    <div className="flex h-screen">
      <div className="bg-slate-900 p-4">
        <h1 className="text-white text-2xl">NCT Visualizer</h1>
      </div>
      <div className="grow">
        <div id="map" className="w-full h-full">
          <Map
            mapboxAccessToken="pk.eyJ1Ijoia2VuZ3JlaW0iLCJhIjoiY2x3MW15aGtzMGRuNzJrbHIybWNuM3BibyJ9.aMwzzc4Q0-bPHtWI-_MEQg"
            initialViewState={{
              latitude: 37.8,
              longitude: -121.4,
              zoom: 7.2,
            }}
            mapStyle="mapbox://styles/kengreim/clw1n6q6s01zr01q1evxbepei"
          />
        </div>
      </div>
    </div>
  );
}
