import { AirspaceDisplayState, AreaPolys, RgbaDecimal } from "../types";
import mapboxgl, { FillPaint, MapboxGeoJSONFeature } from "mapbox-gl";
import colorString from "color-string";

const getGeojsonSources = (areaConfig: AreaPolys) =>
  areaConfig.sectorConfigs.flatMap((sectorConfig) =>
    sectorConfig.configPolyUrls.flatMap((polyDef) =>
      polyDef.configs.map((config) => ({
        id: `${sectorConfig.sectorName}_${config}`,
        url: polyDef.url,
      }))
    )
  );

const createDefaultState = (config: AreaPolys): AirspaceDisplayState => ({
  name: config.name,
  selectedConfig: config.defaultConfig,
  sectors: config.sectorConfigs.map((c) => ({
    name: c.sectorName,
    parentAreaName: config.name,
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

const getFillColor = (paint: FillPaint): string => {
  let c = paint["fill-color"] as RgbaDecimal;
  return colorString.to.hex([c.r * 255, c.g * 255, c.b * 255, c.a]);
};

const isTransparentFill = (paint: FillPaint): boolean => {
  let c = paint["fill-color"] as RgbaDecimal;
  return c.a === 0;
};

export {
  getGeojsonSources,
  createDefaultState,
  getUniqueLayers,
  comparePolyAlts,
  getFillColor,
  isTransparentFill,
};
