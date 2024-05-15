import { MapStyle, NctMap, AreaPolys } from "./types";
import nuggetUrl from "./polys/e-nv/nugget.geojson";
import silverUrl from "./polys/e-nv/silver.geojson";

const DEFAULT_MAP_STYLE: MapStyle = {
  value: "mapbox://styles/mapbox/empty-v9",
  label: "Empty",
  disabled: false,
};

const MAP_STYLES: MapStyle[] = [
  DEFAULT_MAP_STYLE,
  {
    value: "mapbox://styles/mapbox/light-v11",
    label: "World Light",
    disabled: false,
  },
  {
    value: "mapbox://styles/kengreim/clw6l16rw002o01q1cq9h43ft",
    label: "Satellite Low Opacity",
    disabled: false,
  },
];

const NCT_MAPS: NctMap[] = [
  {
    name: "LO W-S",
    url: "mapbox://kengreim.4525vady",
    sourceLayer: "01GE9SE1H343T0ZZQ6DP787MKV-2yipi9",
    showDefault: true,
  },
  {
    name: "HI W-S",
    url: "mapbox://kengreim.06318cwy",
    sourceLayer: "3_HI-W-536qzx",
    showDefault: false,
  },
  {
    name: "LO E-N",
    url: "mapbox://kengreim.24hjuu7e",
    sourceLayer: "2_LO-E-68fxnv",
    showDefault: false,
  },
  {
    name: "HI E-N",
    url: "mapbox://kengreim.1pttoy8k",
    sourceLayer: "4_HI-E-ddd7d9",
    showDefault: false,
  },
];

const E_NV_POLYS: AreaPolys = {
  isSectorized: true,
  sectorConfigs: [
    {
      config: "RNON",
      polys: [
        {
          name: "Nugget",
          url: nuggetUrl,
        },
        {
          name: "Silver",
          url: silverUrl,
        },
      ],
    },
    {
      config: "RNOS",
      polys: [
        {
          name: "Nugget",
          url: nuggetUrl,
        },
        {
          name: "Silver",
          url: silverUrl,
        },
      ],
    },
  ],
};

export { DEFAULT_MAP_STYLE, MAP_STYLES, NCT_MAPS, E_NV_POLYS };
