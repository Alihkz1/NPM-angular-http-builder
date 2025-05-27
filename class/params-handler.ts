
export interface Dictionary<T> {
  [Key: string]: T;
}

export class ParamsHandler {
  private params: Dictionary<any> = {};
  constructor(params: Dictionary<any> | undefined = undefined) {
    if (params !== undefined) {
      this.params = Object.assign({}, params);
    }
  }

  public static eup(object: any, ignoreNull: boolean = false): string {
    let paramJson = '';
    paramJson = JSON.stringify(object, (key, value) => {
      if (ignoreNull == false || value !== null) {
        return value;
      }
    });
    return encodeURIComponent(btoa(encodeURIComponent(paramJson)));
  }

  public static dup<T>(url: string): T {
    return url !== undefined && url !== '' ? JSON.parse(decodeURIComponent(atob(decodeURIComponent(url)))) : null;
  }

  public clear() {
    this.params = {};
  }

  public addParam(key: any, value: any): ParamsHandler {
    if (value !== undefined && value !== null) {
      this.params[key] = value;
    }
    return this;
  }

  public removeParam(key: any): ParamsHandler {
    if (Object.keys(this.params).indexOf(key) !== -1) {
      delete this.params[key];
    }
    return this;
  }

  public getParams(): object {
    return this.params;
  }

  public count(ignoreNull: boolean = false) {
    if (this.params) {
      const objPropName = Object.getOwnPropertyNames(this.params);
      return objPropName.reduce((a: number, c: string) => {
        a += (ignoreNull == false || !isEmptyOrNull(this.params[c])) ? 1 : 0;
        return a;
      }, 0);
      // return objPropName.length;
    } else {
      return 0;
    }
  }


  /* break reference */
  public toJson(ignoreNull: boolean = false): Dictionary<any> {
    const objPropName = Object.getOwnPropertyNames(this.params);
    let obj: any = {};
    for (const item of objPropName) {
      if (
        (ignoreNull === true &&
          this.params[item] !== '' &&
          this.params[item] !== null &&
          this.params[item] !== undefined) ||
        ignoreNull === false
      ) {
        obj[item] = this.params[item];
      }
    }
    return obj;
  }

  public urlParameters(ignoreNull = true, encode = false): string {
    const objPropName = Object.getOwnPropertyNames(this.params);
    let objStr = '';
    for (const item of objPropName) {
      if (
        (ignoreNull === true &&
          this.params[item] !== '' &&
          this.params[item] !== null &&
          this.params[item] !== undefined) ||
        ignoreNull === false
      ) {
        objStr += `${item}=${encode === true
          ? encodeURIComponent(this.params[item])
          : this.params[item]
          }&`;
      }
    }
    return objStr.substring(0, objStr.length - 1);
  }
}

function isEmptyOrNull(value: any): boolean {
  return (value == '' || value == null || value == undefined) ? true : false;
}
