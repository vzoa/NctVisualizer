import { MapStyle } from "./types";

export const DEFAULT_MAP_STYLE: MapStyle = {
  value: "mapbox://styles/mapbox/empty-v9",
  label: "Empty",
  disabled: false,
};

export const MAP_STYLES: MapStyle[] = [
  DEFAULT_MAP_STYLE,
  {
    value: "mapbox://styles/mapbox/light-v11",
    label: "World Light",
    disabled: false,
  },
];
