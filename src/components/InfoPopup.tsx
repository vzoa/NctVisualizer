import { Component, createMemo, createSignal, For, Show } from "solid-js";
import { PopupState } from "../types";
import { FillPaint } from "mapbox-gl";
import { comparePolyAlts, getFillColor, isTransparentFill } from "../lib/geojson";
import { createMousePosition } from "@solid-primitives/mouse";
import { cn } from "../lib/utils";
import { ArrowLeftRight } from "lucide-solid";

interface InfoPopupProps {
  popupState: PopupState;
}

export const InfoPopup: Component<InfoPopupProps> = (props) => {
  const sortedPolys = createMemo(() =>
    props.popupState.hoveredPolys.toSorted(comparePolyAlts).map((p) => ({
      poly: p,
      isTransparent: isTransparentFill(p.layer.paint as FillPaint),
      color: getFillColor(p.layer.paint as FillPaint),
    }))
  );
  const pos = createMousePosition(window);
  const [followMouse, setFollowMouse] = createSignal(true);
  const styleOffset = createMemo(() =>
    followMouse() ? { top: `${pos.y + 5}px`, left: `${pos.x + 5}px` } : {}
  );

  return (
    <div>
      <div
        class="absolute top-5 left-5 text-black font-bold text-sm hover:cursor-pointer z-50 flex space-x-1 items-center"
        onClick={() => setFollowMouse((prev) => !prev)}
      >
        <ArrowLeftRight />
        <span>{followMouse() ? "ALTS FOLLOW MOUSE" : "ALTS IN CORNER"}</span>
      </div>
      <Show when={props.popupState.vis}>
        {/*<div class="absolute top-5 left-5 w-48 bg-gray-200 bg-opacity-50 rounded border border-gray-800 p-1.5 z-50 items-center">*/}
        <div
          class={cn(
            "bg-gray-200 bg-opacity-80 rounded border border-gray-800 p-1.5 z-50 items-center",
            { fixed: followMouse() },
            { "absolute top-14 left-5 w-48": !followMouse() }
          )}
          style={styleOffset()}
        >
          <table>
            <For each={sortedPolys()}>
              {(polyInfo) => (
                <tr>
                  <td
                    class={cn(
                      { "font-bold": !polyInfo.isTransparent },
                      { italic: polyInfo.isTransparent },
                      { "w-20": !followMouse() }
                    )}
                    style={{
                      color: polyInfo.isTransparent
                        ? "#4b5563" // Tailwind default gray-600
                        : getFillColor(polyInfo.poly.layer.paint as FillPaint),
                    }}
                  >
                    {polyInfo.poly.source.split("_")[0]}
                  </td>
                  <td class="font-mono w-12 text-center ml-3">
                    {polyInfo.poly.properties?.minAlt === 0
                      ? "SFC"
                      : polyInfo.poly.properties?.minAlt.toString().padStart(3, "0")}
                  </td>
                  <td class="font-mono w-12 text-center">
                    {polyInfo.poly.properties?.maxAlt.toString().padStart(3, "0")}
                  </td>
                </tr>
              )}
            </For>
          </table>
        </div>
      </Show>
    </div>
  );
};
