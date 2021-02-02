import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

import { environment } from 'src/environments/environment';
import { ServiceType } from '../pojo/service-type';

@Injectable({
  providedIn: 'root'
})
export class ServiceTypeClientService {

  private getRequestOptions(lang) {
    return { 'Accept': 'application/json', 'content-type': 'application/json', 'Authorization': environment.AUTHORIZATION,'Access-Control-Allow-Origin': '*','allow-running-insecure-content':'true','lang':lang }
  }

  constructor(public http: HttpClient) { }

  public getAllServiceTypeByAppliance(id,lang): Observable<Object> {
    return this.http.get(environment.BASE_URL + environment.SERVICE_TYPE_API+"/"+environment.APPLIANCE_API+"/"+id, { headers: this.getRequestOptions(lang) });
  }

  public getAllServiceType(id,lang): Observable<Object> {
    return this.http.get(environment.BASE_URL + environment.SERVICE_TYPE_API+"/all"+"/"+id, { headers: this.getRequestOptions(lang) });
  }

  public deleteServiceType(id,lang): Observable<Object> {
    return this.http.delete(environment.BASE_URL + environment.SERVICE_TYPE_API+"/"+id, { headers: this.getRequestOptions(lang) });
  }

  public createNewServiceType(serviceType: ServiceType, lang): Observable<Object> {
    console.log(lang)
    return this.http.post(environment.BASE_URL + environment.SERVICE_TYPE_API, serviceType, { headers: this.getRequestOptions(lang) });
  }

  public updateServiceType(serviceType: ServiceType, lang): Observable<Object> {
    return this.http.put(environment.BASE_URL + environment.SERVICE_TYPE_API, serviceType, { headers: this.getRequestOptions(lang) });
  }
}
