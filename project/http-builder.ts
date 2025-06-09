import axios from "axios";
import { HttpBuilderConfig } from "./shared/config.interface";
import { RequestOptions } from "./shared/request-options.interface";
import { IRequest } from "./shared/request.interface";
import { catchError, from, Observable, throwError } from "rxjs";

export function HttpBuilderFunction(config: HttpBuilderConfig): HttpBuilder {
  return new HttpBuilder(config);
}

export class HttpBuilder {
  authToken: string = "";

  private request: Partial<IRequest> = {
    version: "v1",
  };

  private get getVersion() {
    console.info("got version! this.request: ", this.request);
    return this.request.version ? this.request.version + "/" : "";
  }

  private requestOptions: Partial<RequestOptions> | undefined;

  constructor(config: HttpBuilderConfig) {
    this.request.endpoint = config.baseUrl;
    this.authToken = config.authToken;
    this.requestOptions = {
      ...this.requestOptions,
      headers: {
        ...(config.authToken
          ? { Authorization: `Bearer ${config.authToken}` }
          : {}),
      },
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

  public call(): Observable<any> {
    if (!this.request.method) {
      return throwError(() => new Error("HTTP method not specified"));
    }
    if (!this.request.endpoint) {
      return throwError(() => new Error("Endpoint not specified"));
    }
    if (!this.request.controller) {
      return throwError(() => new Error("Controller not specified"));
    }

    let url = `${this.request.endpoint}${this.getVersion}${this.request.controller}`;
    if (this.request.action) url += `/${this.request.action}`;
    if (this.request.pathVariable) url += `/${this.request.pathVariable}`;

    let request: Promise<any>;
    const config: any = {
      params: this.request.params,
      headers: this.requestOptions?.headers,
    };

    switch (this.request.method) {
      case "post":
        request = axios.post(url, this.request.body, config);
        break;
      case "get":
        request = axios.get(url, config);
        break;
      case "put":
        request = axios.put(url, this.request.body, config);
        break;
      case "delete":
        request = axios.delete(url, config);
        break;
      default:
        return throwError(
          () => new Error(`Unsupported method: ${this.request.method}`)
        );
    }
    return from(request).pipe(
      catchError((error) => {
        if (error.response) {
          const status = error.response.status;
          if (status === 401) this.onUnauthorize();
          if (status === 400) this.onBadRequest();
          if (status === 403) this.onForbidden();
        }
        return throwError(() => error);
      })
    );
  }

  onUnauthorize = () => {};
  onBadRequest = () => {};
  onForbidden = () => {};

  errorHandler(e: unknown) {
    console.error("error in response of the request");
    console.error(e);
  }
}
