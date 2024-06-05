import { Layer, Source } from "solid-map-gl";
import { Component, For, Show } from "solid-js";
import { BaseMapState } from "../types";

interface NctBasemapsProps {
  mapsState: BaseMapState[];
}

export const BaseMaps: Component<NctBasemapsProps> = (props) => {
  return (
    <For each={props.mapsState}>
      {(map) => (
        <Source
          id={map.baseMap.name}
          source={{
            type: "vector",
            url: map.baseMap.url,
          }}
        >
          <Show when={map.hasMounted}>
            <Layer
              id={map.baseMap.name}
              style={{
                "source-layer": map.baseMap.sourceLayer,
                type: "line",
              }}
              visible={map.checked}
            />
          </Show>
        </Source>
      )}
    </For>
  );
};
