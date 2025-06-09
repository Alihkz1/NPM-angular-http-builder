import { HttpBuilderFunction } from "./http-builder";
import { HttpBuilderConfig } from "./shared/config.interface";

let globalConfig: HttpBuilderConfig = {
  baseUrl: "",
  authToken: "",
};

export function InitHttpBuilder(config: HttpBuilderConfig): void {
  globalConfig = config;
}

export function setAuthToken(authToken: string) {
  globalConfig.authToken = authToken;
}

export function Api(instanceConfig?: HttpBuilderConfig) {
  const mergedConfig: HttpBuilderConfig = {
    ...globalConfig,
    ...instanceConfig,
  };
  return HttpBuilderFunction(mergedConfig);
}

// error handling

export * from "./shared";
