import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1Ijoia2VuZ3JlaW0iLCJhIjoiY2x3MW15aGtzMGRuNzJrbHIybWNuM3BibyJ9.aMwzzc4Q0-bPHtWI-_MEQg";

const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/kengreim/clw1n6q6s01zr01q1evxbepei",
  center: [-121.4, 37.8], // starting position to center NCT visually
  zoom: 7, // starting zoom
});
