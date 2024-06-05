// SolidJs
import { Component, createEffect, createSignal, For } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { makePersisted } from "@solid-primitives/storage";

// Map
import MapGL from "solid-map-gl";
import mapboxgl, { FillPaint, MapboxGeoJSONFeature } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Components
import {
  Footer,
  GeojsonPolyLayers,
  GeojsonPolySources,
  InfoPopup,
  MapReset,
  MapStyleSelector,
  BaseMaps,
  SectorDisplayWithControls,
} from "./components";
import {
  Checkbox,
  Section,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui-core";
import { Select } from "@kobalte/core/select";
import { SettingsDialog } from "./components/Settings";

// Types/Utils
import {
  AirspaceConfig,
  AppDisplayState,
  MountedBaseMapState,
  PersistedBaseMapState,
  PopupState,
  Settings,
} from "./types";
import {
  createDefaultState,
  getGeojsonSources,
  getUniqueLayers,
  isTransparentFill,
} from "./lib/geojson";
import { logIfDev } from "./lib/utils";

// Config
import {
  DEFAULT_MAP_STYLE,
  BASE_MAPS,
  POLY_DEFINITIONS,
  DEFAULT_VIEWPORT,
  DEFAULT_SETTINGS,
} from "./config";

const App: Component = () => {
  const [viewport, setViewport] = makePersisted(createSignal(DEFAULT_VIEWPORT), {
    name: "viewport",
  });

  // Signal for map base style
  const [mapStyle, setMapStyle] = makePersisted(createSignal(DEFAULT_MAP_STYLE), {
    name: "mapStyle",
  });

  const [persistedBaseMaps, setPersistedBaseMaps] = makePersisted(
    createStore<PersistedBaseMapState[]>(
      BASE_MAPS.map((m) => ({
        id: m.name,
        baseMap: m,
        checked: m.showDefault,
      }))
    ),
    { name: "baseMaps" }
  );

  const [mountedBaseMaps, setMountedBaseMaps] = createStore<MountedBaseMapState[]>(
    persistedBaseMaps.map((m) => ({ id: m.baseMap.name, hasMounted: m.checked }))
  );

  const sources = POLY_DEFINITIONS.flatMap((p) => getGeojsonSources(p.polys));

  const [allStore, setAllStore] = makePersisted(
    createStore<AppDisplayState>({
      updateCount: 0,
      areaDisplayStates: POLY_DEFINITIONS.map((p) => createDefaultState(p.polys)),
    }),
    { name: "currentDisplay" }
  );

  const [popup, setPopup] = createStore<PopupState>({
    hoveredPolys: [],
    vis: false,
  });

  const [cursor, setCursor] = createSignal("grab");

  const [settings, setSettings] = makePersisted(createStore<Settings>(DEFAULT_SETTINGS), {
    name: "settings",
  });

  const altitudeHover = (evt: mapboxgl.MapMouseEvent) => {
    if (!evt.target.isStyleLoaded()) return;
    const features: MapboxGeoJSONFeature[] = evt.target.queryRenderedFeatures(evt.point, {
      filter: ["all", ["==", ["geometry-type"], "Polygon"], ["has", "minAlt"], ["has", "maxAlt"]],
    });
    const fillLayers = getUniqueLayers(features.filter((f) => f.layer.type == "fill"));
    if (fillLayers.length > 0) {
      logIfDev(fillLayers);
      let transparentLayers: mapboxgl.MapboxGeoJSONFeature[] = [];
      let visibleLayers: mapboxgl.MapboxGeoJSONFeature[] = [];
      fillLayers.forEach((l) =>
        isTransparentFill(l.layer.paint as FillPaint)
          ? transparentLayers.push(l)
          : visibleLayers.push(l)
      );
      if (settings.popup.showUncheckedSectors) {
        setPopup(
          produce((state) => {
            state.vis = settings.popup.uncheckedSectorsInVisibleSectorsOnly
              ? visibleLayers.length > 0
              : true;
            state.hoveredPolys = fillLayers;
          })
        );
      } else {
        setPopup(
          produce((state) => {
            state.vis = visibleLayers.length > 0;
            state.hoveredPolys = visibleLayers;
          })
        );
      }
    } else {
      setPopup("vis", false);
    }
  };

  createEffect(() => {
    if (popup.vis) setCursor("crosshair");
    else setCursor("grab");
  });

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
              <For each={persistedBaseMaps}>
                {(m) => (
                  <Checkbox
                    label={m.baseMap.name}
                    checked={m.checked}
                    onChange={(val) => {
                      setPersistedBaseMaps(
                        (m1) => m1.id === m.id,
                        produce((m2) => {
                          m2.checked = val;
                        })
                      );
                      let persisted = persistedBaseMaps.find((m1) => m1.id == m.id);
                      setMountedBaseMaps(
                        (m1) => m1.id === m.id,
                        produce((m2) => {
                          m2.hasMounted = m2.hasMounted || persisted!.checked;
                        })
                      );
                    }}
                  />
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
        <InfoPopup popupState={popup} settings={settings} />

        <div class="absolute top-5 left-5 z-50 flex">
          <SettingsDialog settings={settings} setSettings={setSettings} />
        </div>

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
          <BaseMaps persistedMapsState={persistedBaseMaps} mountedMapsState={mountedBaseMaps} />
          <GeojsonPolySources sources={sources} />
          <GeojsonPolyLayers displayStateStore={allStore} allPolys={POLY_DEFINITIONS} />
        </MapGL>
      </div>
    </div>
  );
};

export default App;
