import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import "./index.css";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export function App() {
  const map = useRef<mapboxgl.Map>();
  const [mapStyleLayers, setMapStyleLayers] = useState<mapboxgl.AnyLayer[]>();

  const default_basemap_layers = new Map([
    ["LO W-S", true],
    ["HI W-S", false],
    ["LO E-N", false],
    ["HI E-N", false],
  ]);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      accessToken:
        "pk.eyJ1Ijoia2VuZ3JlaW0iLCJhIjoiY2x3MW15aGtzMGRuNzJrbHIybWNuM3BibyJ9.aMwzzc4Q0-bPHtWI-_MEQg",
      container: "map",
      style: "mapbox://styles/kengreim/clw1n6q6s01zr01q1evxbepei",
      center: [-121.4, 37.8],
      zoom: 7.2,
    });

    map.current.on("style.load", () => {
      setMapStyleLayers(map.current!.getStyle().layers);
    });

    map.current.on("load", () => {
      console.log("loaded");
      default_basemap_layers.forEach((isVisible, id) => {
        map.current!.setLayoutProperty(
          id,
          "visibility",
          isVisible ? "visible" : "none"
        );
      });
    });
  });

  function toggleLayerVisibility(e: ChangeEvent<HTMLInputElement>) {
    if (!map.current) return;
    let id = e.target.id.replace("checkbox-", "");
    map.current.setLayoutProperty(
      id,
      "visibility",
      e.target.checked ? "visible" : "none"
    );
  }

  return (
    <div className="flex h-screen">
      <div className="bg-slate-900 p-4 flex-row space-y-4">
        <h1 className="text-white text-2xl">NCT Visualizer</h1>
        <div>
          <h2 className="text-white text-xl">Base Maps</h2>
          {mapStyleLayers?.map(
            (layer) =>
              default_basemap_layers.has(layer.id) && (
                <div>
                  <input
                    type="checkbox"
                    id={"checkbox-" + layer.id}
                    key={layer.id}
                    onChange={toggleLayerVisibility}
                    defaultChecked={default_basemap_layers
                      .get(layer.id)
                      ?.valueOf()}
                  />
                  <label
                    htmlFor={"checkbox-" + layer.id}
                    className="text-white ml-2"
                  >
                    {layer.id}
                  </label>
                </div>
              )
          )}
        </div>
        <div>
          <h2 className="text-white text-xl">Sectors</h2>
        </div>
      </div>
      <div className="grow">
        <div id="map" className="w-full h-full" />
      </div>
    </div>
  );
}
