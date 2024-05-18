import { Component, For } from "solid-js";
import { PopupState } from "./types";
import { FillPaint } from "mapbox-gl";
import colorString from "color-string";

interface InfoPopupProps {
  popupState: PopupState;
}

type RgbaDecimal = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export const InfoPopup: Component<InfoPopupProps> = (props) => {
  const getFillColor = (paint: FillPaint): string => {
    let c = paint["fill-color"] as RgbaDecimal;
    return colorString.to.hex([c.r * 255, c.g * 255, c.b * 255]);
  };

  return (
    <div class="absolute top-5 left-5 w-48 bg-gray-200 bg-opacity-50 rounded border border-gray-800 p-1.5 z-50 items-center">
      <table>
        <For each={props.popupState.hoveredPolys}>
          {(poly) => (
            <tr>
              <td
                class="font-bold w-20"
                style={{ color: getFillColor(poly.layer.paint as FillPaint) }}
              >
                {poly.source.split("_")[0]}
              </td>
              <td class="font-mono w-12 text-center">
                {poly.properties?.minAlt === 0
                  ? "SFC"
                  : poly.properties?.minAlt.toString().padStart(3, "0")}
              </td>
              <td class="font-mono w-12 text-center">
                {poly.properties?.maxAlt.toString().padStart(3, "0")}
              </td>
            </tr>
          )}
        </For>
      </table>
    </div>
  );
};
