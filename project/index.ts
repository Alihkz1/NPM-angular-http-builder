import { Api } from "./http-builder";
import { HttpBuilderConfig } from "./shared/config.interface";

let globalConfig: HttpBuilderConfig = {
  baseUrl: "",
  authToken: "",
};

export function InitHttpBuilder(config: HttpBuilderConfig): void {
  globalConfig = config;
}

export function createApi(instanceConfig: Partial<HttpBuilderConfig> = {}) {
  const mergedConfig: HttpBuilderConfig = {
    ...globalConfig,
    ...instanceConfig,
  };
  return Api(mergedConfig);
}

export * from "./shared";
export * from "./http-builder";
