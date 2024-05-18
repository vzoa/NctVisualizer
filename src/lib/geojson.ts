import { AirspaceDisplayState, AreaPolys } from "../types";
import { MapboxGeoJSONFeature } from "mapbox-gl";

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
    const id = feature.layer.id;
    if (!uniqueIds.has(id)) {
      uniqueIds.add(id);
      uniqueFeatures.push(feature);
    }
  }
  return uniqueFeatures;
};

export { getGeojsonSources, createDefaultState, getUniqueLayers };
