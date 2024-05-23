import { Component, Show } from "solid-js";
import {
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui-core";
import { Settings } from "../types";
import { SetStoreFunction } from "solid-js/store";

interface FooterProps {
  settings: Settings;
  setSettings: SetStoreFunction<Settings>;
}

export const Footer: Component<FooterProps> = (props) => (
  <div>
    <Dialog>
      <DialogTrigger class="text-white text-sm">Settings...</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Changes will be be saved automatically to your local browser.
          </DialogDescription>
        </DialogHeader>
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
    <div class="w-[180px] text-xs mt-2">
      <p class="text-slate-400">
        For simulation purposes only. Do not use for real world flight or ATC operations.
      </p>
      <a
        href="https://oakartcc.org"
        class="text-slate-300 hover:text-slate-200 py-2 font-bold inline-block"
      >
        Oakland ARTCC on VATSIM
      </a>
      <a href="https://github.com/vzoa/NctVisualizer">
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          class="w-6 h-6 fill-slate-300 hover:fill-slate-200"
        >
          <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
        </svg>
      </a>
    </div>
  </div>
);
