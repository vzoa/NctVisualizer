import type { Component } from "solid-js";

const App: Component = () => {
  return (
    <div class="flex h-screen">
      <div class="bg-slate-900 p-4 flex-row space-y-4">
        <h1 class="text-white text-2xl">NCT Visualizer</h1>
        <div>
          <h2 class="text-white text-xl">Base Maps</h2>
        </div>
        <div>
          <h2 class="text-white text-xl">Sectors</h2>
        </div>
      </div>
      <div class="grow">
        <div id="map" class="w-full h-full" />
      </div>
    </div>
  );
};

export default App;
