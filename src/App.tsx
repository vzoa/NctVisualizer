import { Component, createEffect, createSignal, For, Show } from "solid-js";
import MapGL, { Viewport } from "solid-map-gl";
import { Checkbox } from "./components/ui-core/Checkbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapStyleSelector } from "./components/MapStyleSelector";
import {
  AirspaceConfig,
  AppDisplayState,
  NctMapWithSignal,
  PolyDefinition,
  PopupState,
} from "./types";
import {
  DEFAULT_MAP_STYLE,
  NCT_MAPS,
  E_NV_POLYS,
  E_CA_POLYS,
  DEFAULT_VIEWPORT,
  A_POLYS,
  C_POLYS,
  D_POLYS,
  B_POLYS,
} from "./config";
import { createDefaultState, getGeojsonSources, getUniqueLayers } from "./lib/geojson";
import { GeojsonPolySources } from "./components/GeojsonPolySources";
import { NctBasemaps } from "./components/NctBasemaps";
import { createStore, produce } from "solid-js/store";
import { SectorDisplayWithControls } from "./components/SectorDisplayWithControls";
import { GeojsonPolyLayers } from "./components/GeojsonPolyLayers";
import { logIfDev } from "./lib/utils";
import mapboxgl, { MapboxGeoJSONFeature } from "mapbox-gl";
import { InfoPopup } from "./components/InfoPopup";
import { Section } from "./components/ui-core/Section";
import { Footer } from "./components/Footer";
import { MapReset } from "./components/MapReset";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui-core/Select";
import { Select } from "@kobalte/core/select";

const App: Component = () => {
  const [viewport, setViewport] = createSignal(DEFAULT_VIEWPORT);

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
    { name: "A", polys: A_POLYS },
    { name: "B", polys: B_POLYS },
    { name: "C", polys: C_POLYS },
    { name: "D", polys: D_POLYS },
  ];

  const sources = polyDefinitions.flatMap((p) => getGeojsonSources(p.polys));
  const [allStore, setAllStore] = createStore<AppDisplayState>({
    updateCount: 0,
    areaDisplayStates: polyDefinitions.map((p) => createDefaultState(p.polys)), // createDefaultState(E_NV_POLYS), createDefaultState(E_CA_POLYS)],
  });

  const [popup, setPopup] = createStore<PopupState>({
    hoveredPolys: [],
    vis: false,
  });

  const [cursor, setCursor] = createSignal("grab");

  const altitudeHover = (evt: mapboxgl.MapMouseEvent) => {
    const features: MapboxGeoJSONFeature[] = evt.target.queryRenderedFeatures(evt.point, {
      filter: ["all", ["==", ["geometry-type"], "Polygon"], ["has", "minAlt"], ["has", "maxAlt"]],
    });
    const fillLayers = getUniqueLayers(features.filter((f) => f.layer.type == "fill"));
    if (fillLayers.length > 0) {
      logIfDev(fillLayers);
      setPopup(
        produce((state) => {
          state.vis = true;
          state.hoveredPolys = fillLayers;
        })
      );
      setCursor("crosshair");
    } else {
      setPopup("vis", false);
      setCursor("grab");
    }
  };

  const [sfoConfig, setSfoConfig] = createSignal<AirspaceConfig>("SFOW");

  // Console debugging effects only created in DEV
  if (import.meta.env.DEV) {
    createEffect(() => {
      console.log("Update count", allStore.updateCount);
      console.log("Sectors display state", allStore.areaDisplayStates);
    });
    createEffect(() => {
      console.log("Popup visibility state changed", popup.vis);
    });
  }

  return (
    <div class="flex h-screen">
      <div class="flex flex-col bg-slate-900 p-4 justify-between overflow-scroll">
        <div class="flex flex-col space-y-4">
          <h1 class="text-white text-2xl">NCT Visualizer</h1>

          <Section header="Style">
            <MapStyleSelector style={mapStyle} setStyle={setMapStyle} />
          </Section>

          <Section header="Base Maps">
            <div class="flex flex-col space-y-1">
              <For each={nctMaps}>
                {(map, i) => (
                  <Checkbox label={map.name} checked={map.getter()} onChange={map.setter} />
                )}
              </For>
            </div>
          </Section>

          <Section header="Sectors">
            <div class="flex flex-col space-y-4">
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

              {/*Temporary select for SFOW/SFOE*/}
              <Select
                options={["SFOW", "SFOE"]}
                value={sfoConfig()}
                onChange={(val) => setSfoConfig(val)}
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

              <SectorDisplayWithControls
                airspaceGroup={"A"}
                airspaceConfigOptions={["SFOW", "SFOE"]}
                store={allStore}
                setStore={setAllStore}
                dependentOnConfig={sfoConfig()}
              />

              <SectorDisplayWithControls
                airspaceGroup={"B"}
                airspaceConfigOptions={["SFOW", "SFOE"]}
                store={allStore}
                setStore={setAllStore}
                dependentOnConfig={sfoConfig()}
              />

              <SectorDisplayWithControls
                airspaceGroup={"C"}
                airspaceConfigOptions={["SFOW", "SFOE"]}
                store={allStore}
                setStore={setAllStore}
                dependentOnConfig={sfoConfig()}
              />

              <SectorDisplayWithControls
                airspaceGroup={"D"}
                airspaceConfigOptions={["SFOW", "SFOE"]}
                store={allStore}
                setStore={setAllStore}
                dependentOnConfig={sfoConfig()}
              />
            </div>
          </Section>
        </div>
        <Footer />
      </div>
      <div class="grow relative">
        {/* Fake Popup until the Solid Map GL library fixes popups */}
        <InfoPopup popupState={popup} />

        <MapReset viewport={viewport()} setViewport={setViewport} />

        <MapGL
          options={{
            accessToken: import.meta.env.VITE_MAPBOX_KEY,
            style: mapStyle().value,
          }}
          viewport={viewport()}
          onViewportChange={setViewport}
          class="h-full w-full"
          debug={import.meta.env.DEV}
          onMouseMove={altitudeHover}
          cursorStyle={cursor()}
        >
          {/*<Show when={popup.vis}>*/}
          {/*  <Popup trackPointer options={{ offset: [0, -10], closeButton: false }}>*/}
          {/*    {popup.content}*/}
          {/*  </Popup>*/}
          {/*</Show>*/}
          <NctBasemaps maps={nctMaps} />
          <GeojsonPolySources sources={sources} />
          <GeojsonPolyLayers displayStateStore={allStore} allPolys={polyDefinitions} />
        </MapGL>
      </div>
    </div>
  );
};

export default App;
