import { AreaPolys } from "../types";

const getGeojsonSources = (config: AreaPolys) =>
  config.sectorConfigs.flatMap((config) =>
    config.polys.map((p) => ({
      id: `${config.config}_${p.name}`,
      url: p.url,
    }))
  );

export { getGeojsonSources };
