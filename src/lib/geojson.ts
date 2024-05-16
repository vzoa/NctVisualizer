import { AirspaceDisplayState, AreaPolys } from "../types";

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
  sectors: config.sectorConfigs.map((c) => ({ name: c.sectorName, isDisplayed: false })),
});

export { getGeojsonSources, createDefaultState };
