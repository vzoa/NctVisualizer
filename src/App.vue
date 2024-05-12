<template>
  <div class="flex h-screen">
    <div class="bg-slate-900 p-4">
      <h1 class="text-white text-2xl">NCT Visualizer</h1>
    </div>
    <div class="grow">
      <div id="map" class="w-full h-full"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import mapboxgl from 'mapbox-gl';
import '../node_modules/mapbox-gl/dist/mapbox-gl.css';

const map = ref<mapboxgl.Map>();

onMounted(() => {
  mapboxgl.accessToken = "pk.eyJ1Ijoia2VuZ3JlaW0iLCJhIjoiY2x3MW15aGtzMGRuNzJrbHIybWNuM3BibyJ9.aMwzzc4Q0-bPHtWI-_MEQg";
  map.value = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/kengreim/clw1n6q6s01zr01q1evxbepei",
    center: [-121.4, 37.8], // starting position to center NCT visually
    zoom: 7, // starting zoom
  });
})

onUnmounted(() => {
  map.value?.remove();
  map.value = undefined;
})

</script>
