// SolidJs
import {
  Accessor,
  batch,
  Component,
  createEffect,
  createMemo,
  createSignal,
  For,
  untrack,
} from "solid-js";
import { createStore, produce } from "solid-js/store";
import { makePersisted } from "@solid-primitives/storage";

// Map
import MapGL from "solid-map-gl";
import { GeoJSONFeature, MapMouseEvent } from "mapbox-gl";
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
  AirportConfig,
  AirspaceConfig,
  AppDisplayState,
  ArrivalProcedure,
  FillPaint,
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
import { ArrivalPoints } from "./components/ArrivalPoints";
import { ProceduresDialog } from "./components/ProceduresDialog";

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

  const [displayedArrivals, setDisplayedArrivals] = createSignal<ArrivalProcedure[]>([]);
  const [isProceduresOpen, setIsProceduresOpen] = createSignal(false);

  const altitudeHover = (evt: MapMouseEvent) => {
    if (!evt.target.isStyleLoaded()) return;
    const features: GeoJSONFeature[] = evt.target.queryRenderedFeatures(evt.point, {
      filter: ["all", ["==", ["geometry-type"], "Polygon"], ["has", "minAlt"], ["has", "maxAlt"]],
    });
    const fillLayers = getUniqueLayers(features.filter((f) => f.layer?.type == "fill"));
    if (fillLayers.length > 0) {
      logIfDev(fillLayers);
      let transparentLayers: GeoJSONFeature[] = [];
      let visibleLayers: GeoJSONFeature[] = [];
      fillLayers.forEach((l) =>
        isTransparentFill(l.layer?.paint as FillPaint)
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

  const handleArrivalToggle = (arrival: ArrivalProcedure, isDisplayed: boolean) => {
    setDisplayedArrivals((prev) => {
      if (isDisplayed) {
        return [...prev, arrival];
      } else {
        return prev.filter((a) => a.arrivalIdentifier !== arrival.arrivalIdentifier);
      }
    });
  };

  const [bayConfig, setBayConfig] = makePersisted(createSignal<AirspaceConfig>("SFOW"), {
    name: "bayConfig",
  });
  const [sfoConfig, setSfoConfig] = makePersisted(createSignal<AirportConfig>("SFOW"), {
    name: "sfoConfig",
  });
  const [oakConfig, setOakConfig] = makePersisted(createSignal<AirportConfig>("OAKW"), {
    name: "oakConfig",
  });
  const [sjcConfig, setSjcConfig] = makePersisted(createSignal<AirportConfig>("SJCW"), {
    name: "sjcConfig",
  });

  const sfoOptions = createMemo(() => {
    if (bayConfig() === "SFOW") {
      return ["SFOW"];
    } else if (bayConfig() === "SFOE") {
      return ["SFO19", "SFO10"];
    } else {
      return [];
    }
  });

  const oakOptions = createMemo(() => (bayConfig() === "SFOW" ? ["OAKW", "OAKE"] : ["OAKE"]));
  const sjcOptions = createMemo(() => (bayConfig() === "SFOW" ? ["SJCW", "SJCE"] : ["SJCE"]));

  const areaA: Accessor<AirspaceConfig> = createMemo(() => {
    if (bayConfig() === "SFOW") {
      return sjcConfig() === "SJCE" ? "SJCE" : "SFOW";
    } else {
      return bayConfig() === "SFOE" ? "SFOE" : "";
    }
  });

  const areaBC: Accessor<AirspaceConfig> = createMemo(() => {
    if (bayConfig() === "SFOW") {
      return oakConfig() === "OAKE" ? "OAKE" : "SFOW";
    } else {
      if (bayConfig() === "SFOE") {
        return sfoConfig() === "SFO19" ? "SFOE" : "SFO10";
      } else {
        return "";
      }
    }
  });

  const areaD: Accessor<AirspaceConfig> = createMemo(() => {
    if (bayConfig() === "SFOW") {
      return oakConfig() === "OAKE" ? "OAKE" : "SFOW";
    } else {
      return bayConfig() === "SFOE" ? "SFOE" : "";
    }
  });

  createEffect((isInitialLoad) => {
    if (bayConfig() === "SFOW") {
      batch(() => {
        setSfoConfig("SFOW");
        // Need to track if initial state load from persistence. If so, don't trigger default reset
        if (!isInitialLoad) {
          setOakConfig("OAKW");
          setSjcConfig("SJCW");
        }
      });
    } else if (bayConfig() === "SFOE") {
      batch(() => {
        if (untrack(sfoConfig) === "SFOW" || untrack(sfoConfig) == null) {
          setSfoConfig("SFO19");
        }
        setOakConfig("OAKE");
        setSjcConfig("SJCE");
      });
    }
    return false;
  }, true);

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

          <button
            onClick={() => setIsProceduresOpen((prev) => !prev)}
            class="flex items-center justify-center w-36 h-10 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors cursor-pointer"
            title="Airport Procedures"
          >
            Procedures
          </button>

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

          <Section header="Sectors" class="space-y-2">
            {/*Temporary select for SFOW/SFOE*/}
            <div>
              <span class="block text-md text-white mb-1">Bay Flow</span>
              <Select
                options={["SFOW", "SFOE"]}
                value={bayConfig()}
                onChange={(val) => {
                  if (val) {
                    setBayConfig(val);
                  }
                }}
                disallowEmptySelection={true}
                itemComponent={(props) => (
                  <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
                )}
              >
                <SelectTrigger aria-label="Map Style" class="w-[180px] cursor-pointer">
                  <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
                </SelectTrigger>
                <SelectContent />
              </Select>
            </div>

            <div>
              <span class="block text-md text-white mb-1">Airport Configs</span>
              <div class="flex flex-col space-y-2">
                <Select
                  options={sfoOptions()}
                  value={sfoConfig()}
                  onChange={(val) => {
                    if (val) {
                      setSfoConfig(val);
                    }
                  }}
                  disallowEmptySelection={true}
                  itemComponent={(props) => (
                    <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
                  )}
                >
                  <SelectTrigger aria-label="Map Style" class="w-[180px] cursor-pointer">
                    <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
                  </SelectTrigger>
                  <SelectContent />
                </Select>

                <Select
                  options={oakOptions()}
                  value={oakConfig()}
                  onChange={(val) => {
                    if (val) {
                      setOakConfig(val);
                    }
                  }}
                  disallowEmptySelection={true}
                  itemComponent={(props) => (
                    <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
                  )}
                >
                  <SelectTrigger aria-label="Map Style" class="w-[180px] cursor-pointer">
                    <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
                  </SelectTrigger>
                  <SelectContent />
                </Select>

                <Select
                  options={sjcOptions()}
                  value={sjcConfig()}
                  onChange={(val) => {
                    if (val) {
                      setSjcConfig(val);
                    }
                  }}
                  disallowEmptySelection={true}
                  itemComponent={(props) => (
                    <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
                  )}
                >
                  <SelectTrigger aria-label="Map Style" class="w-[180px] cursor-pointer">
                    <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
                  </SelectTrigger>
                  <SelectContent />
                </Select>
              </div>
            </div>

            <SectorDisplayWithControls
              airspaceGroup={"A"}
              store={allStore}
              setStore={setAllStore}
              dependentOnConfig={areaA()}
            />

            <SectorDisplayWithControls
              airspaceGroup={"B"}
              store={allStore}
              setStore={setAllStore}
              dependentOnConfig={areaBC()}
            />

            <SectorDisplayWithControls
              airspaceGroup={"C"}
              store={allStore}
              setStore={setAllStore}
              dependentOnConfig={areaBC()}
            />

            <SectorDisplayWithControls
              airspaceGroup={"D"}
              store={allStore}
              setStore={setAllStore}
              dependentOnConfig={areaD()}
            />

            <SectorDisplayWithControls
              airspaceGroup={"SMF"}
              airspaceConfigOptions={["SMFS", "SMFN"]}
              store={allStore}
              setStore={setAllStore}
            />

            <SectorDisplayWithControls
              airspaceGroup={"RNO"}
              airspaceConfigOptions={["RNOS", "RNON"]}
              store={allStore}
              setStore={setAllStore}
            />
          </Section>
        </div>
        <Footer />
      </div>
      <div class="grow relative">
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
          <ArrivalPoints arrivals={displayedArrivals()} />
        </MapGL>
      </div>

      <ProceduresDialog
        isOpen={isProceduresOpen()}
        onClose={() => setIsProceduresOpen(false)}
        onArrivalToggle={handleArrivalToggle}
      />
    </div>
  );
};

export default App;
