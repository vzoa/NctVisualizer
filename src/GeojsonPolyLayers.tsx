import { AirspaceConfig, AppDisplayState, PolyDefinition, SectorName } from "./types";
import { Component, createEffect, For, Show } from "solid-js";
import { Layer } from "solid-map-gl";
import { createStore, produce } from "solid-js/store";
import { logIfDev } from "./lib/utils";

interface GeojsonPolyLayersProps {
  displayStateStore: AppDisplayState;
  allPolys: PolyDefinition[];
}

interface DisplayState {
  name: SectorName;
  isDisplayed: boolean;
  config: AirspaceConfig;
  color: string;
}

const createStartingLayers = (allPolys: PolyDefinition[]): DisplayState[] =>
  allPolys.flatMap((p) =>
    p.polys.sectorConfigs.flatMap((s) =>
      s.configPolyUrls.map((c) => ({
        name: s.sectorName,
        config: c.config,
        isDisplayed: false,
        color: s.defaultColor,
      }))
    )
  );

export const GeojsonPolyLayers: Component<GeojsonPolyLayersProps> = (props) => {
  const startingLayers = createStartingLayers(props.allPolys);
  logIfDev("Starting map layers", startingLayers);
  const [allLayers, setAllLayers] = createStore(startingLayers);

  createEffect(() => {
    let displayFlat = props.displayStateStore.areaDisplayStates.flatMap((area) =>
      area.sectors.map((sector) => ({ ...sector, config: area.selectedConfig }))
    );

    let displayMap: Map<SectorName, DisplayState> = new Map();
    displayFlat.forEach((s) => displayMap.set(s.name, s));

    logIfDev("Starting update of layers");
    logIfDev("Intended display state before signals", displayMap);

    setAllLayers(
      (layer) => displayMap.has(layer.name),
      produce((layer) => {
        let displayLayer = displayMap.get(layer.name)!;
        layer.isDisplayed = displayLayer.config === layer.config && displayLayer.isDisplayed;
        layer.color = displayLayer.color;
      })
    );

    logIfDev("Change in displayed polygons logic", allLayers);
  });

  return (
    <For each={allLayers}>
      {(layer) => (
        <Show when={layer.isDisplayed}>
          <Layer
            style={{
              source: `${layer.name}_${layer.config}`,
              type: "line",
              paint: { "line-color": layer.color, "line-width": 2 },
            }}
          />
          <Layer
            style={{
              source: `${layer.name}_${layer.config}`,
              type: "fill",
              paint: {
                "fill-color": layer.color,
                "fill-opacity": 0.2,
              },
            }}
          />
        </Show>
      )}
    </For>
  );
};
