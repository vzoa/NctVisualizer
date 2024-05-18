import { Component } from "solid-js";

export const Footer: Component = (props) => (
  <div class="w-[180px] text-xs">
    <p class="text-slate-400">
      For simulation purposes only. Do not use for real world flight or ATC operations.
    </p>
    <a
      href="https://oakartcc.org"
      class="text-slate-300 hover:text-slate-200 py-2 font-bold inline-block"
    >
      Oakland ARTCC on VATSIM
    </a>
  </div>
);
