import { Accessor, Setter } from "solid-js";
import mapboxgl from "mapbox-gl";

interface NctMap {
  name: string;
  url: string;
  sourceLayer: string;
  showDefault: boolean;
}

interface NctMapWithSignal extends NctMap {
  getter: Accessor<boolean | undefined> | Accessor<boolean>;
  setter: Setter<boolean | undefined> | Setter<boolean>;
}

interface MapStyle {
  value: string;
  label: string;
  disabled: boolean;
}

type AirspaceConfigDependentGroup = "RNO" | "SMF" | "BAY";

type AirspaceConfig =
  | "RNON"
  | "RNOS"
  | "SMFN"
  | "SMFS"
  | "SFOW"
  | "SFOE"
  | "SFO10"
  | "OAKE"
  | "SJCE";

type SectorName = "Nugget" | "Silver" | "Elkhorn" | "Paradise";

interface AirspaceConfigWithPolys {
  sectorName: SectorName;
  defaultColor: string;
  configPolyUrls: { config: AirspaceConfig; url: string }[];
}

interface AreaPolys {
  name: AirspaceConfigDependentGroup;
  defaultConfig: AirspaceConfig;
  possibleConfigs: AirspaceConfig[];
  sectorConfigs: AirspaceConfigWithPolys[];
}

interface AirspaceDisplayState {
  name: AirspaceConfigDependentGroup;
  selectedConfig: AirspaceConfig;
  sectors: SectorDisplayState[];
}

interface AppDisplayState {
  updateCount: number;
  areaDisplayStates: AirspaceDisplayState[];
}

interface PolyDefinition {
  name: AirspaceConfigDependentGroup;
  polys: AreaPolys;
}

interface SectorDisplayState {
  name: SectorName;
  isDisplayed: boolean;
  color: string;
}

interface PopupState {
  hoveredPolys: mapboxgl.MapboxGeoJSONFeature[];
  vis: boolean;
}

export type {
  NctMap,
  NctMapWithSignal,
  MapStyle,
  AreaPolys,
  AirspaceConfig,
  AirspaceDisplayState,
  AppDisplayState,
  AirspaceConfigDependentGroup,
  SectorName,
  PolyDefinition,
  SectorDisplayState,
  PopupState,
};
