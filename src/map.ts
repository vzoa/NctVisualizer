import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1Ijoia2VuZ3JlaW0iLCJhIjoiY2x3MW15aGtzMGRuNzJrbHIybWNuM3BibyJ9.aMwzzc4Q0-bPHtWI-_MEQg";

const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/kengreim/clw1n6q6s01zr01q1evxbepei", // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  center: [41, 21], // starting position
  zoom: 3, // starting zoom
});

map.on("load", (e) => {
  console.log(map.getStyle());
});
