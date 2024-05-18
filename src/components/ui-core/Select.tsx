import type { Component, ValidComponent } from "solid-js";
import { splitProps } from "solid-js";

import { PolymorphicProps } from "@kobalte/core/polymorphic";
import {
  SelectContentProps,
  SelectItemProps,
  Select as SelectPrimitive,
  SelectTriggerProps,
} from "@kobalte/core/select";

import { cn } from "../../lib/utils";

const Select = SelectPrimitive;

const SelectValue = SelectPrimitive.Value;

type TriggerProps<T extends ValidComponent = "button"> = PolymorphicProps<T, SelectTriggerProps>;

const SelectTrigger: Component<TriggerProps> = (props) => {
  const [, rest] = splitProps(props, ["class", "children"]);
  return (
    <SelectPrimitive.Trigger
      class={cn(
        "flex h-8 w-full items-center justify-between rounded-sm border border-input bg-slate-800 hover:bg-slate-700 px-3 py-2 text-sm ring-offset-slate-900 text-white placeholder:text-gray-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        props.class
      )}
      {...rest}
    >
      {props.children}
      <SelectPrimitive.Icon>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-4 opacity-50"
        >
          <path d="M6 9l6 6l6 -6" />
        </svg>
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
};

type ContentProps<T extends ValidComponent = "div"> = PolymorphicProps<T, SelectContentProps>;

const SelectContent: Component<ContentProps> = (props) => {
  const [, rest] = splitProps(props, ["class"]);
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        class={cn(
          "relative z-50 min-w-32 overflow-hidden rounded-md border bg-slate-800 text-gray-300 shadow-xl",
          props.class
        )}
        {...rest}
      >
        <SelectPrimitive.Listbox class="m-0 p-1" />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
};

type ItemProps<T extends ValidComponent = "li"> = PolymorphicProps<T, SelectItemProps>;

const SelectItem: Component<ItemProps> = (props) => {
  const [, rest] = splitProps(props, ["class", "children"]);
  return (
    <SelectPrimitive.Item
      class={cn(
        "relative mt-0 flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-slate-700 focus:text-gray-100 disabled:pointer-events-none disabled:opacity-50",
        props.class
      )}
      {...rest}
    >
      <span class="absolute left-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-4"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M5 12l5 5l10 -10" />
          </svg>
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemLabel>{props.children}</SelectPrimitive.ItemLabel>
    </SelectPrimitive.Item>
  );
};

export { Select, SelectValue, SelectTrigger, SelectContent, SelectItem };
