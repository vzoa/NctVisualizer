import { Component, For, Show } from "solid-js";
import { AirspaceConfig, AirspaceDisplayState } from "./types";
import { SetStoreFunction } from "solid-js/store";
import { Select } from "@kobalte/core/select";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/Select";
import { Checkbox } from "./components/Checkbox";

export const SimpleSectorDisplayControls: Component<{
  airspaceConfigOptions: AirspaceConfig[];
  store: AirspaceDisplayState;
  setStore: SetStoreFunction<AirspaceDisplayState>;
  showDropdown: boolean;
}> = (props) => {
  return (
    <div>
      <Show when={props.showDropdown}>
        <Select
          options={props.airspaceConfigOptions}
          value={props.store.selectedConfig}
          onChange={(val) => props.setStore("selectedConfig", val)}
          disallowEmptySelection={true}
          itemComponent={(props) => (
            <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
          )}
        >
          <SelectTrigger aria-label="Map Style" class="w-[180px]">
            <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
          </SelectTrigger>
          <SelectContent />
        </Select>
      </Show>

      <div class="flex flex-col space-y-1 mt-2">
        <For each={props.store.sectors}>
          {(sector) => (
            <Checkbox
              label={sector.name}
              checked={sector.isDisplayed}
              onChange={(val) =>
                props.setStore(
                  "sectors",
                  (checkboxSector) => checkboxSector.name === sector.name,
                  "isDisplayed",
                  val
                )
              }
            />
          )}
        </For>
      </div>
    </div>
  );
};
