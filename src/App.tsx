import { Component, createEffect, createSignal, For } from "solid-js";
import MapGL, { Viewport } from "solid-map-gl";
import { Checkbox } from "./components/Checkbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapStyleSelector } from "./MapStyleSelector";
import { AppDisplayState, NctMapWithSignal, PolyDefinition } from "./types";
import { DEFAULT_MAP_STYLE, NCT_MAPS, E_NV_POLYS, E_CA_POLYS } from "./config";
import { createDefaultState, getGeojsonSources } from "./lib/geojson";
import { GeojsonPolySources } from "./GeojsonPolySources";
import { NctBasemaps } from "./NctBasemaps";
import { createStore } from "solid-js/store";
import { SectorDisplayWithControls } from "./SectorDisplayWithControls";
import { GeojsonPolyLayers } from "./GeojsonPolyLayers";

const App: Component = () => {
  const [viewport, setViewport] = createSignal({
    center: [-121.4, 37.8],
    zoom: 7,
  } as Viewport);

  // Signal for map base style
  const [mapStyle, setMapStyle] = createSignal(DEFAULT_MAP_STYLE);

  // Array of NCT base maps (LO W-S, Hi W-S, etc.) each with a signal for whether it's displayed
  const nctMaps: NctMapWithSignal[] = NCT_MAPS.map((n) => {
    const [getter, setter] = n.showDefault ? createSignal<boolean>(true) : createSignal<boolean>();
    return {
      ...n,
      getter: getter,
      setter: setter,
    };
  });

  const polyDefinitions: PolyDefinition[] = [
    { name: "RNO", polys: E_NV_POLYS },
    { name: "SMF", polys: E_CA_POLYS },
  ];

  const sources = polyDefinitions.flatMap((p) => getGeojsonSources(p.polys));
  const [allStore, setAllStore] = createStore<AppDisplayState>({
    updateCount: 0,
    areaDisplayStates: [createDefaultState(E_NV_POLYS), createDefaultState(E_CA_POLYS)],
  });

  // Console debugging effects only created in DEV
  if (import.meta.env.DEV) {
    createEffect(() => {
      console.log("Update count", allStore.updateCount);
      console.log("Sectors display state", allStore.areaDisplayStates);
    });
  }

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

          <SectorDisplayWithControls
            airspaceGroup={"RNO"}
            airspaceConfigOptions={["RNOS", "RNON"]}
            store={allStore}
            setStore={setAllStore}
          />

          <SectorDisplayWithControls
            airspaceGroup={"SMF"}
            airspaceConfigOptions={["SMFS", "SMFN"]}
            store={allStore}
            setStore={setAllStore}
          />
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
          <NctBasemaps maps={nctMaps} />
          <GeojsonPolySources sources={sources} />
          <GeojsonPolyLayers displayStateStore={allStore} allPolys={polyDefinitions} />
        </MapGL>
      </div>
    </div>
  );
};

export default App;
