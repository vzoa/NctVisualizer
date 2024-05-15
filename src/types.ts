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

type SectorName = "Nugget" | "Silver" | "Elkhorn" | "Expo";

interface AirspaceConfigWithPolys {
  config: AirspaceConfig;
  polys: Poly[];
}

interface Poly {
  name: SectorName;
  url: string;
}

interface AreaPolys {
  isSectorized: boolean;
  sectorConfigs: AirspaceConfigWithPolys[];
}

export type { NctMap, NctMapWithSignal, MapStyle, AreaPolys };
