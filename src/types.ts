import { Accessor, Setter } from "solid-js";

interface NctMap {
  name: string;
  getter: Accessor<boolean | undefined> | Accessor<boolean>;
  setter: Setter<boolean | undefined> | Setter<boolean>;
  url: string;
  sourceLayer: string;
}

interface MapStyle {
  value: string;
  label: string;
  disabled: boolean;
}

export type { NctMap, MapStyle };
