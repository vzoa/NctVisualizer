import { Component, createSignal, Show } from "solid-js";
import MapGL, { Layer, Source, Viewport } from "solid-map-gl";
import { Checkbox } from "./components/Checkbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { DEFAULT_MAP_STYLE, MapStyleSelector } from "./MapStyleSelector";

const App: Component = () => {
  const [viewport, setViewport] = createSignal({
    center: [-121.4, 37.8],
    zoom: 7,
  } as Viewport);

  const [checked, setChecked] = createSignal(false);

  const [mapStyle, setMapStyle] = createSignal(DEFAULT_MAP_STYLE);

  const [loW, setLoW] = createSignal<boolean>(true);
  const [hiW, setHiW] = createSignal<boolean>();
  const [loE, setLoE] = createSignal<boolean>();
  const [hiE, setHiE] = createSignal<boolean>();

  return (
    <div class="flex h-screen">
      <div class="flex flex-col bg-slate-900 p-4 space-y-4">
        <h1 class="text-white text-2xl">NCT Visualizer</h1>
        <div>
          <h2 class="text-white text-xl mb-1">Style</h2>
          <div class="flex flex-col space-y-1">
            <MapStyleSelector style={mapStyle} setStyle={setMapStyle} />
          </div>
        </div>
        <div>
          <h2 class="text-white text-xl mb-2">Base Map</h2>
          <div class="flex flex-col space-y-1">
            <Checkbox label="LO W-S" checked={loW()} onChange={setLoW} />
            <Checkbox label="HI W-S" checked={hiW()} onChange={setHiW} />
            <Checkbox label="LO E-N" checked={loE()} onChange={setLoE} />
            <Checkbox label="HI E-N" checked={hiE()} onChange={setHiE} />
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
            style: mapStyle().value,
          }}
          viewport={viewport()}
          onViewportChange={(evt: Viewport) => setViewport(evt)}
          class="h-full w-full"
          debug={true}
        >
          {/*LO W-S*/}
          <Source
            source={{
              type: "vector",
              url: "mapbox://kengreim.4525vady",
            }}
          >
            <Layer
              style={{
                "source-layer": "01GE9SE1H343T0ZZQ6DP787MKV-2yipi9",
                type: "line",
              }}
              visible={loW()}
            />
          </Source>

          {/*HI W-S*/}
          <Source
            source={{
              type: "vector",
              url: "mapbox://kengreim.06318cwy",
            }}
          >
            <Show when={typeof hiW() != "undefined"}>
              <Layer
                style={{
                  "source-layer": "3_HI-W-536qzx",
                  type: "line",
                }}
                visible={hiW()}
              />
            </Show>
          </Source>

          {/*LO E-N*/}
          <Source
            source={{
              type: "vector",
              url: "mapbox://kengreim.24hjuu7e",
            }}
          >
            <Show when={typeof loE() != "undefined"}>
              <Layer
                style={{
                  "source-layer": "2_LO-E-68fxnv",
                  type: "line",
                }}
                visible={loE()}
              />
            </Show>
          </Source>

          {/*HI E-N*/}
          <Source
            source={{
              type: "vector",
              url: "mapbox://kengreim.1pttoy8k",
            }}
          >
            <Show when={typeof hiE() != "undefined"}>
              <Layer
                style={{
                  "source-layer": "4_HI-E-ddd7d9",
                  type: "line",
                }}
                visible={hiE()}
              />
            </Show>
          </Source>
        </MapGL>
      </div>
    </div>
  );
};

export default App;
