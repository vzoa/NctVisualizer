import { Layer, Source } from "solid-map-gl";
import { Component, For, Show } from "solid-js";
import { NctMapWithSignal } from "./types";

interface NctBasemapsProps {
  maps: NctMapWithSignal[];
}

export const NctBasemaps: Component<NctBasemapsProps> = (props) => {
  return (
    <For each={props.maps}>
      {(map) => (
        <Source
          id={map.name}
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
  );
};
