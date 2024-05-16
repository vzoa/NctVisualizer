import { MapStyle, NctMap, AreaPolys } from "./types";

import nugget from "./polys/e-nv/nugget.geojson";
import silver from "./polys/e-nv/silver.geojson";
import smfnElkhorn from "./polys/e-ca/smfn-elkhorn.geojson";
import smfnParadise from "./polys/e-ca/smfn-paradise.geojson";
import smfsElkhorn from "./polys/e-ca/smfs-elkhorn.geojson";
import smfsParadise from "./polys/e-ca/smfs-paradise.geojson";

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
  name: "RNO",
  defaultConfig: "RNOS",
  sectorConfigs: [
    {
      sectorName: "Nugget",
      configPolyUrls: [
        {
          config: "RNOS",
          url: nugget,
        },
        {
          config: "RNON",
          url: nugget,
        },
      ],
    },
    {
      sectorName: "Silver",
      configPolyUrls: [
        {
          config: "RNOS",
          url: silver,
        },
        {
          config: "RNON",
          url: silver,
        },
      ],
    },
  ],
};

const E_CA_POLYS: AreaPolys = {
  name: "SMF",
  defaultConfig: "SMFS",
  sectorConfigs: [
    {
      sectorName: "Elkhorn",
      configPolyUrls: [
        {
          config: "SMFS",
          url: smfsElkhorn,
        },
        {
          config: "SMFN",
          url: smfnElkhorn,
        },
      ],
    },
    {
      sectorName: "Paradise",
      configPolyUrls: [
        {
          config: "SMFS",
          url: smfsParadise,
        },
        {
          config: "SMFN",
          url: smfnParadise,
        },
      ],
    },
  ],
};

export { DEFAULT_MAP_STYLE, MAP_STYLES, NCT_MAPS, E_NV_POLYS, E_CA_POLYS };
