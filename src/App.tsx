import { Component, createEffect, createSignal, For, Show } from "solid-js";
import MapGL, { Layer, Source, Viewport } from "solid-map-gl";
import { Checkbox } from "./components/Checkbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapStyleSelector } from "./MapStyleSelector";
import { MapStyle, NctMapWithSignal } from "./types";
import { DEFAULT_MAP_STYLE, NCT_MAPS, E_NV_POLYS, MAP_STYLES } from "./config";

import { createDefaultState, getGeojsonSources } from "./lib/geojson";
import { GeojsonPolySources } from "./GeojsonPolySources";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/Select";
import { Select } from "@kobalte/core/select";
import { NctBasemaps } from "./NctBasemaps";
import { createStore } from "solid-js/store";

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

  const [rno, setRno] = createSignal("RNOS");

  const sources = getGeojsonSources(E_NV_POLYS);

  const [rnoStore, setRnoStore] = createStore(createDefaultState(E_NV_POLYS));

  // Console debugging effects only created in DEV
  if (import.meta.env.DEV) {
    createEffect(() => console.log(rnoStore.selectedConfig));
    createEffect(() => console.log(rnoStore.sectors.map((x) => x.isDisplayed)));
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

          <Select
            options={["RNOS", "RNON"]}
            value={rnoStore.selectedConfig}
            onChange={(val) => setRnoStore("selectedConfig", val)}
            disallowEmptySelection={true}
            itemComponent={(props) => (
              <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
            )}
          >
            <SelectTrigger aria-label="Map Style" class="w-[180px]">
              <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
            </SelectTrigger>
            <SelectContent />
          </Select>

          <div class="flex flex-col space-y-1 mt-2">
            <For each={rnoStore.sectors}>
              {(sector) => (
                <Checkbox
                  label={sector.name}
                  checked={sector.isDisplayed}
                  onChange={(val) =>
                    setRnoStore(
                      "sectors",
                      (checkboxSector) => checkboxSector.name === sector.name,
                      "isDisplayed",
                      val
                    )
                  }
                />
              )}
            </For>
          </div>
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
          {/*<Source*/}
          {/*  source={{*/}
          {/*    type: "geojson",*/}
          {/*    data: nuggetUrl,*/}
          {/*  }}*/}
          {/*>*/}
          {/*  <Layer*/}
          {/*    style={{*/}
          {/*      type: "fill",*/}
          {/*      paint: {*/}
          {/*        "fill-color": "hsl(300, 100%, 50%)",*/}
          {/*        "fill-opacity": 0.2,*/}
          {/*      },*/}
          {/*    }}*/}
          {/*  />*/}
          {/*  <Layer*/}
          {/*    style={{*/}
          {/*      type: "line",*/}
          {/*      paint: {*/}
          {/*        "line-color": "hsl(300, 100%, 50%)",*/}
          {/*        "line-width": 2,*/}
          {/*      },*/}
          {/*    }}*/}
          {/*  />*/}
          {/*</Source>*/}
          {/*<Source*/}
          {/*  source={{*/}
          {/*    type: "geojson",*/}
          {/*    data: silverUrl,*/}
          {/*  }}*/}
          {/*>*/}
          {/*  <Layer*/}
          {/*    style={{*/}
          {/*      type: "fill",*/}
          {/*      paint: {*/}
          {/*        "fill-color": "hsl(100, 100%, 50%)",*/}
          {/*        "fill-opacity": 0.2,*/}
          {/*      },*/}
          {/*    }}*/}
          {/*  />*/}
          {/*  <Layer*/}
          {/*    style={{*/}
          {/*      type: "line",*/}
          {/*      paint: {*/}
          {/*        "line-color": "hsl(100, 100%, 50%)",*/}
          {/*        "line-width": 2,*/}
          {/*      },*/}
          {/*    }}*/}
          {/*  />*/}
          {/*</Source>*/}
          <GeojsonPolySources sources={sources} />
          {/*<Layer*/}
          {/*  id="test"*/}
          {/*  style={{*/}
          {/*    source: "Nugget_RNOS",*/}
          {/*    type: "line",*/}
          {/*    paint: {*/}
          {/*      "line-color": "hsl(100, 100%, 50%)",*/}
          {/*      "line-width": 2,*/}
          {/*    },*/}
          {/*  }}*/}
          {/*/>*/}
          <For each={rnoStore.sectors}>
            {(sector) => (
              <Show when={sector.isDisplayed}>
                <Layer
                  style={{
                    source: `${sector.name}_${rnoStore.selectedConfig}`,
                    type: "line",
                    paint: { "line-color": "hsl(100, 100%, 50%)", "line-width": 2 },
                  }}
                />
              </Show>
            )}
          </For>
        </MapGL>
      </div>
    </div>
  );
};

export default App;
