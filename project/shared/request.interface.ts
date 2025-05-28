import { RequestType } from "./request.type";

export interface IRequest {
  body: Object;
  action: string;
  params: Object;
  version: string;
  endpoint: string;
  controller: string;
  method: RequestType;
  pathVariable: string;
}
