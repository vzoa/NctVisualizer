import { Component, createSignal, For, Show } from "solid-js";
import MapGL, { Layer, Source, Viewport } from "solid-map-gl";
import { Checkbox } from "./components/Checkbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapStyleSelector } from "./MapStyleSelector";
import { NctMapWithSignal } from "./types";
import { DEFAULT_MAP_STYLE, NCT_MAPS } from "./config";

import nuggetUrl from "./polys/e-nv/nugget.geojson";
import silverUrl from "./polys/e-nv/silver.geojson";

const App: Component = () => {
  const [viewport, setViewport] = createSignal({
    center: [-121.4, 37.8],
    zoom: 7,
  } as Viewport);

  const [mapStyle, setMapStyle] = createSignal(DEFAULT_MAP_STYLE);

  const nctMaps: NctMapWithSignal[] = NCT_MAPS.map((n) => {
    const [getter, setter] = n.showDefault ? createSignal<boolean>(true) : createSignal<boolean>();
    return {
      ...n,
      getter: getter,
      setter: setter,
    };
  });

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
            <For each={nctMaps}>
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
          debug={import.meta.env.DEV}
        >
          <For each={nctMaps}>
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
          <Source
            source={{
              type: "geojson",
              data: nuggetUrl,
            }}
          >
            <Layer
              style={{
                type: "fill",
                paint: {
                  "fill-color": "hsl(300, 100%, 50%)",
                  "fill-opacity": 0.2,
                },
              }}
            />
            <Layer
              style={{
                type: "line",
                paint: {
                  "line-color": "hsl(300, 100%, 50%)",
                  "line-width": 2,
                },
              }}
            />
          </Source>
          <Source
            source={{
              type: "geojson",
              data: silverUrl,
            }}
          >
            <Layer
              style={{
                type: "fill",
                paint: {
                  "fill-color": "hsl(100, 100%, 50%)",
                  "fill-opacity": 0.2,
                },
              }}
            />
            <Layer
              style={{
                type: "line",
                paint: {
                  "line-color": "hsl(100, 100%, 50%)",
                  "line-width": 2,
                },
              }}
            />
          </Source>
        </MapGL>
      </div>
    </div>
  );
};

export default App;
