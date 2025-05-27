import { ParamsHandler } from "./params-handler";
import axios from "axios";

export function Api(): RequestBuilder {
  return new RequestBuilder();
}

("$isLogin");

interface IRequest {
  method: requestType;
  body?: Object;
  params?: Object;
  endpoint?: string;
  controller: string;
  action: string;
  pathVariable: string;
  version?: string;
}

interface RequestOptions {
  headers: Object;
  params: Object;
}

export class RequestBuilder {
  private request: Partial<IRequest> = {
    endpoint: "$baseUrl",
    version: "v1",
  };

  private requestOptions: Partial<RequestOptions> = {
    params: this.request.body,
    headers: { Authorization: "Bearer $token" },
  };

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
    const urlParams = new ParamsHandler(params);
    this.request.params = urlParams.urlParameters();
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

  public version(version: string): this {
    this.request.version = version;
    return this;
  }

  public endpoint(endpoint: string): this {
    this.request.endpoint = endpoint;
    return this;
  }

  private get getVersion() {
    return this.request.version!.length ? this.request.version + "/" : "";
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
          .get(this.request.params ? url + "?" + this.request.params : url, {})
          .then((error) => this.errorHandler(error));
      case "put":
        return (
          axios
            // .put(url, this.request.body, this.requestOptions)
            .put(url, this.request.body, {})
            .then((error) => this.errorHandler(error))
        );
      case "delete":
        return (
          axios
            // .delete(url, { ...this.requestOptions, body: this.request.body })
            .delete(url, {})
            .then((error) => this.errorHandler(error))
        );
    }
  }

  onUnauthorize = () => {};
  onBadRequest = () => {};
  onForbidden = () => {};

  errorHandler(e) {}
}

export type requestType = "get" | "post" | "put" | "delete";
