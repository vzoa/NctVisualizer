import { Layer, Source } from "solid-map-gl";
import { Component, For, Show } from "solid-js";
import { DisplayedBaseMapState, PersistedBaseMapState } from "../types";

interface NctBasemapsProps {
  mapsState: DisplayedBaseMapState[];
}

export const BaseMaps: Component<NctBasemapsProps> = (props) => {
  return (
    <For each={props.mapsState}>
      {(map) => (
        <Source
          id={map.persistedState.baseMap.name}
          source={{
            type: "vector",
            url: map.persistedState.baseMap.url,
          }}
        >
          <Show when={map.hasMounted}>
            <Layer
              id={map.persistedState.baseMap.name}
              style={{
                "source-layer": map.persistedState.baseMap.sourceLayer,
                type: "line",
              }}
              visible={map.persistedState.checked}
            />
          </Show>
        </Source>
      )}
    </For>
  );
};
