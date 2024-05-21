import { MapStyle, NctMap, AreaPolys } from "./types";
import { Viewport } from "solid-map-gl";

// E-NV
import nugget from "./polys/e-nv/nugget.geojson";
import silver from "./polys/e-nv/silver.geojson";

// E-CA
import smfnElkhorn from "./polys/e-ca/smfn-elkhorn.geojson";
import smfnParadise from "./polys/e-ca/smfn-paradise.geojson";
import smfsElkhorn from "./polys/e-ca/smfs-elkhorn.geojson";
import smfsParadise from "./polys/e-ca/smfs-paradise.geojson";

// A
import morgan from "./polys/a/morgan.geojson";
import seca from "./polys/a/seca.geojson";
import sfowLicke from "./polys/a/sfow-licke.geojson";
import sfowToga from "./polys/a/sfow-toga.geojson";
import sfoeLicke from "./polys/a/sfoe-licke.geojson";
import sfoeToga from "./polys/a/sfoe-toga.geojson";

// B
import sfowBoulder from "./polys/b/sfow-boulder.geojson";
import sfowCedar from "./polys/b/sfow-cedar.geojson";
import sfowFoster from "./polys/b/sfow-foster.geojson";
import sfowLaguna from "./polys/b/sfow-laguna.geojson";
import sfowNiles from "./polys/b/sfow-niles.geojson";
import sfowWoodside from "./polys/b/sfow-woodside.geojson";
import sfoeBoulder from "./polys/b/sfoe-boulder.geojson";
import sfoeCedar from "./polys/b/sfoe-cedar.geojson";
import sfoeFoster from "./polys/b/sfoe-foster.geojson";
import sfoeLaguna from "./polys/b/sfoe-laguna.geojson";
import sfoeNiles from "./polys/b/sfoe-niles.geojson";
import sfoeWoodside from "./polys/b/sfoe-woodside.geojson";

// C
import sfowValley from "./polys/c/sfow-valley.geojson";
import sfowGrove from "./polys/c/sfow-grove.geojson";
import sfowSunol from "./polys/c/sfow-sunol.geojson";
import sfoeValley from "./polys/c/sfoe-valley.geojson";
import sfoeGrove from "./polys/c/sfoe-grove.geojson";
import sfoeSunol from "./polys/c/sfoe-sunol.geojson";

// D
import sfowRichmond from "./polys/d/sfow-richmond.geojson";
import sfowSutro from "./polys/d/sfow-sutro.geojson";
import sfoeRichmond from "./polys/d/sfoe-richmond.geojson";
import sfoeSutro from "./polys/d/sfoe-sutro.geojson";

const DEFAULT_MAP_STYLE: MapStyle = {
  value: "mapbox://styles/mapbox/empty-v9",
  label: "Empty",
  disabled: false,
};

