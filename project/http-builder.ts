import axios from "axios";
import { Config } from "./shared/config.interface";
import { RequestOptions } from "./shared/request-options.interface";
import { IRequest } from "./shared/request.interface";

export function Api(config: Config): HttpBuilder {
  return new HttpBuilder(config);
}

export class HttpBuilder {
  baseUrl: string = "";
  authToken: string = "";

  private request: Partial<IRequest> = {
    endpoint: this.baseUrl,
    version: "v1",
  };

  private get getVersion() {
    return this.request.version!.length ? this.request.version + "/" : "";
  }

  private requestOptions: Partial<RequestOptions>;

  constructor(config: Config) {
    this.baseUrl = config.baseUrl;
    this.authToken = config.authToken;
    this.requestOptions.headers = {
      ...(config.authToken
        ? { Authorization: `Bearer ${config.authToken}` }
        : {}),
    };
  }

  public get(): this {
    this.request.method = "get";
    return this;
  }
  public post(): this {
    this.request.method = "post";
    return this;
  }
  public put(): this {
    this.request.method = "put";
    return this;
  }
  public delete(): this {
    this.request.method = "delete";
    return this;
  }

  public body(body: any): this {
    this.request.body = body;
    return this;
  }

  public param(params: any): this {
    this.request.params = params;
    return this;
  }

  public version(version: string): this {
    this.request.version = version;
    return this;
  }

  public endpoint(endpoint: string): this {
    this.request.endpoint = endpoint;
    return this;
  }

  public controller(controller: string): this {
    this.request.controller = controller;
    return this;
  }

  public action(action: string): this {
    this.request.action = action;
    return this;
  }

  public pathVariable(variable: string): this {
    this.request.pathVariable = variable;
    return this;
  }

  public call(): any {
    let url = this.request.endpoint + this.getVersion + this.request.controller;
    if (this.request.action!.length) url += "/" + this.request.action;
    if (this.request.pathVariable!.length)
      url += "/" + this.request.pathVariable;

    switch (this.request.method) {
      case "post":
        return axios
          .post(url, this.request.body, {})
          .then((error) => this.errorHandler(error));
      case "get":
        return axios
          .get(url, { params: this.request.params })
          .then((error) => this.errorHandler(error));
      case "put":
        return axios
          .put(url, this.request.body)
          .then((error) => this.errorHandler(error));
      case "delete":
        return axios.delete(url).then((error) => this.errorHandler(error));
    }
  }

  onUnauthorize = () => {};
  onBadRequest = () => {};
  onForbidden = () => {};

  errorHandler(e) {
    console.error("error in response of the request");
    console.error(e);
  }
}
