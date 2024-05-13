import { Select } from "@kobalte/core/select";
import { Accessor, Component, Setter } from "solid-js";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/Select";

interface MapStyle {
  value: string;
  label: string;
  disabled: boolean;
}

export const DEFAULT_MAP_STYLE: MapStyle = { value: "mapbox://styles/mapbox/empty-v9", label: "Empty", disabled: false }

const MAP_STYLES: MapStyle[] = [DEFAULT_MAP_STYLE].concat([
  { value: "mapbox://styles/mapbox/light-v11", label: "World Light", disabled: false }
]);

interface MapStyleSelectorProps {
  style: Accessor<MapStyle>,
  setStyle: Setter<MapStyle>
}

const MapStyleSelector: Component<MapStyleSelectorProps> = (props) => {
  return (
    <Select
      options={MAP_STYLES}
      optionValue="value"
      optionTextValue="label"
      optionDisabled="disabled"
      value={props.style()}
      onChange={props.setStyle}
      itemComponent={(props) => <SelectItem item={props.item}>{props.item.rawValue.label}</SelectItem>}
    >
      <SelectTrigger aria-label="Map Style" class="w-[180px]">
        <SelectValue<MapStyle>>{(state) => state.selectedOption().label}</SelectValue>
      </SelectTrigger>
      <SelectContent/>
    </Select>
  );
}

export { MapStyleSelector }