import { Accessor, Setter } from "solid-js";

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
  configPolyUrls: { config: AirspaceConfig; url: string }[];
}

interface AreaPolys {
  defaultConfig: AirspaceConfig;
  sectorConfigs: AirspaceConfigWithPolys[];
}

interface AirspaceDisplayState {
  selectedConfig: AirspaceConfig;
  sectors: {
    name: SectorName;
    isDisplayed: boolean;
  }[];
}

export type { NctMap, NctMapWithSignal, MapStyle, AreaPolys, AirspaceConfig, AirspaceDisplayState };
