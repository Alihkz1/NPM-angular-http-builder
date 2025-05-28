import { Api } from "./request-builder";

let globalConfig = {};

export function init(c) {
  globalConfig = c;
}

export function createApi(instanceConfig = {}) {
  const config = globalConfig
    ? { ...globalConfig, ...instanceConfig }
    : instanceConfig;
  return new Api(config);
}

module.exports = { init, Api: createApi };
