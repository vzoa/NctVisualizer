import { Component, createEffect, createMemo, createSignal, For, Setter, Show } from "solid-js";
import { Viewport } from "solid-map-gl";
import { DEFAULT_VIEWPORT } from "../config";

interface MapResetProps {
  viewport: Viewport;
  setViewport: Setter<Viewport>;
}

const viewportsMatch = (v1: Viewport, v2: Viewport): boolean =>
  Math.abs(v1.center[0] - v2.center[0]) < 0.001 &&
  Math.abs(v1.center[1] - v2.center[1]) < 0.001 &&
  v1.zoom == v2.zoom &&
  v1.bearing == v2.bearing &&
  v1.pitch == v2.pitch;

export const MapReset: Component<MapResetProps> = (props) => {
  const displayed = createMemo(() => !viewportsMatch(props.viewport, DEFAULT_VIEWPORT));

  return (
    <Show when={displayed()}>
      <div
        class="absolute top-5 right-5 z-50 text-black font-bold text-sm hover:cursor-pointer"
        onClick={() => props.setViewport(DEFAULT_VIEWPORT)}
      >
        Reset Map View
      </div>
    </Show>
  );
};
