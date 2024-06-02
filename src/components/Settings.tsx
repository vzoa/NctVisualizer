import {
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui-core";
import { Component, Show } from "solid-js";
import { Settings } from "../types";
import { SetStoreFunction } from "solid-js/store";

interface SettingsProps {
  settings: Settings;
  setSettings: SetStoreFunction<Settings>;
}

export const SettingsDialog: Component<SettingsProps> = (props) => {
  return (
    <Dialog>
      <DialogTrigger class="border rounded border-gray-400 p-1 bg-white bg-opacity-50 hover:bg-gray-300 hover:bg-opacity-50 transition text-gray-700">
        SETTINGS
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Changes will be be saved automatically to your local browser.
          </DialogDescription>
        </DialogHeader>
        <div class="flex items-center">
          <Checkbox
            checked={props.settings.popup.followMouse}
            onChange={(val) => props.setSettings("popup", "followMouse", val)}
          ></Checkbox>
          <label class="ml-1.5">Popup: follow mouse</label>
        </div>
        <div class="flex items-center">
          <Checkbox
            checked={props.settings.popup.showUncheckedSectors}
            onChange={(val) => props.setSettings("popup", "showUncheckedSectors", val)}
          ></Checkbox>
          <label class="ml-1.5">Popup: show information for non-displayed sectors</label>
        </div>
        <Show when={props.settings.popup.showUncheckedSectors}>
          <div class="flex items-center">
            <Checkbox
              checked={props.settings.popup.uncheckedSectorsInVisibleSectorsOnly}
              onChange={(val) =>
                props.setSettings("popup", "uncheckedSectorsInVisibleSectorsOnly", val)
              }
            ></Checkbox>
            <label class="ml-1.5">
              Popup: show information for non-displayed sectors only when hovering visible sectors
            </label>
          </div>
        </Show>
        {/*Stuff here*/}
      </DialogContent>
    </Dialog>
  );
};
