import { Component, createSignal, For, Show } from "solid-js";
import MapGL, { Layer, Source, Viewport } from "solid-map-gl";
import { Checkbox } from "./components/Checkbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapStyleSelector } from "./MapStyleSelector";
import { NctMap } from "./types";
import { DEFAULT_MAP_STYLE } from "./config";

const App: Component = () => {
  const [viewport, setViewport] = createSignal({
    center: [-121.4, 37.8],
    zoom: 7,
  } as Viewport);

  const [mapStyle, setMapStyle] = createSignal(DEFAULT_MAP_STYLE);

  const [loW, setLoW] = createSignal<boolean>(true);
  const [hiW, setHiW] = createSignal<boolean>();
  const [loE, setLoE] = createSignal<boolean>();
  const [hiE, setHiE] = createSignal<boolean>();

  const NctMaps: NctMap[] = [
    {
      name: "LO W-S",
      getter: loW,
      setter: setLoW,
      url: "mapbox://kengreim.4525vady",
      sourceLayer: "01GE9SE1H343T0ZZQ6DP787MKV-2yipi9",
    },
    {
      name: "HI W-S",
      getter: hiW,
      setter: setHiW,
      url: "mapbox://kengreim.06318cwy",
      sourceLayer: "3_HI-W-536qzx",
    },
    {
      name: "LO E-N",
      getter: loE,
      setter: setLoE,
      url: "mapbox://kengreim.24hjuu7e",
      sourceLayer: "2_LO-E-68fxnv",
    },
    {
      name: "HI E-N",
      getter: hiE,
      setter: setHiE,
      url: "mapbox://kengreim.1pttoy8k",
      sourceLayer: "4_HI-E-ddd7d9",
    },
  ];

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
            <For each={NctMaps}>
              {(map, i) => (
                <Checkbox label={map.name} checked={map.getter()} onChange={map.setter} />
              )}
            </For>
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
          <For each={NctMaps}>
            {(map, i) => (
              <Source
                source={{
                  type: "vector",
                  url: map.url,
                }}
              >
                <Show when={typeof map.getter() != "undefined"}>
                  <Layer
                    style={{
                      "source-layer": map.sourceLayer,
                      type: "line",
                    }}
                    visible={map.getter()}
                  />
                </Show>
              </Source>
            )}
          </For>
        </MapGL>
      </div>
    </div>
  );
};

export default App;