const DEFAULT_VIEWPORT: Viewport = {
  center: [-121.4, 37.8],
  zoom: 7,
  pitch: 0,
  bearing: 0,
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

const BAY_DEFAULT_CONFIG = "SFOW";

const E_NV_POLYS: AreaPolys = {
  name: "RNO",
  defaultConfig: "RNOS",
  possibleConfigs: ["RNOS", "RNON"],
  sectorConfigs: [
    {
      sectorName: "Nugget",
      defaultColor: "#e60049",
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
      defaultColor: "#0bb4ff",
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
  possibleConfigs: ["SMFS", "SMFN"],
  sectorConfigs: [
    {
      sectorName: "Paradise",
      defaultColor: "#e6d800",
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
    {
      sectorName: "Elkhorn",
      defaultColor: "#50e991",
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
  ],
};

const D_POLYS: AreaPolys = {
  name: "D",
  defaultConfig: "SFOW",
  possibleConfigs: ["SFOW", "SFOE"],
  sectorConfigs: [
    {
      sectorName: "Richmond",
      defaultColor: "#fd9a5c",
      configPolyUrls: [
        {
          config: "SFOW",
          url: sfowRichmond,
        },
        {
          config: "SFOE",
          url: sfoeRichmond,
        },
      ],
    },
    {
      sectorName: "Sutro",
      defaultColor: "#5100e6",
      configPolyUrls: [
        {
          config: "SFOW",
          url: sfowSutro,
        },
        {
          config: "SFOE",
          url: sfoeSutro,
        },
      ],
    },
  ],
};

const A_POLYS: AreaPolys = {
  name: "A",
  defaultConfig: "SFOW",
  possibleConfigs: ["SFOW", "SFOE"],
  sectorConfigs: [
    {
      sectorName: "Morgan",
      defaultColor: "#621065",
      configPolyUrls: [
        {
          config: "SFOW",
          url: morgan,
        },
        {
          config: "SFOE",
          url: morgan,
        },
      ],
    },
    {
      sectorName: "Seca",
      defaultColor: "#31754f",
      configPolyUrls: [
        {
          config: "SFOW",
          url: seca,
        },
        {
          config: "SFOE",
          url: seca,
        },
      ],
    },
    {
      sectorName: "Toga",
      defaultColor: "#674040",
      configPolyUrls: [
        {
          config: "SFOW",
          url: sfowToga,
        },
        {
          config: "SFOE",
          url: sfoeToga,
        },
      ],
    },
    {
      sectorName: "Licke",
      defaultColor: "#1abdaa",
      configPolyUrls: [
        {
          config: "SFOW",
          url: sfowLicke,
        },
        {
          config: "SFOE",
          url: sfoeLicke,
        },
      ],
    },
  ],
};

const C_POLYS: AreaPolys = {
  name: "C",
  defaultConfig: "SFOW",
  possibleConfigs: ["SFOW", "SFOE"],
  sectorConfigs: [
    {
      sectorName: "Valley",
      defaultColor: "#bca843",
      configPolyUrls: [
        {
          config: "SFOW",
          url: sfowValley,
        },
        {
          config: "SFOE",
          url: sfoeValley,
        },
      ],
    },
    {
      sectorName: "Grove",
      defaultColor: "#a30707",
      configPolyUrls: [
        {
          config: "SFOW",
          url: sfowGrove,
        },
        {
          config: "SFOE",
          url: sfoeGrove,
        },
      ],
    },
    {
      sectorName: "Sunol",
      defaultColor: "#141955",
      configPolyUrls: [
        {
          config: "SFOW",
          url: sfowSunol,
        },
        {
          config: "SFOE",
          url: sfoeSunol,
        },
      ],
    },
  ],
};

const B_POLYS: AreaPolys = {
  name: "B",
  defaultConfig: "SFOW",
  possibleConfigs: ["SFOW", "SFOE"],
  sectorConfigs: [
    {
      sectorName: "Boulder",
      defaultColor: "#7D7F7D",
      configPolyUrls: [
        {
          config: "SFOW",
          url: sfowBoulder,
        },
        {
          config: "SFOE",
          url: sfoeBoulder,
        },
      ],
    },
    {
      sectorName: "Cedar",
      defaultColor: "#FAD201",
      configPolyUrls: [
        {
          config: "SFOW",
          url: sfowCedar,
        },
        {
          config: "SFOE",
          url: sfoeCedar,
        },
      ],
    },
    {
      sectorName: "Foster",
      defaultColor: "#721422",
      configPolyUrls: [
        {
          config: "SFOW",
          url: sfowFoster,
        },
        {
          config: "SFOE",
          url: sfoeFoster,
        },
      ],
    },
    {
      sectorName: "Laguna",
      defaultColor: "#2271B3",
      configPolyUrls: [
        {
          config: "SFOW",
          url: sfowLaguna,
        },
        {
          config: "SFOE",
          url: sfoeLaguna,
        },
      ],
    },
    {
      sectorName: "Niles",
      defaultColor: "#317F43",
      configPolyUrls: [
        {
          config: "SFOW",
          url: sfowNiles,
        },
        {
          config: "SFOE",
          url: sfoeNiles,
        },
      ],
    },
    {
      sectorName: "Woodside",
      defaultColor: "#1D1E33",
      configPolyUrls: [
        {
          config: "SFOW",
          url: sfowWoodside,
        },
        {
          config: "SFOE",
          url: sfoeWoodside,
        },
      ],
    },
  ],
};

export {
  DEFAULT_MAP_STYLE,
  MAP_STYLES,
  NCT_MAPS,
  E_NV_POLYS,
  E_CA_POLYS,
  A_POLYS,
  C_POLYS,
  D_POLYS,
  B_POLYS,
  DEFAULT_VIEWPORT,
};
