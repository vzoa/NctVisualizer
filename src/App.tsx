import { Component, createSignal } from "solid-js";
import MapGL, { Layer, Source, Viewport } from "solid-map-gl";
import StyledCheckbox from "./StyledCheckbox";

import "mapbox-gl/dist/mapbox-gl.css";

const App: Component = () => {
  const [viewport, setViewport] = createSignal({
    center: [-121.4, 37.8],
    zoom: 7,
  } as Viewport);

  const [checked, setChecked] = createSignal(false);

  const [mapStyle, setMapStyle] = createSignal(
    "mapbox://styles/mapbox/light-v11"
  );

  return (
    <div class="flex h-screen">
      <div class="flex flex-col bg-slate-900 p-4 space-y-4">
        <h1 class="text-white text-2xl">NCT Visualizer</h1>
        <div>
          <h2 class="text-white text-xl">Style</h2>
          <select onChange={(e) => setMapStyle(e.target.value)}>
            <option value="mapbox://styles/mapbox/empty-v9">Blank</option>
            <option value="mapbox://styles/mapbox/light-v11">
              World Light
            </option>
          </select>
        </div>
        <div>
          <h2 class="text-white text-xl mb-2">Base Map</h2>
          <div class="flex flex-col space-y-1">
            <StyledCheckbox
              label="LO W-S"
              checked={checked}
              onChange={setChecked}
            />
            <StyledCheckbox
              label="HI W-S"
              checked={checked}
              onChange={setChecked}
            />
            <StyledCheckbox
              label="LO E-N"
              checked={checked}
              onChange={setChecked}
            />
            <StyledCheckbox
              label="HI E-N"
              checked={checked}
              onChange={setChecked}
            />
          </div>
        </div>
        <div>
          <h2 class="text-white text-xl">Sectors</h2>
        </div>
      </div>
      <div class="grow">
        <MapGL
          options={{
            accessToken:
              "pk.eyJ1Ijoia2VuZ3JlaW0iLCJhIjoiY2x3MW15aGtzMGRuNzJrbHIybWNuM3BibyJ9.aMwzzc4Q0-bPHtWI-_MEQg",
            style: mapStyle(),
          }}
          viewport={viewport()}
          onViewportChange={(evt: Viewport) => setViewport(evt)}
          class="h-full w-full"
        ></MapGL>
      </div>
    </div>
  );
};

export default App;
