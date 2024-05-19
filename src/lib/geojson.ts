import { AirspaceDisplayState, AreaPolys } from "../types";
import mapboxgl, { MapboxGeoJSONFeature } from "mapbox-gl";

const getGeojsonSources = (config: AreaPolys) =>
  config.sectorConfigs.flatMap((config) =>
    config.configPolyUrls.map((p) => ({
      id: `${config.sectorName}_${p.config}`,
      url: p.url,
    }))
  );

const createDefaultState = (config: AreaPolys): AirspaceDisplayState => ({
  name: config.name,
  selectedConfig: config.defaultConfig,
  sectors: config.sectorConfigs.map((c) => ({
    name: c.sectorName,
    isDisplayed: false,
    color: c.defaultColor,
  })),
});

const getUniqueLayers = (features: MapboxGeoJSONFeature[]) => {
  const uniqueIds = new Set();
  const uniqueFeatures = [];
  for (const feature of features) {
    const id = feature.layer.id + feature.properties?.minAlt;
    if (!uniqueIds.has(id)) {
      uniqueIds.add(id);
      uniqueFeatures.push(feature);
    }
  }
  return uniqueFeatures;
};

const comparePolyAlts = (p1: mapboxgl.MapboxGeoJSONFeature, p2: mapboxgl.MapboxGeoJSONFeature) => {
  if (typeof p1.properties?.minAlt === "undefined" && typeof p2.properties?.minAlt === "undefined")
    return 0;
  if (typeof p1.properties?.minAlt === "undefined" && typeof p2.properties?.minAlt !== "undefined")
    return -1;
  if (typeof p1.properties?.minAlt !== "undefined" && typeof p2.properties?.minAlt === "undefined")
    return 1;
  if (p1.properties?.minAlt == p2.properties?.minAlt) {
    return p1.properties?.maxAlt - p2.properties?.maxAlt;
  }
  return p1.properties?.minAlt - p2.properties?.minAlt;
};

export { getGeojsonSources, createDefaultState, getUniqueLayers, comparePolyAlts };
