import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable()
export class HelperService {
  baseUrl: string = environment.api_base_url;

  constructor(private HttpClient: HttpClient) { }

  private headers() {
    return new HttpHeaders();
  }

  get(
    url,
    params?:
      | HttpParams
      | {
        [param: string]: string | string[];
      }
  ) {
    return this.HttpClient.get(`${this.baseUrl}${url}`, {
      headers: this.headers(),
      params: params,
    });
  }

  getUrlWithQueryParametersFromFormPayload(payload, url) {
    let inputs = [];
    for (let key in payload) {
      let input = payload[key];
      console.log(input == "");
      if (input != null && input != undefined && input != "") {
        inputs.push({
          key: key,
          value: input,
        });
      }
    }
    if (inputs.length > 0) {
      if (!url.includes("?")) url += "?";
      inputs.forEach((input, index) => {
        if (inputs.length - 1 == index) {
          url += `${input.key}=${input.value}`;
          return;
        }
        url += `${input.key}=${input.value}&`;
      });
    }
    return url;
  }

  removeNullQParams(params: HttpParams) {
    if (params) {
      const paramsKeysAux = Object.keys(params);
      if (paramsKeysAux && paramsKeysAux.length > 0) {
        paramsKeysAux.forEach((key) => {
          const value = params[key];
          if (value === null || value === undefined || value === "") {
            delete params[key];
          }
        });
      }
    }

    return params;
  }

  getWithQParam(
    url,
    params?:
      | HttpParams
      | {
        [param: string]: string | string[];
      },
    qParams?
  ) {
    let _url;
    if (qParams && Object.keys(qParams).length > 0) {
      _url = this.getUrlWithQueryParametersFromFormPayload(
        qParams || params,
        url
      );
      return this.HttpClient.get(`${this.baseUrl}${_url}`, {
        headers: this.headers(),
        params: params,
      });
    } else
      return this.HttpClient.get(`${this.baseUrl}${url}`, {
        headers: this.headers(),
        params: params,
      });
  }

  deepCopy(obj: any): any {
    var copy: any;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
      copy = [];
      for (var i = 0, len = obj.length; i < len; i++) {
        copy[i] = this.deepCopy(obj[i]);
      }
      return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
      copy = {};
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = this.deepCopy(obj[attr]);
      }
      return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
  }
}
